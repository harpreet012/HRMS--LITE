import React, { useState, useEffect } from 'react';
import { attendanceService, employeeService } from '../services/api';
import { Input, Button, Select, ErrorAlert, SuccessAlert, LoadingSpinner } from './UI';

export const AttendanceForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });
  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAllEmployees();
      setEmployees(
        (response.data.data || []).map(emp => ({
          value: emp.employeeId,
          label: `${emp.fullName} (${emp.employeeId})`
        }))
      );
    } catch (err) {
      setError('Failed to fetch employees');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employeeId) newErrors.employeeId = 'Employee is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.status) newErrors.status = 'Status is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await attendanceService.markAttendance(formData);
      setSuccess('Attendance marked successfully!');
      setFormData({ employeeId: '', date: new Date().toISOString().split('T')[0], status: 'Present' });
      setErrors({});
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const statusOptions = [
    { value: 'Present', label: 'Present' },
    { value: 'Absent', label: 'Absent' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Mark Attendance</h2>
      
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && <SuccessAlert message={success} onClose={() => setSuccess('')} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Employee"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          options={employees}
          required
          error={errors.employeeId}
        />

        <Input
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
          error={errors.date}
        />

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
          required
          error={errors.status}
        />

        <Button
          type="submit"
          disabled={loading}
          variant="success"
          size="lg"
        >
          {loading ? 'Marking...' : 'Mark Attendance'}
        </Button>
      </form>
    </div>
  );
};
