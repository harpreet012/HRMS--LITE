from flask import Blueprint, jsonify
from datetime import date, timedelta
from app.models.database import Attendance, Employee

performance_bp = Blueprint('performance', __name__)


@performance_bp.route('', methods=['GET'])
def get_performance():
    """
    Returns performance metrics:
    - Attendance percentage
    - Total present/absent
    - Punctuality rating
    """
    try:
        total_employees = Employee.count()
        records = Attendance.find_all()

        if not records:
            return jsonify({
                'success': True,
                'attendance_percentage': 0,
                'total_present': 0,
                'total_absent': 0,
                'employee_count': total_employees
            }), 200

        present_count = len([r for r in records if (r.get('status') or '').strip().lower() == 'present'])
        absent_count = len([r for r in records if (r.get('status') or '').strip().lower() == 'absent'])
        total_records = present_count + absent_count

        attendance_percentage = round((present_count / total_records * 100) if total_records > 0 else 0, 2)

        return jsonify({
            'success': True,
            'attendance_percentage': attendance_percentage,
            'total_present': present_count,
            'total_absent': absent_count,
            'employee_count': total_employees,
            'total_records': total_records
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error computing performance: {str(e)}'
        }), 500


@performance_bp.route('/attendance-trend', methods=['GET'])
def get_attendance_trend():
    """
    Returns attendance trend for the last 30 days
    """
    try:
        records = Attendance.find_all()
        today = date.today()
        last_30_days = {}

        # Initialize last 30 days
        for i in range(29, -1, -1):
            d = today - timedelta(days=i)
            last_30_days[d.isoformat()] = {'present': 0, 'absent': 0, 'total': 0}

        # Count attendance by date
        for record in records:
            if 'date' not in record:
                continue
            d = record['date']
            if isinstance(d, str):
                try:
                    d = date.fromisoformat(d)
                except:
                    continue
            elif hasattr(d, 'date'):
                d = d.date()

            if d in [date.today() - timedelta(days=i) for i in range(30)]:
                key = d.isoformat()
                status = (record.get('status') or '').strip().lower()
                if status == 'present':
                    last_30_days[key]['present'] += 1
                elif status == 'absent':
                    last_30_days[key]['absent'] += 1
                last_30_days[key]['total'] += 1

        # Format as array for charting
        trend_data = [
            {
                'date': date_str,
                'present': counts['present'],
                'absent': counts['absent'],
                'total': counts['total'],
                'attendance_rate': round((counts['present'] / counts['total'] * 100) if counts['total'] > 0 else 0, 1)
            }
            for date_str, counts in last_30_days.items()
        ]

        return jsonify({
            'success': True,
            'data': trend_data
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error computing trend: {str(e)}'
        }), 500
