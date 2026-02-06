import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
  ,
  timeout: 8000
});

// Employee API calls
export const employeeService = {
  addEmployee: (data) => api.post('/employees', data),
  getAllEmployees: () => api.get('/employees'),
  getEmployeeById: (id) => api.get(`/employees/${id}`),
  deleteEmployee: (id) => api.delete(`/employees/${id}`)
};

// Attendance API calls
export const attendanceService = {
  markAttendance: (data) => api.post('/attendance', data),
  getAllAttendance: () => api.get('/attendance'),
  getAttendanceByEmployee: (employeeId) => api.get(`/attendance/employee/${employeeId}`),
  updateAttendance: (id, data) => api.patch(`/attendance/${id}`, data),
  deleteAttendance: (id) => api.delete(`/attendance/${id}`)
};

// Health check
export const healthCheck = () => api.get('/health');

// Combine multiple calls into a single helper for dashboard
export const getDashboardStats = async () => {
  try {
    const [empResponse, attResponse] = await Promise.all([
      employeeService.getAllEmployees(),
      attendanceService.getAllAttendance()
    ]);

    const employees = empResponse.data.data || [];
    const records = attResponse.data.data || [];

    return {
      success: true,
      totalEmployees: empResponse.data.count || employees.length,
      totalAttendanceRecords: attResponse.data.count || records.length,
      records
    };
  } catch (err) {
    // normalize error
    return { success: false, message: err.message || 'Network error' };
  }
};

export default api;
