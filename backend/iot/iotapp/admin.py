from django.contrib import admin
from .models import Room, Component, ComponentData

# Register your models here.
admin.site.register(Room)
admin.site.register(Component)
admin.site.register(ComponentData)