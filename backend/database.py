# MongoDB Database Configuration
from motor.motor_asyncio import AsyncIOMotorClient
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'videoflow_db')

# Create MongoDB client
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Collections
users_collection = db.users
videos_collection = db.videos

# Create indexes for better performance
async def create_indexes():
    """Create indexes for MongoDB collections"""
    # Users indexes
    await users_collection.create_index("email", unique=True)
    await users_collection.create_index("username", unique=True)
    
    # Videos indexes
    await videos_collection.create_index("user_id")
    await videos_collection.create_index("status")
    await videos_collection.create_index("data_criacao")
    await videos_collection.create_index([("titulo", "text"), ("descricao", "text"), ("roteiro", "text")])
    
    print("MongoDB indexes created successfully")

# Dependency to get database
async def get_db():
    return db
