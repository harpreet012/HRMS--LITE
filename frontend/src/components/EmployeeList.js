import React, { useState, useEffect } from 'react';
import { employeeService } from '../services/api';
import { LoadingSpinner, EmptyState, ErrorAlert } from './UI';
import { Trash2 } from 'lucide-react';

export const EmployeeList = ({ refreshTrigger }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, [refreshTrigger]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeService.getAllEmployees();
      setEmployees(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.deleteEmployee(id);
        setEmployees(employees.filter(emp => emp._id !== id));
      } catch (err) {
        setError('Failed to delete employee');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Employee List</h2>
      
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {employees.length === 0 ? (
        <EmptyState message="No employees found. Add a new employee to get started." icon="👥" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Employee ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Full Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created Date</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={employee._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.employee_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.full_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {employee.created_at ? new Date(employee.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDelete(employee._id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete employee"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
