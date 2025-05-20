from django.urls import path
from . import views

urlpatterns = [
    path('rooms/get/<int:room_id>/', views.get_room, name='room'),
    path('rooms/get/all/', views.get_rooms, name='all_rooms'),
    path('rooms/get/all/components/<int:room_id>/', views.get_components_by_room, name='components_by_room'),
    path('rooms/get/all/components/values/<int:room_id>/', views.get_room_components_and_values, name='components_by_room_mode'),
    path('rooms/get/all/components/chunk/values/<int:room_id>/', views.get_component_data_chunk_by_room, name='components_by_room_mode'),
    path('rooms/create/', views.create_room, name='create_room'),
    path('rooms/update/mode/<int:room_id>/', views.update_room_mode, name='update_room_mode'),
    path('rooms/delete/<int:room_id>/', views.delete_room, name='delete_room'),

    path('components/get/<int:component_id>/', views.get_component, name='component'),
    path('components/get/all/', views.get_components, name='all_components'),
    path('components/get/value/<int:component_id>/', views.get_component_value, name='component_value'),
    path('components/create/', views.create_component, name='create_component'),
    path('components/update/value/<int:component_id>/', views.update_component_value, name='update_component_value'),
    path('components/delete/<int:component_id>/', views.delete_component, name='delete_component'),

    path('data/get/<int:data_id>/', views.get_component_data, name='component_data'),
    path('components/data/get/<int:component_id>/', views.get_component_full_data, name='all_component_data'),
    path('event', views.create_component_data, name='create_component_data'),
    path('data/delete/<int:data_id>/', views.delete_component_data, name='delete_component_data'),

    path('server', views.recreate_components, name='recreate_components'),
]