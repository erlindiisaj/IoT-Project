from django.urls import path
from . import views

urlpatterns = [
    path('rooms/<int:room_id>/', views.RoomView.as_view(), name='room'), # For GET and DELETE
    path('rooms/', views.RoomView.as_view(), name='room'), # For Post
    path('rooms/all/', views.RoomsView.as_view(), name='all_rooms'), # For GET ALL

    path('components/', views.ComponentView.as_view(), name='component'), # For Post
    path('components/all/', views.ComponentsView.as_view(), name='all_components'), # For GET ALL
    path('components/<int:component_id>/', views.ComponentView.as_view(), name='component'), # For GET and DELETE
    
    path('components/data/<int:component_id>/', views.ComponentDataView.as_view(), name='component_data'), # For GET, DELETE
    path('components/data/', views.ComponentDataView.as_view(), name='component_data'), # For Post
]