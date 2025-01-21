from rest_framework.decorators import api_view
from rest_framework.response import Response
from .mongodb import MongoDBClient
from werkzeug.security import generate_password_hash, check_password_hash
import requests, random, string
from bson import ObjectId

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

def generate_account_number():
    return ''.join(random.choices(string.digits, k=10))

@api_view(["POST"])
def create_bank_account(request):
    try:
        username = request.data.get("Username")
        account_name = request.data.get("AccountName")
        currency_name = request.data.get("CurrencyName")
        currency_type = request.data.get("CurrencyType")
        initial_amount = request.data.get("InitialAmount", 0)

        if not username or not account_name or not currency_type:
            return Response({"error": "Username, Account name, and Currency type are required"}, status=400)

        # Connect to MongoDB
        mongo_client = MongoDBClient()
        users_collection = mongo_client.get_collection("users")
        account_collection = mongo_client.get_collection("accounts")

        user = users_collection.find_one({"username": username})
        if not user:
            return Response({"error": "User not found"}, status=404)
        
        account_id = str(ObjectId())

        # Create bank account
        bank_account = {
            "_id": account_id,
            "accountNumber": generate_account_number(),
            "accountName": account_name,
            "currencyName": currency_name,
            "currencyType": currency_type,
            "amount": initial_amount,
        }

        account_collection.insert_one(bank_account)

        users_collection.update_one(
            {"username": username},
            {"$push": {"bankAccounts": bank_account}})
    
        return Response({"message": "Bank account added successfully", "bankAccount": bank_account}, status=200)

    except Exception as e:
        print(f"Error: {e}")
        return Response({"error": "An unexpected error occurred."}, status=500)
    
@api_view(["GET"])
def get_account_info(request, account):
    try:
        mongo_client = MongoDBClient()
        account_collection = mongo_client.get_collection("accounts")

        user_account = account_collection.find_one({"accountNumber": account}, {"_id":0})

        if not user_account:
            return Response({"error": "Account not found or no account available."}, status=404)

        return Response({"Account": user_account}, status=200)

    except Exception as e:
        print(f"Error", {e})
        return Response({"error": "Failed to fetch bank account information"}, status=500)    


@api_view(["GET"])
def get_user_bank_accounts(request, username):
    try:
        if not username:
            return Response({"error": "Username is required."}, status=400)

        mongo_client = MongoDBClient()
        users_collection = mongo_client.get_collection("users")

        user = users_collection.find_one({"username":username},{"_id":0,"bankAccounts":1})

        if not user:
            return Response({"error": "User not found or no bank accounts available."}, status=404)

        return Response({"bankAccounts": user.get("bankAccounts", [])}, status=200)


    except Exception as e:
        print(f"Error", {e})
        return Response({"error": "Failed to fetch bank account information"}, status=500)
    


@api_view(["POST"])
def transfer(request):
    try:
        transfer_from_account = request.data.get("TransferFromAccount")
        transfer_to_account = request.data.get("TransferToAccount")
        amount = float(request.data.get("Amount", 0))
        converted_amount = float(request.data.get("ConvertedAmount", 0))

        if amount <= 0:
            return Response({"error": "Transfer amount must be greater than zero"}, status=400)

        mongo_client = MongoDBClient()
        accounts_collection = mongo_client.get_collection("accounts")
        users_collection = mongo_client.get_collection("users")

        # transfer amount from account
        filter_from = {"accountNumber" : transfer_from_account}
        update_from = {"$inc": {"amount": -amount}}
        accounts_collection.update_one(filter_from, update_from)

        filter_to = {"accountNumber" : transfer_to_account}
        update_to = {"$inc": {"amount": converted_amount}}
        accounts_collection.update_one(filter_to, update_to)

        users_collection.update_one(
            {"bankAccounts.accountNumber": transfer_from_account},
            {"$inc": {"bankAccounts.$.amount": -amount}}
        )

        users_collection.update_one(
            {"bankAccounts.accountNumber": transfer_to_account},
            {"$inc": {"bankAccounts.$.amount": converted_amount}}
        )

        return Response({"message": "Amount successfully transfered"}, status=200)

    except Exception as e:
        print(f"Error", {e})
        return Response({"error": "Failed to transfer selected amount"}, status=500) 
    

@api_view(["POST"])
def store_conversion_rates(request):
    try:
        base_currency = request.data.get("BaseCurrency")
        target_currency = request.data.get("TargetCurrency")
        rates = request.data.get("Rates")

        if not base_currency or not target_currency or not rates:
            return Response({"error": "Invalid data format."}, status=400)
        
        mongo_client = MongoDBClient()
        rates_collection = mongo_client.get_collection("conversionRates")

        rates_collection.insert_one({
            "baseCurrency": base_currency,
            "targetCurrency": target_currency,
            "rates": rates,
        })

        return Response({"message": "Conversion rates stored successfully."}, status=201)
    except Exception as e:
        print(f"Error: {e}")
        return Response({"error": "Failed to store conversion rates."}, status=500)
    

@api_view(["GET"])
def get_stored_conversion_rates(request, base, target):
    try:
        mongo_client = MongoDBClient()
        rates_collection = mongo_client.get_collection("conversionRates")

        result = rates_collection.find_one({"baseCurrency": base, "targetCurrency": target}, {"_id":0, "rates":1})
        
        if result and "rates" in result:
           return Response({"Conversion rates": result["rates"]}, status=200)
        else:
            return Response({"error": "Conversion rate not found."}, status=404)

    except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Failed to get conversion rates."}, status=500) 


@api_view(["DELETE"])
def delete_rates(request, base, target):
    try:
        mongo_client = MongoDBClient()
        rates_collection = mongo_client.get_collection("conversionRates")

        result = rates_collection.delete_one({"baseCurrency": base, "targetCurrency": target})

        if result.deleted_count > 0:
            return Response({"message": "Conversion rates deleted successfully"}, status=200)
        else:
            return Response({"error": "No matching conversion rates found"}, status=404)

    except Exception as e:
        print(f"Error {e}")
        return Response({"error:" "Failed to delete conversion rates"}, status=500)
