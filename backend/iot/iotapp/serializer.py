from rest_framework import serializers
from .models import Room, Component, ComponentData, ArduinoModel

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name', 'arduiono_id']
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


class ArduinoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArduinoModel
        fields = ['room_id', 'type', 'pin']

class ArduinoSerializerPut(serializers.ModelSerializer):
    class Meta:
        model = ArduinoModel
        fields = ['room_id', 'type', 'value']