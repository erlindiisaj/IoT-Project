from django.urls import path
from .views import login_view, logout_view

# you route at project level
urlpatterns = [
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
]
