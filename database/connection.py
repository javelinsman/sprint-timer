import os
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from dotenv import load_dotenv
import logging

load_dotenv()

logger = logging.getLogger(__name__)


class MongoDB:
    client: Optional[AsyncIOMotorClient] = None
    database: Optional[AsyncIOMotorDatabase] = None


db = MongoDB()


async def connect_to_mongo():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    db_name = os.getenv("DB_NAME", "litmanager")
    
    # MongoDB connection options
    db.client = AsyncIOMotorClient(
        mongodb_url,
        serverSelectionTimeoutMS=5000,
    )
    
    # Test connection
    try:
        # The ping command is a simple way to test the connection
        await db.client.admin.command('ping')
        print(f"Successfully connected to MongoDB")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        print("Attempting to connect without authentication...")
        # Try connecting to a specific database without auth
        db.client = AsyncIOMotorClient(
            "mongodb://localhost:27017",
            serverSelectionTimeoutMS=5000,
        )
    
    db.database = db.client[db_name]
    
    # Try to create indexes - if it fails due to auth, we'll skip
    try:
        await create_indexes()
        print(f"Database indexes created successfully")
    except Exception as e:
        print(f"Warning: Could not create indexes (may already exist): {e}")
    
    print(f"Using database: {db_name}")


async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("Disconnected from MongoDB")


async def create_indexes():
    # Papers collection indexes
    papers_collection = db.database.papers
    await papers_collection.create_index("semantic_scholar_id", unique=True)
    await papers_collection.create_index("status")
    await papers_collection.create_index("query_tags")
    await papers_collection.create_index("created_at")
    
    # Queries collection indexes
    queries_collection = db.database.queries
    await queries_collection.create_index("created_at")
    
    # Review sessions collection indexes
    sessions_collection = db.database.review_sessions
    await sessions_collection.create_index("is_active")
    await sessions_collection.create_index("created_at")
    
    # Review notes collection indexes
    notes_collection = db.database.review_notes
    await notes_collection.create_index("paper_id")
    await notes_collection.create_index("session_id")
    await notes_collection.create_index([("paper_id", 1), ("session_id", 1)])
    
    # Summary queue collection indexes
    queue_collection = db.database.summary_queue
    await queue_collection.create_index("paper_id", unique=True)
    await queue_collection.create_index("status")
    await queue_collection.create_index("added_at")


def get_database() -> AsyncIOMotorDatabase:
    return db.database