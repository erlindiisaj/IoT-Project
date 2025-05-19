from channels.generic.websocket import AsyncWebsocketConsumer
import json

class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "room_updates"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        print(f"Client connected to {self.group_name}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        print(f"Client disconnected from {self.group_name}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            print("Received from Room WebSocket:", data)
        except json.JSONDecodeError:
            print("Invalid JSON received in RoomConsumer")
            return

        await self.send(text_data=json.dumps({"status": "received"}))

    async def send_update(self, event):
        await self.send(text_data=json.dumps(event["data"]))

class ComponentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "component_updates"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        print(f"Client connected to {self.group_name}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        print(f"Client disconnected from {self.group_name}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            print("Received from Component WebSocket:", data)
        except json.JSONDecodeError:
            print("Invalid JSON received in ComponentConsumer")
            return

        await self.send(text_data=json.dumps({"status": "received"}))

    async def send_update(self, event):
        await self.send(text_data=json.dumps(event["data"]))

class ComponentDataConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "componentdata_updates"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        print(f"Client connected to {self.group_name}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        print(f"Client disconnected from {self.group_name}")

    async def receive(self, text_data):
        # Echo back for debugging
        try:
            data = json.loads(text_data)
            print("Received from client:", data)
        except json.JSONDecodeError:
            print("Invalid JSON received")
            return

        await self.send(text_data=json.dumps({"status": "received"}))

    async def send_update(self, event):
        await self.send(text_data=json.dumps(event["data"]))



