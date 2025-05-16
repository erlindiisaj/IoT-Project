from rest_framework import serializers
from .models import Room, Component, ComponentData

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name']
        read_only_fields = ['id']

class ComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Component
        fields = ['id', 'type', 'pin','room']
        read_only_fields = ['id']

class ComponentDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComponentData
        fields = ['id', 'component', 'mode', 'action', 'timestamp', 'previous_value', 'current_value']
        read_only_fields = ['id']
