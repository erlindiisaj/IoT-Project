from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Room, Component, ComponentData
from .serializer import RoomSerializer, ComponentSerializer, ComponentDataSerializer

channel_layer = get_channel_layer()

def notify_group(group_name, data):
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "send_update",
            "data": data
        }
    )

@receiver([post_save, post_delete], sender=Room)
def room_changed(sender, instance, **kwargs):
    data = RoomSerializer(instance).data
    notify_group("room_updates", {"type": "room", "data": data})

@receiver([post_save, post_delete], sender=Component)
def component_changed(sender, instance, **kwargs):
    data = ComponentSerializer(instance).data
    notify_group("component_updates", {"type": "component", "data": data})

@receiver([post_save, post_delete], sender=ComponentData)
def componentdata_changed(sender, instance, **kwargs):
    data = ComponentDataSerializer(instance).data
    notify_group("componentdata_updates", {"type": "component_data", "data": data})
