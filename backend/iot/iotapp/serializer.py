from rest_framework import serializers
from django.core.validators import MinValueValidator, MaxValueValidator
from .models import Room, Component, ComponentData, ApiType, Mode, Action

# Define the valid pins
PIN_MAP = {
    'led': [3, 5, 6],
    'motor': [9, 10, 11],
    'dht': [7, 8, 16],
    'ldr': [14, 15, 17],
    'pir': [2, 4, 12]
}

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = "__all__"
        read_only_fields = ['id']

class ComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Component
        fields = "__all__"
        read_only_fields = ['id']
    
    def validate(self, data):
        component_type = data.get('type')
        pin = data.get('pin')

        if component_type in PIN_MAP:
            allowed_pins = PIN_MAP[component_type]
            if allowed_pins and pin not in allowed_pins:
                raise serializers.ValidationError({
                    'pin': f"Pin {pin} is not allowed for type '{component_type}'. Allowed pins: {allowed_pins}"
                })

        return data

class ComponentDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComponentData
        fields = "__all__"
        read_only_fields = ['id']

class EventDataSerializer(serializers.Serializer):
    room_id = serializers.IntegerField(
        validators=[
            MinValueValidator(1, message='Room ID must be at least 1.'),
            MaxValueValidator(3, message='Room ID must be at most 3.')
        ]
    )
    
    type = serializers.ChoiceField(
        choices=ApiType.choices,
        error_messages={'invalid_choice': 'Invalid type choice.'}
    )

    action = serializers.ChoiceField(
        choices=Action.choices,
        error_messages={'invalid_choice': 'Invalid action choice.'}
    )

    mode = serializers.ChoiceField(
        choices=Mode.choices,
        error_messages={'invalid_choice': 'Invalid mode choice.'}
    )

    previous_value = serializers.IntegerField()

    current_value = serializers.IntegerField()