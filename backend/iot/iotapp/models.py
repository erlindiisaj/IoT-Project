from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Mode(models.TextChoices):
    AUTO = 'AUTO', 'auto'
    MANUAL = 'MANUAL', 'manual'
    SCHEDULE = 'SCHEDULE', 'schedule'

class Action(models.TextChoices):
    ON = 'ON', 'on'
    OFF = 'OFF', 'off'
    TOGGLE = 'TOGGLE', 'toggle'
    READ = 'READ', 'read' # This action is used to read the state of a component

class Type(models.TextChoices):
    LED = 'LED', 'led'
    MOTOR = 'MOTOR', 'motor'
    DTH = 'DTH', 'dth'
    LDR = 'LDR', 'ldr'
    PIR = 'PIR', 'pir'

class APIPoints(models.TextChoices):
    LED = 'led', 'led'
    MOTOR = 'motor', 'motor'
    DTH = 'dth', 'dth'
    LDR = 'ldr', 'ldr'
    PIR = 'pir', 'pir'
    mode = 'mode', 'mode'

# Create your models here.
class Room(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    arduiono_id = models.IntegerField(unique=True, validators=[
            MinValueValidator(1),   # Minimum value
            MaxValueValidator(3)  # Maximum value
        ])

    def __str__(self):
        return self.name

class Component(models.Model):
    id = models.AutoField(primary_key=True)
    type = models.CharField(
        max_length=50,
        choices=Type.choices,
        default=Type.LED
        )
    pin = models.IntegerField(unique=True, validators=[
            MinValueValidator(1),   # Minimum value
            MaxValueValidator(100)  # Maximum value
        ])
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='components')

    def __str__(self):
        return f"{self.get_type_display()} on pin {self.pin} in {self.room.name}"
    
class ComponentData(models.Model):
    id = models.AutoField(primary_key=True)
    component = models.ForeignKey(Component, on_delete=models.CASCADE, related_name='data')
    action = models.CharField(
        max_length=50,
        choices=Action.choices,
        default=Action.OFF
        )
    mode = models.CharField(
        max_length=50,
        choices=Mode.choices,
        default=Mode.AUTO
        )
    timestamp = models.DateTimeField(auto_now_add=True)
    previous_value = models.CharField(max_length=50, null=True, blank=True)
    current_value = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"{self.component} - {self.get_action_display()} at {self.timestamp}"
    

class ArduinoModel(models.Model):
    type = models.CharField(
        max_length=50,
        choices=APIPoints.choices,
        default=APIPoints.LED
        )
    room_id = models.IntegerField(validators=
        [
            MinValueValidator(1),   
            MaxValueValidator(3) 
        ]
    )
    pin = models.IntegerField()
    value = models.IntegerField(validators=
        [
            MinValueValidator(0),   
            MaxValueValidator(100) 
        ]
    )