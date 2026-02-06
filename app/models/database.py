from pymongo import MongoClient
from config import MONGODB_URI
from bson.objectid import ObjectId
from datetime import datetime

client = MongoClient(MONGODB_URI)
db = client['hrms-lite']

class Database:
    @staticmethod
    def get_db():
        return db

# Employee Model
class Employee:
    collection = db['employees']
    
    @staticmethod
    def create_indexes():
        Employee.collection.create_index('employee_id', unique=True)
        Employee.collection.create_index('email', unique=True)
    
    @staticmethod
    def insert_one(data):
        data['created_at'] = datetime.utcnow()
        data['updated_at'] = datetime.utcnow()
        return Employee.collection.insert_one(data)
    
    @staticmethod
    def find_all():
        return list(Employee.collection.find().sort('created_at', -1))
    
    @staticmethod
    def find_by_id(emp_id):
        return Employee.collection.find_one({'_id': ObjectId(emp_id)})
    
    @staticmethod
    def find_by_employee_id(emp_id):
        return Employee.collection.find_one({'employee_id': emp_id})
    
    @staticmethod
    def find_by_email(email):
        return Employee.collection.find_one({'email': email})
    
    @staticmethod
    def delete_by_id(emp_id):
        return Employee.collection.delete_one({'_id': ObjectId(emp_id)})
    
    @staticmethod
    def count():
        return Employee.collection.count_documents({})

# Attendance Model
class Attendance:
    collection = db['attendance']
    
    @staticmethod
    def create_indexes():
        Attendance.collection.create_index([('employee_id', 1), ('date', 1)], unique=True)
    
    @staticmethod
    def insert_one(data):
        data['created_at'] = datetime.utcnow()
        data['updated_at'] = datetime.utcnow()
        return Attendance.collection.insert_one(data)
    
    @staticmethod
    def find_all():
        return list(Attendance.collection.find().sort('date', -1))
    
    @staticmethod
    def find_by_employee_id(emp_id):
        return list(Attendance.collection.find({'employee_id': emp_id}).sort('date', -1))
    
    @staticmethod
    def find_by_id(att_id):
        return Attendance.collection.find_one({'_id': ObjectId(att_id)})
    
    @staticmethod
    def find_by_employee_and_date(emp_id, date):
        return Attendance.collection.find_one({'employee_id': emp_id, 'date': date})
    
    @staticmethod
    def update_by_id(att_id, data):
        data['updated_at'] = datetime.utcnow()
        return Attendance.collection.update_one({'_id': ObjectId(att_id)}, {'$set': data})
    
    @staticmethod
    def delete_by_id(att_id):
        return Attendance.collection.delete_one({'_id': ObjectId(att_id)})
    
    @staticmethod
    def count():
        return Attendance.collection.count_documents({})

# Create indexes on startup
try:
    Employee.create_indexes()
    Attendance.create_indexes()
except Exception as e:
    print(f"Index creation warning: {e}")
