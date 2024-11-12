from django.urls import path
from . import views

urlpatterns = [
    path('api/currencies/', views.get_currencies, name='get_currencies')
]
