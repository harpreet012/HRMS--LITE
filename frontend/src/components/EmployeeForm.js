import React, { useState, useEffect } from 'react';
import { employeeService } from '../services/api';
import { Input, Button, Select, ErrorAlert, SuccessAlert } from './UI';

export const EmployeeForm = ({ onSuccess, editingEmployee = null }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingEmployee) {
      setFormData(editingEmployee);
    }
  }, [editingEmployee]);

  const departments = [
    { value: 'HR', label: 'Human Resources' },
    { value: 'IT', label: 'Information Technology' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Sales', label: 'Sales' }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employee_id.trim()) newErrors.employee_id = 'Employee ID is required';
    if (!formData.full_name.trim()) newErrors.full_name = 'Full Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.department) newErrors.department = 'Department is required';
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
      await employeeService.addEmployee(formData);
      setSuccess('Employee added successfully!');
      setFormData({ employee_id: '', full_name: '', email: '', department: '' });
      setErrors({});
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee');
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>
      
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && <SuccessAlert message={success} onClose={() => setSuccess('')} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Employee ID"
          name="employee_id"
          placeholder="EMP001"
          value={formData.employee_id}
          onChange={handleChange}
          required
          error={errors.employee_id}
        />

        <Input
          label="Full Name"
          name="full_name"
          placeholder="John Doe"
          value={formData.full_name}
          onChange={handleChange}
          required
          error={errors.full_name}
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          error={errors.email}
        />

        <Select
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          options={departments}
          required
          error={errors.department}
        />

        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          size="lg"
        >
          {loading ? 'Adding...' : 'Add Employee'}
        </Button>
      </form>
    </div>
  );
};
