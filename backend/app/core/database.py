import os
import json
import asyncio
import logging
from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime

logger = logging.getLogger("meditwin.db")

class MockMongoCollection:
    def __init__(self, name: str, file_path: str):
        self.name = name
        self.file_path = file_path
        self._data: List[Dict[str, Any]] = []
        self._load()

    def _load(self):
        if os.path.exists(self.file_path):
            try:
                with open(self.file_path, "r", encoding="utf-8") as f:
                    self._data = json.load(f)
            except Exception as e:
                logger.error(f"Error loading {self.file_path}: {e}")
                self._data = []
        else:
            self._data = []

    def _save(self):
        try:
            os.makedirs(os.path.dirname(self.file_path), exist_ok=True)
            with open(self.file_path, "w", encoding="utf-8") as f:
                json.dump(self._data, f, indent=2, default=str)
        except Exception as e:
            logger.error(f"Error saving {self.file_path}: {e}")

    async def insert_one(self, document: Dict[str, Any]):
        doc = dict(document)
        if "_id" not in doc:
            doc["_id"] = str(uuid.uuid4())
        if "created_at" not in doc:
            doc["created_at"] = datetime.utcnow().isoformat()
        self._data.append(doc)
        self._save()
        class InsertResult:
            inserted_id = doc["_id"]
        return InsertResult()

    async def find_one(self, query: Dict[str, Any]):
        for doc in self._data:
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                return dict(doc)
        return None

    def find(self, query: Dict[str, Any] = None):
        if query is None:
            query = {}
        matched = []
        for doc in self._data:
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                matched.append(dict(doc))
        
        class Cursor:
            def __init__(self, data):
                self.data = data
                self._sort_key = None
                self._reverse = False
                self._limit_n = None

            def sort(self, key, direction=-1):
                self._sort_key = key
                self._reverse = (direction == -1)
                return self

            def limit(self, n):
                self._limit_n = n
                return self

            async def to_list(self, length=1000):
                res = list(self.data)
                if self._sort_key:
                    res.sort(key=lambda x: str(x.get(self._sort_key, '')), reverse=self._reverse)
                if self._limit_n:
                    res = res[:self._limit_n]
                return res[:length]

        return Cursor(matched)

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any]):
        for i, doc in enumerate(self._data):
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                if "$set" in update:
                    for uk, uv in update["$set"].items():
                        self._data[i][uk] = uv
                if "$push" in update:
                    for uk, uv in update["$push"].items():
                        if uk not in self._data[i] or not isinstance(self._data[i][uk], list):
                            self._data[i][uk] = []
                        self._data[i][uk].append(uv)
                self._save()
                class UpdateResult:
                    modified_count = 1
                return UpdateResult()
        class UpdateResult:
            modified_count = 0
        return UpdateResult()

    async def delete_one(self, query: Dict[str, Any]):
        for i, doc in enumerate(self._data):
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                del self._data[i]
                self._save()
                class DeleteResult:
                    deleted_count = 1
                return DeleteResult()
        class DeleteResult:
            deleted_count = 0
        return DeleteResult()

    async def count_documents(self, query: Dict[str, Any] = None):
        if not query:
            return len(self._data)
        count = 0
        for doc in self._data:
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                count += 1
        return count


class DatabaseManager:
    def __init__(self):
        self.db = None
        self.is_mongo = False
        self.fallback_dir = os.path.join(os.path.dirname(__file__), "..", "..", "storage_db")
        self.collections: Dict[str, MockMongoCollection] = {}

    async def connect(self, mongodb_url: str, db_name: str):
        try:
            from motor.motor_asyncio import AsyncIOMotorClient
            client = AsyncIOMotorClient(mongodb_url, serverSelectionTimeoutMS=2000)
            await client.admin.command('ping')
            self.db = client[db_name]
            self.is_mongo = True
            logger.info(f"Successfully connected to MongoDB: {db_name}")
        except Exception as e:
            logger.warning(f"MongoDB connection failed ({e}). Switching to Async Embedded Storage fallback.")
            self.is_mongo = False
            os.makedirs(self.fallback_dir, exist_ok=True)

    def get_collection(self, name: str):
        if self.is_mongo and self.db is not None:
            return self.db[name]
        
        if name not in self.collections:
            file_path = os.path.join(self.fallback_dir, f"{name}.json")
            self.collections[name] = MockMongoCollection(name, file_path)
        return self.collections[name]

db_manager = DatabaseManager()
