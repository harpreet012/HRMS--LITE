import axios from 'axios';

// Normalize REACT_APP_API_URL: if it already contains '/api' use as-is,
// otherwise append '/api/v1' so deployed and local configs both work.
const rawBase = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const trimmed = rawBase.replace(/\/$/, '');
const API_BASE_URL = /\/api(\/|$)/i.test(trimmed) ? trimmed : `${trimmed}/api/v1`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
  ,
  timeout: 8000
});

// Helper function to convert camelCase to snake_case
const toSnakeCase = (obj) => {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
};

// Employee API calls
export const employeeService = {
  addEmployee: (data) => api.post('/employees', toSnakeCase(data)),
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
