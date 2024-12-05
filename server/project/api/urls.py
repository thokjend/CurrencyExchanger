from django.urls import path
from . import views

urlpatterns = [
    path('api/currencies/', views.get_currencies, name='get_currencies'),
    path('api/currencies/<str:base>/', views.get_conversion_rates, name='get_conversion_rates'),
    path('api/currencies/<str:base>/<str:date>/', views.get_conversion_rates_by_date, name='get_conversion_rates_by_date'),
    path('register', views.register_user, name="register_user"),
    path('login', views.login_user, name="login_user"),
    path('create', views.create_bank_account, name="add_bank_account"),
    path('account/info/<str:username>/', views.get_bank_accounts_info, name="get_bank_accounts_info"),
    path('transfer/', views.transfer, name="transfer")
]
