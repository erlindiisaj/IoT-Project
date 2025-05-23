from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Action, Mode, Room, Component, ComponentData
from .serializer import EventDataSerializer, RoomSerializer, ComponentSerializer, ComponentDataSerializer
from iot.settings import MAXIMUM_ROOMS, MAXIMUM_COMPONENT_PER_TYPE, ARDUINO_IP
import requests

@api_view(['GET'])
def get_room(request, room_id):
    room = get_object_or_404(Room, id=room_id)
    serializer = RoomSerializer(room)
    return Response(serializer.data)

@api_view(['GET'])
def get_rooms(request):
    rooms = Room.objects.all()
    if not rooms:
        return Response({"error": "No rooms found"}, status=404)
    serializer = RoomSerializer(rooms, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_room(request):
    if Room.objects.count() >= MAXIMUM_ROOMS:
        return Response({"error": "Maximum number of supported rooms reached"}, status=400)

    serializer = RoomSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"error": serializer.errors}, status=400)

    try:
        serializer.save()
        return Response(serializer.data, status=201)
    except Exception as e:
        return Response({"error": f"Error saving room: {str(e)}"}, status=500)

@api_view(['PUT'])
def update_room_mode(request, room_id):
    room = get_object_or_404(Room, id=room_id)
    if not room.arduiono_id:
        return Response({"error": "Room not found"}, status=404)
    
    if not request.data.get('mode'):
        return Response({"error": "Mode is required."}, status=400)

    value = int(request.data.get('mode'))
    if value < 0 or value > 1:
        return Response({"error": "Mode must be 0 or 1."}, status=400)
    
    if room.mode == value:
        return Response(status=204)
    
    response = requests.put(f'http://{ARDUINO_IP}/mode?id={room.arduiono_id}&val={value}')
    if response.status_code == 200:
        try:
            room.mode = value
            room.save()
            serializer = RoomSerializer(room)
            return Response(serializer.data)
        except ValueError:
            return Response({"error": "Invalid JSON from Arduino"}, status=500)

    return Response({"error": "Failed to update Room Mode"}, status=500)

@api_view(['DELETE'])
def delete_room(request, room_id):
    room = get_object_or_404(Room, id=room_id)
    response = requests.delete(f'http://{ARDUINO_IP}/room?id={room.arduiono_id}')
    if response.status_code != 200:
        return Response({"error": "Failed to delete room from Arduino"}, status=response.status_code)
    room.delete()
    return Response(status=204)
    
@api_view(['GET'])
def get_component(request, component_id):
    component = get_object_or_404(Component, id=component_id)
    serializer = ComponentSerializer(component)
    return Response(serializer.data)

@api_view(['GET'])
def get_components(request):
    components = Component.objects.all()
    if not components:
        return Response({"error": "No components found"}, status=404)
    serializer = ComponentSerializer(components, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_components_by_room(request, room_id):
    components = Component.objects.filter(room_id=room_id)
    if not components:
        return Response({"error": "No components found for this room"}, status=404)
    serializer = ComponentSerializer(components, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_room_components_and_values(request, room_id):
    components = Component.objects.filter(room_id=room_id)
    if not components:
        return Response({"error": "No components found for this room"}, status=404)
    
    component_values = []
    errors = []

    for component in components:
        component_value = ComponentData.objects.filter(component=component) \
                        .order_by('-timestamp') \
                        .values_list('current_value', flat=True) \
                        .first()
        
        if component_value is None:
            errors.append({"component": component.id, "error": "No data found."})
            continue
        
        serializer = ComponentSerializer(component)
        component_values.append({
            'component': serializer.data,
            'value': component_value
        })

    if errors:
        return Response({"errors": errors}, component_values, status=500)
    
    return Response(component_values, status=200)



@api_view(['GET'])
def get_component_value(request, component_id):
    component = get_object_or_404(Component, id=component_id)
    component_value = ComponentData.objects.filter(component=component) \
                        .order_by('-timestamp') \
                        .values_list('current_value', flat=True) \
                        .first()
    serializer = ComponentSerializer(component)

    if component_value is None:
        return Response({"error": "No data found."}, status=404)
    
    return Response({
        'component': serializer.data,
        'value': component_value
    }, status=200)


@api_view(['POST'])
def recreate_components(request):
    if request.data.get('power') != 'on':
        return Response({"error": "Power is off"}, status=400)
    
    rooms = Room.objects.all()
    if not rooms:
        return Response({"error": "No rooms found"}, status=404)
    
    errors = []

    for room in rooms:
        response = requests.put(f'http://{ARDUINO_IP}/mode?id={room.arduiono_id}&val={room.mode}')
        if response.status_code != 200:
            errors.append({"room": room.id, "error": response.status_code})
    
    components = Component.objects.all()
    if not components:
        return Response({"error": "No components found"}, status=404)
    
    for component in components:

        if component.type == "dht_humidity":
            continue

        if component.type == "led" or component.type == "motor":
            latest = ComponentData.objects.filter(component_id=component.id).latest('timestamp').current_value

        response = requests.post(f'http://{ARDUINO_IP}/{component.type}?id={component.room.arduiono_id}&pin={component.pin}')
        if response.status_code != 200:
            errors.append({"component": component.id, "error_type": "create", "error_code": response.status_code, "error": response.json()})
        else:
            if component.type == "led" or component.type == "motor":
                set_value = requests.put(f'http://{ARDUINO_IP}/{component.type}?id={component.room.arduiono_id}&val={latest}')
                if set_value.status_code != 200:
                    errors.append({"component": component.id, "error_type": "set", "error_code": set_value.status_code, "error": response.json()})
        
    if errors:
        print(errors)
        return Response(errors, status=500)
    
    return Response(status=200)

@api_view(['POST'])
def create_component(request):
    serializer = ComponentSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"error": serializer.errors}, status=400)
    
    if request.data['type'] == "dht_humidity" and Component.objects.filter(type=request.data['type'], room_id = request.data['room']).count() == 1:
        return Response({"error": "Only one DHT component per room is allowed"}, status=400)

    if request.data['type'] == "dht_humidity":
        serializer.save()
        return Response(serializer.data, status=201)

    if Component.objects.filter(type=request.data['type']).count() >= MAXIMUM_COMPONENT_PER_TYPE:
        return Response({"error": "Maximum number of the submitted component reached"}, status=400)

    room_instance = serializer.validated_data['room']
    arduino_id = room_instance.arduiono_id

    response = requests.post(f'http://{ARDUINO_IP}/{serializer.validated_data["type"]}?id={arduino_id}&pin={serializer.validated_data["pin"]}')
    if response.status_code == 200:
        try:
            data = response.json()
            serializer.save()
            return Response(data, status=201)
        except ValueError:
            return Response({"error": "Invalid JSON from Arduino"}, status=500)
    return Response({"error": "Failed to update Arduino"}, status=500)

@api_view(['PUT'])
def update_component_value(request, component_id):
    component = get_object_or_404(Component, id=component_id)
    if component.type not in ['led', 'motor']:
        return Response({"error": "Invalid component type. Only 'led' and 'motor' are allowed."}, status=400)
    
    raw_value = request.data.get('value')
    if raw_value is None:
        return Response({"error": "Value is required."}, status=400)

    try:
        value = int(raw_value)
    except (ValueError, TypeError):
        return Response({"error": "Value must be an integer."}, status=400)
    
    if value < 0 or value > 100:
        return Response({"error": "Value must be between 0 and 100."}, status=400)

    response = requests.put(f'http://{ARDUINO_IP}/{component.type}?id={component.room.arduiono_id}&val={value}')
    if response.status_code == 200:
        try:
            response_data = response.json()
            return Response(response_data)
        except ValueError:
            return Response({"error": "Invalid JSON from Arduino"}, status=500)
    return Response({"error": "Failed to update Arduino"}, status=500)

@api_view(['DELETE'])
def delete_component(request, component_id):
    component = get_object_or_404(Component, id=component_id)

    if component.type == "dht_humidity":
        component.delete()
        return Response({"message": f"Component with '{component.id}' deleted successfully"}, status=200)

    response = requests.delete(f'http://{ARDUINO_IP}/{component.type}?id={component.room.arduiono_id}')
    if response.status_code != 200:
        return Response({"error": "Failed to delete component from Arduino"}, status=response.status_code)
    component.delete()
    return Response({"message": f"Component with '{component.id}' deleted successfully"}, status=200)
    
@api_view(['GET'])
def get_component_data(request, id):
    data = get_object_or_404(ComponentData, id=id)
    serializer = ComponentDataSerializer(data)
    return Response(serializer.data)

@api_view(['GET'])
def get_component_data_chunk_by_room(request, room_id):
    room = get_object_or_404(Room, id=room_id)
    components = Component.objects.filter(room=room)

    if not components.exists():
        return Response({"error": "No components found for this room"}, status=404)

    data = []
    for component in components:
        component_data_qs = ComponentData.objects.filter(component=component).order_by('-timestamp')[:30]
        if component_data_qs.exists():
            serializer = ComponentDataSerializer(component_data_qs, many=True)
            data.append({
                "component_name": component.type,
                "data": serializer.data
            })

    if not data:
        return Response({"error": "No data found for this room"}, status=404)

    return Response(data)

def get_component_full_data(request, component_id):
    component = get_object_or_404(Component, id=component_id)
    data = ComponentData.objects.filter(component=component)
    if not data:
        return Response({"error": "No data found for this component"}, status=404)
    serializer = ComponentDataSerializer(data, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_component_data(request):
    print(request.data)
    serializer = EventDataSerializer(data=request.data)
    if not serializer.is_valid():
        print(serializer.errors)
        return Response({"error": serializer.errors}, status=400)

    component = get_object_or_404(Component, type=serializer.validated_data['type'], room__arduiono_id=serializer.validated_data['room_id'])
    if not component:
        return Response({"error": "Component not found"}, status=404)
    
    ComponentData.objects.create(
        component=component,
        action=serializer.validated_data['action'],
        mode=serializer.validated_data['mode'],
        previous_value=serializer.validated_data['previous_value'],
        current_value=serializer.validated_data['current_value']
    )

    return Response(serializer.data, status=201)

@api_view(['DELETE'])
def delete_component_data(request, component_data_id):
    component_data = get_object_or_404(ComponentData, id=component_data_id)
    component_data.delete()
    return Response({"message": f"Component data with '{component_data.id}' deleted successfully"}, status=200)