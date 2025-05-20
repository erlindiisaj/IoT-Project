from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Mode(models.TextChoices):
    AUTO = 'auto', 'auto'
    MANUAL = 'manual', 'manual'
    BACKEND = 'backend', 'backend'

class Action(models.TextChoices):
    ON = 'on', 'on'
    OFF = 'off', 'off'
    TOGGLE = 'toggle', 'toggle'
    READ = 'read', 'read'
    SET = 'set', 'set'

class Type(models.TextChoices):
    LED = 'led', 'led'
    MOTOR = 'motor', 'motor'
    DHT = 'dht', 'dht',
    DHT_HUMIDITY = 'dht_humidity', 'dht_humidity'
    LDR = 'ldr', 'ldr'
    PIR = 'pir', 'pir'

class ApiType(models.TextChoices):
    LED = 'led', 'led'
    MOTOR = 'motor', 'motor'
    DHT = 'dht', 'dht'
    DHT_HUMIDITY = 'dht_humidity', 'dht_humidity'
    LDR = 'ldr', 'ldr'
    PIR = 'pir', 'pir'
    MODE = 'mode', 'mode'
    
# Create your models here.
class Room(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    arduiono_id = models.IntegerField(unique=True, validators=[
            MinValueValidator(1),   # Minimum value
            MaxValueValidator(3)  # Maximum value
        ])
    mode = models.IntegerField(validators=[
            MinValueValidator(0),   # Minimum value
            MaxValueValidator(1)  # Maximum value
        ])

    def __str__(self):
        return self.name

class Component(models.Model):
    id = models.AutoField(primary_key=True)
    type = models.CharField(
        max_length=50,
        choices=Type.choices
        )
    pin = models.IntegerField(unique=True, 
        null=True,
        blank=True,
        validators=[
            MinValueValidator(1),   # Minimum value
            MaxValueValidator(20)  # Maximum value
        ])
    room = models.ForeignKey(Room, on_delete=models.CASCADE)

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
    previous_value = models.IntegerField(null=True, blank=True)
    current_value = models.IntegerField()

    def __str__(self):
        return f"{self.component} - {self.get_action_display()} at {self.timestamp} with value {self.current_value}"