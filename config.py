import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = 'mongodb://localhost:27017/hrms-lite'
DEBUG = os.getenv('DEBUG', 'True') == 'True'
PORT = int(os.getenv('PORT', 5000))
