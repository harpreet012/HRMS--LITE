import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { LoadingSpinner, ErrorAlert, Button } from './UI';
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
      const res = await getDashboardStats();
      if (!res.success) throw new Error(res.message || 'Failed to fetch');

      const today = new Date().toLocaleDateString();
      const todayRecords = (res.records || []).filter(
        record => new Date(record.date).toLocaleDateString() === today
      );

      setStats({
        totalEmployees: res.totalEmployees || 0,
        totalAttendanceRecords: res.totalAttendanceRecords || 0,
        presentToday: todayRecords.filter(r => r.status === 'Present').length,
        absentToday: todayRecords.filter(r => r.status === 'Absent').length
      });
      setError('');
    } catch (err) {
      const msg = (err && err.message) ? err.message : 'Failed to fetch dashboard stats';
      setError(msg);
      console.error('Dashboard fetch error:', err);
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

      {error && (
        <div style={{marginBottom:12}}>
          <Button onClick={fetchStats} variant="primary">Retry</Button>
        </div>
      )}

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
