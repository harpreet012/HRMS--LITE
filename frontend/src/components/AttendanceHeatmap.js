import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceHeatmap = () => {
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/attendance');
      const empRes = await axios.get('http://localhost:5000/api/employees');

      if (res.data.success && empRes.data.success) {
        setData(res.data.data || []);
        setEmployees(empRes.data.data || []);
      }
    } catch (err) {
      console.error('Heatmap fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;

  // Get last 30 days
  const today = new Date();
  const last30Days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    last30Days.push(d.toISOString().split('T')[0]);
  }

  // Build attendance map: employee_id -> date -> status
  const attendanceMap = {};
  data.forEach(record => {
    const empId = record.employee_id;
    const recordDate = new Date(record.date).toISOString().split('T')[0];
    if (!attendanceMap[empId]) attendanceMap[empId] = {};
    attendanceMap[empId][recordDate] = record.status;
  });

  const getStatusColor = (status) => {
    if (!status) return '#f0f0f0';
    if (status.toLowerCase() === 'present') return '#27ae60';
    if (status.toLowerCase() === 'absent') return '#e74c3c';
    return '#f0f0f0';
  };

  return (
    <div className="card grid-full">
      <div className="card-header">
        <div>
          <div className="card-title">Attendance Heatmap (Last 30 Days)</div>
          <div className="card-subtitle">Green = Present, Red = Absent, Gray = No record</div>
        </div>
      </div>

      <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
        <table style={{ fontSize: '0.8rem', minWidth: '800px' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.5rem', textAlign: 'left', minWidth: '120px' }}>Employee</th>
              {last30Days.map((day, idx) => {
                const d = new Date(day);
                return (
                  <th key={idx} style={{ padding: '0.25rem', textAlign: 'center', minWidth: '30px' }}>
                    {d.getDate()}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {employees.slice(0, 15).map(emp => (
              <tr key={emp._id}>
                <td style={{ padding: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                  {emp.full_name.substring(0, 12)}
                </td>
                {last30Days.map((day, idx) => {
                  const status = attendanceMap[emp.employee_id]?.[day];
                  return (
                    <td
                      key={idx}
                      style={{
                        padding: '0.25rem',
                        textAlign: 'center',
                        backgroundColor: getStatusColor(status),
                        color: status ? 'white' : 'transparent',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        borderRadius: '3px',
                        margin: '2px',
                      }}
                      title={status || 'No record'}
                    >
                      {status ? status.charAt(0).toUpperCase() : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Showing first 15 employees. Each cell represents a day. Green = Present, Red = Absent.
      </div>
    </div>
  );
};

export default AttendanceHeatmap;
