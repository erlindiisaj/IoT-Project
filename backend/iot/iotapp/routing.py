from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/rooms/$", consumers.RoomConsumer.as_asgi()),
    re_path(r"ws/components/$", consumers.ComponentConsumer.as_asgi()),
    re_path(r"ws/component-data/$", consumers.ComponentDataConsumer.as_asgi()),
]
