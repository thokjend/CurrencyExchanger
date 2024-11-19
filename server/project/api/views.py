from rest_framework.decorators import api_view
from rest_framework.response import Response
from .mongodb import MongoDBClient
from werkzeug.security import generate_password_hash, check_password_hash
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


@api_view(["GET"])
def get_conversion_rates(request,base):
    try:
        response = requests.get(f"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/{base}.json")
        response.raise_for_status()
        data = response.json()
        return Response(data)
    except requests.RequestException as e:
        return Response({"error": "Failed to fetch currency data"}, status=500)

@api_view(["GET"])
def get_conversion_rates_by_date(request, base, date):
    try:
        response = requests.get(f"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{date}/v1/currencies/{base}.json")
        response.raise_for_status()
        data = response.json()
        return Response(data)
    except requests.RequestException as e:
        return Response({"error": "Failed to fetch conversion rates"}, status=500)



@api_view(["POST"])
def register_user(request):
    try:
        # Extract data from the request
        username = request.data.get("Username")
        password = request.data.get("Password")

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=400)

        # Connect to MongoDB
        mongo_client = MongoDBClient()
        users_collection = mongo_client.get_collection("users")

        # Check if the user already exists
        if users_collection.find_one({"username": username}):
            return Response({"error": "Username already exists."}, status=409)

        # Hash the password and insert the new user
        hashed_password = generate_password_hash(password)
        users_collection.insert_one({"username": username, "password": hashed_password})

        return Response({"message": "User registered successfully."}, status=201)
    except Exception as e:
        print(f"Error: {e}")
        return Response({"error": "Failed to register user."}, status=500)


@api_view(["POST"])
def login_user(request):
    try:
        # Extract data from the request
        username = request.data.get("Username")
        password = request.data.get("Password")

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=400)
        
        mongo_client = MongoDBClient()
        users_collection = mongo_client.get_collection("users")

        user = users_collection.find_one({"username": username})

        # find user in DB
        if not user:
            return Response({"error": "Login failed. Invalid username or password."}, status=401)
        
        # check password match
        if not check_password_hash(user["password"], password):
            return Response({"error": "Login failed. Invalid username or password."}, status=401)

        
        return Response({"message": "User logged in successfully."}, status=200)


    except Exception as e:
        print(f"Error: {e}")
        return Response({"error": "Failed to login user."}, status=500)
