from flask import Blueprint, jsonify
from datetime import date, datetime
from app.models.database import Employee, Attendance

dashboard_bp = Blueprint('dashboard', __name__)


def _parse_date_field(d):
    # Normalize different stored date formats to a date object
    if d is None:
        return None
    if isinstance(d, date):
        return d
    if isinstance(d, datetime):
        return d.date()
    if isinstance(d, str):
        # try ISO formats
        try:
            return datetime.fromisoformat(d).date()
        except Exception:
            try:
                return datetime.strptime(d, '%Y-%m-%d').date()
            except Exception:
                return None
    return None


@dashboard_bp.route('', methods=['GET'])
def get_dashboard():
    try:
        total_employees = Employee.count()
        total_attendance_records = Attendance.count()

        records = Attendance.find_all()

        today = date.today()
        present = 0
        absent = 0

        for r in records:
            d = _parse_date_field(r.get('date'))
            if d is None:
                continue
            if d == today:
                status = (r.get('status') or '').strip()
                if status.lower() == 'present':
                    present += 1
                elif status.lower() == 'absent':
                    absent += 1

        return jsonify({
            'success': True,
            'totalEmployees': total_employees,
            'totalAttendanceRecords': total_attendance_records,
            'presentToday': present,
            'absentToday': absent
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error computing dashboard: {str(e)}'
        }), 500
