from channels.generic.websocket import AsyncWebsocketConsumer
import json

# Base class for reuse
class BaseConsumer(AsyncWebsocketConsumer):
    group_name = None  # should be overridden

    async def connect(self):
        if not self.group_name:
            await self.close()
        else:
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()

    async def disconnect(self, close_code):
        if self.group_name:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_update(self, event):
        await self.send(text_data=json.dumps(event['data']))

# One for each model
class RoomConsumer(BaseConsumer):
    group_name = "room_updates"

class ComponentConsumer(BaseConsumer):
    group_name = "component_updates"

class ComponentDataConsumer(BaseConsumer):
    group_name = "componentdata_updates"


