from flask import Blueprint, request, jsonify
from datetime import datetime
import re
from bson.objectid import ObjectId
from app.models.database import Employee

employees_bp = Blueprint('employees', __name__)

def validate_email(email):
    pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(pattern, email) is not None

@employees_bp.route('', methods=['POST'])
def add_employee():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['employee_id', 'full_name', 'email', 'department']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    'success': False,
                    'message': f'{field} is required'
                }), 400
        
        # Validate email format
        if not validate_email(data['email']):
            return jsonify({
                'success': False,
                'message': 'Invalid email format'
            }), 400
        
        # Check for duplicate employee ID
        if Employee.find_by_employee_id(data['employee_id']):
            return jsonify({
                'success': False,
                'message': 'Employee ID already exists'
            }), 400
        
        # Check for duplicate email
        if Employee.find_by_email(data['email']):
            return jsonify({
                'success': False,
                'message': 'Email already registered'
            }), 400
        
        # Create new employee
        emp_data = {
            'employee_id': data['employee_id'],
            'full_name': data['full_name'],
            'email': data['email'],
            'department': data['department']
        }
        
        result = Employee.insert_one(emp_data)
        emp_data['_id'] = str(result.inserted_id)
        
        return jsonify({
            'success': True,
            'message': 'Employee added successfully',
            'data': emp_data
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error adding employee: {str(e)}'
        }), 500

@employees_bp.route('', methods=['GET'])
def get_all_employees():
    try:
        employees = Employee.find_all()
        
        # Convert ObjectId to string
        for emp in employees:
            emp['_id'] = str(emp['_id'])
        
        return jsonify({
            'success': True,
            'count': len(employees),
            'data': employees
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching employees: {str(e)}'
        }), 500

@employees_bp.route('/<emp_id>', methods=['GET'])
def get_employee(emp_id):
    try:
        employee = Employee.find_by_id(emp_id)
        if not employee:
            return jsonify({
                'success': False,
                'message': 'Employee not found'
            }), 404
        
        employee['_id'] = str(employee['_id'])
        return jsonify({
            'success': True,
            'data': employee
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching employee: {str(e)}'
        }), 500

@employees_bp.route('/<emp_id>', methods=['DELETE'])
def delete_employee(emp_id):
    try:
        result = Employee.delete_by_id(emp_id)
        
        if result.deleted_count == 0:
            return jsonify({
                'success': False,
                'message': 'Employee not found'
            }), 404
        
        return jsonify({
            'success': True,
            'message': 'Employee deleted successfully'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error deleting employee: {str(e)}'
        }), 500
