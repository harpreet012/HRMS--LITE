import React, { useState, useEffect } from 'react';
import { employeeService, attendanceService } from '../services/api';
import { LoadingSpinner, ErrorAlert } from './UI';
import { Users, Calendar, CheckCircle, XCircle } from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalAttendanceRecords: 0,
    presentToday: 0,
    absentToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const empResponse = await employeeService.getAllEmployees();
      const attResponse = await attendanceService.getAllAttendance();

      const today = new Date().toLocaleDateString();
      const todayRecords = (attResponse.data.data || []).filter(
        record => new Date(record.date).toLocaleDateString() === today
      );

      setStats({
        totalEmployees: empResponse.data.count || 0,
        totalAttendanceRecords: attResponse.data.count || 0,
        presentToday: todayRecords.filter(r => r.status === 'Present').length,
        absentToday: todayRecords.filter(r => r.status === 'Absent').length
      });
      setError('');
    } catch (err) {
      setError('Failed to fetch dashboard stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const StatCard = ({ icon: Icon, label, value, bgColor, textColor }) => (
    <div className={`${bgColor} rounded-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <Icon size={40} className="opacity-50" />
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
      
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Employees"
          value={stats.totalEmployees}
          bgColor="bg-blue-600"
          textColor="text-blue-600"
        />
        <StatCard
          icon={Calendar}
          label="Total Records"
          value={stats.totalAttendanceRecords}
          bgColor="bg-purple-600"
          textColor="text-purple-600"
        />
        <StatCard
          icon={CheckCircle}
          label="Present Today"
          value={stats.presentToday}
          bgColor="bg-green-600"
          textColor="text-green-600"
        />
        <StatCard
          icon={XCircle}
          label="Absent Today"
          value={stats.absentToday}
          bgColor="bg-red-600"
          textColor="text-red-600"
        />
      </div>
    </div>
  );
};
