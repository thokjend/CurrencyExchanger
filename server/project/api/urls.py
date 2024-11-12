from django.urls import path
from . import views

urlpatterns = [
    path('api/currencies/', views.get_currencies, name='get_currencies'),
    path('api/currencies/<str:base>/', views.get_convertion_rates, name='get_conversion_rates'),
]
