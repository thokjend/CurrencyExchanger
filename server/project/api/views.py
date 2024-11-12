from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests

@api_view(["GET"])
def get_currencies(request):
    try:
        response = requests.get("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json")
        response.raise_for_status()
        data = response.json()
        return Response(data)
    except requests.RequestException as e:
        return Response({"error": "Failed to fetch currency data"}, status=500)


