from rest_framework.views import APIView
from rest_framework.response import Response
# from rest_framework.permissions import IsAdminUser, AllowAny
from .models import Room, Component, ComponentData, ArduinoModel
from .serializer import RoomSerializer, ComponentSerializer, ComponentDataSerializer, ArduinoSerializer, ArduinoSerializerPut
from django.shortcuts import get_object_or_404
from iot.settings import MAXIMUM_ROOMS, MAXIMUM_COMPONENT_PER_TYPE, ARDUINO_IP
import requests

# Create your views here.
class RoomView(APIView):
    '''
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]
    '''
    
    def get(self, request, room_id):
        room = get_object_or_404(Room, id=room_id)
        serializer = RoomSerializer(room, many=False)
        return Response(serializer.data, status=200)
    
    def post(self, request):
        if Room.objects.all().count() >= MAXIMUM_ROOMS:
            return Response({"error": "Maximum number of supported rooms reached"}, status=400)

        serializer = RoomSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=400)
        
        try:
            serializer.save()
            return Response(serializer.data, status=201)
        except Exception as e:
            return Response({"error": f"Error saving room: {str(e)}"}, status=500)
        
    def delete(self, request, room_id):
        room = Room.objects.get(id=room_id)
        room.delete()
        return Response(status=204)
    
class RoomsView(APIView):
    def get(self, request):
        rooms = Room.objects.all()
        if not rooms:
            return Response({"error": "No rooms found"}, status=404)
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data, status=200)
    
class ComponentView(APIView):
    '''
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]
    '''

    def get(self, request, component_id):
        component = get_object_or_404(Component, id=component_id)
        serializer = ComponentSerializer(component, many=False)
        return Response(serializer.data, status=200)
        
    def post(self, request):
        serializer = ComponentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=400)
        
        if Component.objects.filter(type=request.data['type']).count() >= MAXIMUM_COMPONENT_PER_TYPE:
            return Response({"error": "Maximum number of the submitted component reached"}, status=400)

        serializer.save()
        return Response(serializer.data, status=201)
        
    def put(self, request, component_id):
        serializer = ComponentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=400)
        
        serializer.update(instance=Component.objects.get(id=component_id), validated_data=request.data)
        return Response(serializer.data, status=200)
        
    def delete(self, request, component_id):
        component = Component.objects.get(id=component_id)
        component.delete()
        return Response({"message": f"Component with '{component.id}' deleted successfully"}, status=200)
        
class ComponentsView(APIView):
    def get(self, request):
        components = Component.objects.all()
        if not components:
            return Response({"error": "No components found"}, status=404)
        serializer = ComponentSerializer(components, many=True)
        return Response(serializer.data, status=200)
    
class ComponentDataView(APIView):
    '''
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]
    '''

    def get(self, request, id):
        data = get_object_or_404(ComponentData, id=id)
        serializer = ComponentDataSerializer(data, many=False)
        return Response(serializer.data, status=200)
        
    def post(self, request):
        serializer = ComponentDataSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=400)
        
        serializer.save()
        return Response(serializer.data, status=201)
        
    def delete(self, request, component_data_id):
        component_data = ComponentData.objects.get(id=component_data_id)
        component_data.delete()
        return Response({"message": f"Component data with '{component_data.id}' deleted successfully"}, status=200)
    
class ArduinoView(APIView):
    def get(self, request):
        serializer = ArduinoSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=400)
        
        response = requests.get(f'http://{ARDUINO_IP}/{serializer.validated_data["type"]}?id={serializer.validated_data["room_id"]}&pin={serializer.validated_data["pin"]}')
    
        if response.status_code == 200:
            try:
                data = response.json()
                # save to db
                return Response(data)
            except ValueError:
                return Response({"error": "Invalid JSON from Arduino"}, status=500)
        return Response({"error": "Failed to update Arduino"}, status=500)

    
    def post(self, request):
        serializer = ArduinoSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=400)
        
        response = requests.post(f'http://{ARDUINO_IP}/{serializer.validated_data["type"]}?id={serializer.validated_data["room_id"]}&pin={serializer.validated_data["pin"]}'
)
        if response.status_code == 200:
            try:
                data = response.json()
                return Response(data)
                # save to db
            except ValueError:
                return Response({"error": "Invalid JSON from Arduino"}, status=500)
        return Response(response.json(), status=response.status_code)
       
        
    def put(self, request):
        serializer = ArduinoSerializerPut(data=request.data)
        
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=400)
        
        response = requests.put(f'http://{ARDUINO_IP}/{serializer.validated_data["type"]}?id={serializer.validated_data["room_id"]}&val={serializer.validated_data["value"]}')
    
        if response.status_code == 200:
            try:
                data = response.json()
                # save to db
                return Response(data)
            except ValueError:
                return Response({"error": "Invalid JSON from Arduino"}, status=500)

        return Response({"error": "Failed to update Arduino"}, status=500)

class EventView(APIView):
    def post(self, request):
        print(request.data)
        return Response({"message": "Event received"}, status=200)

