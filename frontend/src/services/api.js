import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
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

export default api;
