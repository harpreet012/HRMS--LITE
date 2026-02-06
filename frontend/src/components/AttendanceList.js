import React, { useState, useEffect } from 'react';
import { attendanceService, employeeService } from '../services/api';
import { Button, LoadingSpinner, EmptyState, ErrorAlert, Select } from './UI';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const AttendanceList = ({ refreshTrigger }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedEmployee, setExpandedEmployee] = useState(null);

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const empResponse = await employeeService.getAllEmployees();
      setEmployees(empResponse.data.data || []);

      const attResponse = await attendanceService.getAllAttendance();
      setAttendanceRecords(attResponse.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch attendance records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeDetails = (empId) => {
    return employees.find(e => e.employeeId === empId);
  };

  const groupedByEmployee = attendanceRecords.reduce((acc, record) => {
    if (!acc[record.employeeId]) {
      acc[record.employeeId] = [];
    }
    acc[record.employeeId].push(record);
    return acc;
  }, {});

  const filteredData = selectedEmployee === 'all' 
    ? groupedByEmployee 
    : { [selectedEmployee]: groupedByEmployee[selectedEmployee] || [] };

  const employeeOptions = [
    { value: 'all', label: 'All Employees' },
    ...employees.map(emp => ({
      value: emp.employeeId,
      label: `${emp.fullName} (${emp.employeeId})`
    }))
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Attendance Records</h2>
      
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      <div className="mb-6">
        <Select
          label="Filter by Employee"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          options={employeeOptions}
        />
      </div>

      {Object.keys(filteredData).length === 0 ? (
        <EmptyState message="No attendance records found." icon="📅" />
      ) : (
        <div className="space-y-4">
          {Object.entries(filteredData).map(([empId, records]) => {
            const employee = getEmployeeDetails(empId);
            const presentCount = records.filter(r => r.status === 'Present').length;
            const absentCount = records.filter(r => r.status === 'Absent').length;
            const isExpanded = expandedEmployee === empId;

            return (
              <div key={empId} className="border rounded-lg">
                <button
                  onClick={() => setExpandedEmployee(isExpanded ? null : empId)}
                  className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="text-left">
                    <h3 className="font-semibold text-lg">{employee?.fullName}</h3>
                    <p className="text-sm text-gray-600">{empId} • {employee?.department}</p>
                    <div className="flex gap-6 mt-2 text-sm">
                      <span className="text-green-600">✓ {presentCount} Present</span>
                      <span className="text-red-600">✕ {absentCount} Absent</span>
                    </div>
                  </div>
                  <div>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 border-t">
                    {records.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No attendance records</p>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {records.sort((a, b) => new Date(b.date) - new Date(a.date)).map(record => (
                          <div key={record._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div>
                              <p className="text-sm font-medium">{new Date(record.date).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              record.status === 'Present' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {record.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
