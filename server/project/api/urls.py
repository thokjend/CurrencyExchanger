from django.urls import path
from . import views

urlpatterns = [
    path('api/currencies/', views.get_currencies, name='get_currencies'),
    path('api/currencies/<str:base>/', views.get_conversion_rates, name='get_conversion_rates'),
    path('api/currencies/<str:base>/<str:date>/', views.get_conversion_rates_by_date, name='get_conversion_rates_by_date'),
    path('register', views.register_user, name="register_user"),
    path('login', views.login_user, name="login_user"),
    path('create', views.create_bank_account, name="add_bank_account"),
    path('account/info/<str:username>/', views.get_user_bank_accounts, name="get_bank_accounts_info"),
    path('account/<str:account>/', views.get_account_info, name="get_account_info"),
    path('transfer/', views.transfer, name="transfer"),
    path('api/store/conversionRates/', views.store_conversion_rates, name='stored_conversion_rates'),
    path('api/conversionRates/<str:base>/<str:target>/', views.get_stored_conversion_rates, name='get_stored_conversion_rates')
]
