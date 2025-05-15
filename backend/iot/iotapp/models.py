from django.db import models

class Action(models.TextChoices):
    ON = 'ON', 'On'
    OFF = 'OFF', 'Off'
    TOGGLE = 'TOGGLE', 'Toggle'

class Type(models.TextChoices):
    LIGHT = 'LIGHT', 'Light'
    MOTOR = 'MOTOR', 'Motor'
    THERMOSTAT = 'THERMOSTAT', 'Thermostat'

# Create your models here.
class Room(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

class Component(models.Model):
    id = models.AutoField(primary_key=True)
    type = models.CharField(
        max_length=50,
        choices=Type.choices,
        default=Type.LIGHT
        )
    pin = models.IntegerField()
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='components')