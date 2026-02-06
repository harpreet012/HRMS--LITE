from flask import Blueprint, request, jsonify
from datetime import datetime, date
from bson.objectid import ObjectId
from app.models.database import Attendance, Employee

attendance_bp = Blueprint('attendance', __name__)

@attendance_bp.route('', methods=['POST'])
def mark_attendance():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['employee_id', 'date', 'status']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    'success': False,
                    'message': f'{field} is required'
                }), 400
        
        # Validate status
        if data['status'] not in ['Present', 'Absent']:
            return jsonify({
                'success': False,
                'message': 'Status must be either Present or Absent'
            }), 400
        
        # Check if employee exists
        employee = Employee.find_by_employee_id(data['employee_id'])
        if not employee:
            return jsonify({
                'success': False,
                'message': 'Employee not found'
            }), 404
        
        # Parse date
        try:
            attendance_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({
                'success': False,
                'message': 'Invalid date format'
            }), 400
        
        # Check for existing attendance
        existing = Attendance.find_by_employee_and_date(data['employee_id'], attendance_date)
        
        if existing:
            return jsonify({
                'success': False,
                'message': 'Attendance already marked for this date'
            }), 400
        
        # Create attendance record
        att_data = {
            'employee_id': data['employee_id'],
            'date': attendance_date,
            'status': data['status']
        }
        
        result = Attendance.insert_one(att_data)
        att_data['_id'] = str(result.inserted_id)
        
        return jsonify({
            'success': True,
            'message': 'Attendance marked successfully',
            'data': att_data
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error marking attendance: {str(e)}'
        }), 500

@attendance_bp.route('', methods=['GET'])
def get_all_attendance():
    try:
        records = Attendance.find_all()
        
        # Convert ObjectId and date to string
        for record in records:
            record['_id'] = str(record['_id'])
            record['date'] = record['date'].isoformat()
        
        return jsonify({
            'success': True,
            'count': len(records),
            'data': records
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching attendance: {str(e)}'
        }), 500

@attendance_bp.route('/employee/<employee_id>', methods=['GET'])
def get_employee_attendance(employee_id):
    try:
        employee = Employee.find_by_employee_id(employee_id)
        if not employee:
            return jsonify({
                'success': False,
                'message': 'Employee not found'
            }), 404
        
        records = Attendance.find_by_employee_id(employee_id)
        
        # Convert ObjectId and date to string
        for record in records:
            record['_id'] = str(record['_id'])
            record['date'] = record['date'].isoformat()
        
        present_count = len([r for r in records if r['status'] == 'Present'])
        absent_count = len([r for r in records if r['status'] == 'Absent'])
        
        return jsonify({
            'success': True,
            'employee': {
                'employee_id': employee['employee_id'],
                'full_name': employee['full_name'],
                'department': employee['department']
            },
            'stats': {
                'total_records': len(records),
                'present_days': present_count,
                'absent_days': absent_count
            },
            'data': records
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching attendance: {str(e)}'
        }), 500

@attendance_bp.route('/<att_id>', methods=['PATCH'])
def update_attendance(att_id):
    try:
        data = request.get_json()
        
        if 'status' not in data or data['status'] not in ['Present', 'Absent']:
            return jsonify({
                'success': False,
                'message': 'Invalid status'
            }), 400
        
        attendance = Attendance.find_by_id(att_id)
        if not attendance:
            return jsonify({
                'success': False,
                'message': 'Attendance record not found'
            }), 404
        
        Attendance.update_by_id(att_id, {'status': data['status']})
        
        # Fetch updated record
        updated = Attendance.find_by_id(att_id)
        updated['_id'] = str(updated['_id'])
        updated['date'] = updated['date'].isoformat()
        
        return jsonify({
            'success': True,
            'message': 'Attendance updated successfully',
            'data': updated
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error updating attendance: {str(e)}'
        }), 500

@attendance_bp.route('/<att_id>', methods=['DELETE'])
def delete_attendance(att_id):
    try:
        result = Attendance.delete_by_id(att_id)
        
        if result.deleted_count == 0:
            return jsonify({
                'success': False,
                'message': 'Attendance record not found'
            }), 404
        
        return jsonify({
            'success': True,
            'message': 'Attendance deleted successfully'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error deleting attendance: {str(e)}'
        }), 500
