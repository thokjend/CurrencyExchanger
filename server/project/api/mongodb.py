from pymongo import MongoClient
from django.conf import settings

class MongoDBClient:
    def __init__(self):
        # Connect to MongoDB using settings
        self.client = MongoClient(settings.MONGODB_SETTINGS["HOST"])
        self.db = self.client[settings.MONGODB_SETTINGS["DB_NAME"]]

    def get_collection(self, collection_name):
        return self.db[collection_name]