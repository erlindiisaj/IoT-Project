from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
from .models import Room, Component, ComponentData

# Create your views here.
class RoomView(View):
    def get(self, request, room_id):
        room = Room.objects.get(id=room_id)
        if not room:
            return JsonResponse({"error": "Room not found"}, status=404)
        return JsonResponse({"id": room.id, "name": room.name}, status=200)
    
    def post(self, request):
        room_name = request.POST.get('name')
        if not room_name:
            return JsonResponse({"error": "Room name is required"}, status=400)
        room = Room(name=room_name)
        try:
            room.save()
        except Exception as e:
            return JsonResponse({"error": f"Error saving room: {str(e)}"}, status=500)

        # Double-check: confirm it's in DB
        if Room.objects.filter(id=room.id).exists():
            return JsonResponse({"id": room.id, 
                                 "name": room.name,
                                 "message": f"Room '{room.name}' created successfully"}, 
                                 status=201)
        else:
            return JsonResponse({"error": "Room not saved"}, status=500)
        
    def delete(self, request, room_id):
        try:
            room = Room.objects.get(id=room_id)
            room.delete()
            return JsonResponse({"message": f"Room '{room.name}' deleted successfully"}, status=200)
        except Room.DoesNotExist:
            return JsonResponse({"error": "Room not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": f"Error deleting room: {str(e)}"}, status=500)
    
class RoomsView(View):
    def get(self, request):
        rooms = Room.objects.all().values('id', 'name')
        return JsonResponse(list(rooms), safe=False, status=200)
    
class ComponentView(View):
    def get(self, request, component_id):
        try:
            component = Component.objects.get(id=component_id)
            return JsonResponse({"id": component.id,
                                 "type": component.type,
                                 "pin": component.pin,
                                 "room": component.room.name}, 
                                 status=200)
        except Component.DoesNotExist:
            return JsonResponse({"error": "Component not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": f"Error fetching component: {str(e)}"}, status=500)
        
    def post(self, request):
        room_id = request.POST.get('room_id')
        component_type = request.POST.get('type')
        pin = request.POST.get('pin')

        if not room_id or not component_type or not pin:
            return JsonResponse({"error": "Room ID, component type, and pin are required"}, status=400)

        try:
            room = Room.objects.get(id=room_id)
            component = Component(type=component_type, pin=pin, room=room)
            component.save()
        except Room.DoesNotExist:
            return JsonResponse({"error": "Room not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": f"Error saving component: {str(e)}"}, status=500)

        # Double-check: confirm it's in DB
        if Component.objects.filter(id=component.id).exists():
            return JsonResponse({"id": component.id,
                                 "type": component.type,
                                 "pin": component.pin,
                                 "room": component.room.name,
                                 "message": f"Component: '{component.type}' on pin {component.pin} created successfully"}, 
                                 status=201)
        else:
            return JsonResponse({"error": "Component not saved"}, status=500)
        
    def put(self, request, component_id):
        try:
            component = Component.objects.get(id=component_id)
            component.type = request.POST.get('type', component.type)
            component.pin = request.POST.get('pin', component.pin)
            component.save()
            return JsonResponse({"message": f"Component with '{component.id}' updated successfully"}, status=200)
        except Component.DoesNotExist:
            return JsonResponse({"error": "Component not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": f"Error updating component: {str(e)}"}, status=500)
        
    def delete(self, request, component_id):
        try:
            component = Component.objects.get(id=component_id)
            component.delete()
            return JsonResponse({"message": f"Component with '{component.id}' deleted successfully"}, status=200)
        except Component.DoesNotExist:
            return JsonResponse({"error": "Component not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": f"Error deleting component: {str(e)}"}, status=500)
        
class ComponentsView(View):
    def get(self, request):
        components = Component.objects.all().values('id', 'type', 'pin', 'room__name')
        return JsonResponse(list(components), safe=False, status=200)
    
class ComponentDataView(View):
    def get(self, request, component_id):
        try:
            component_data = ComponentData.objects.filter(component_id=component_id)
            if not component_data:
                return JsonResponse({"error": "No data found for this component"}, status=404)
            return JsonResponse(list(component_data.values('id', 'component_id', 'value', 'timestamp')), safe=False, status=200)
        except ComponentData.DoesNotExist:
            return JsonResponse({"error": "Component data not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": f"Error fetching component data: {str(e)}"}, status=500)
        
    def post(self, request):
        component_id = request.POST.get('component_id')
        value = request.POST.get('value')

        if not component_id or not value:
            return JsonResponse({"error": "Component ID and value are required"}, status=400)

        try:
            component = Component.objects.get(id=component_id)
            component_data = ComponentData(component=component, value=value)
            component_data.save()
        except Component.DoesNotExist:
            return JsonResponse({"error": "Component not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": f"Error saving component data: {str(e)}"}, status=500)

        # Double-check: confirm it's in DB
        if ComponentData.objects.filter(id=component_data.id).exists():
            return JsonResponse({"id": component_data.id,
                                 "component_id": component_data.component.id,
                                 "value": component_data.value,
                                 "timestamp": component_data.timestamp,
                                 "message": f"Component data saved successfully"}, 
                                 status=201)
        else:
            return JsonResponse({"error": "Component data not saved"}, status=500)
        
    def delete(self, request, component_data_id):
        try:
            component_data = ComponentData.objects.get(id=component_data_id)
            component_data.delete()
            return JsonResponse({"message": f"Component data with '{component_data.id}' deleted successfully"}, status=200)
        except ComponentData.DoesNotExist:
            return JsonResponse({"error": "Component data not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": f"Error deleting component data: {str(e)}"}, status=500)