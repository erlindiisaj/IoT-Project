from django.urls import path

from . import consumers
from . import views

urlpatterns = [
    path('rooms/get/<int:room_id>/', views.get_room, name='room'),
    path('rooms/get/all', views.get_rooms, name='all_rooms'),
    path('rooms/get/mode/<int:room_id>/', views.get_room_mode, name='room_mode'),
    path('rooms/create/', views.create_room, name='create_room'),
    path('rooms/update/mode/<int:room_id>', views.update_room_mode, name='update_room_mode'),
    path('rooms/delete/<int:room_id>', views.delete_room, name='delete_room'),

    path('componets/get/<int:component_id>/', views.get_component, name='component'),
    path('componets/get/all', views.get_components, name='all_components'),
    path('components/get/room/<int:room_id>/', views.get_components_by_room, name='components_by_room'),
    path('components/get/value/<int:component_id>/', views.get_component_value, name='component_value'),
    path('components/create/', views.create_component, name='create_component'),
    path('components/update/value/<int:component_id>/', views.update_component_value, name='update_component_value'),
    path('components/delete/<int:component_id>/', views.delete_component, name='delete_component'),

    path('data/get/<int:data_id>/', views.get_component_data, name='component_data'),
    path('components/data/get/<int:component_id>', views.get_component_full_data, name='all_component_data'),
    path('event', views.create_component_data, name='create_component_data'),
    path('data/delete/<int:data_id>/', views.delete_component_data, name='delete_component_data'),

    path("ws/rooms/", consumers.RoomConsumer.as_asgi()),
    path("ws/components/", consumers.ComponentConsumer.as_asgi()),
    path("ws/component-data/", consumers.ComponentDataConsumer.as_asgi()),
]