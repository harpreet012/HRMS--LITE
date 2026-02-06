import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { LoadingSpinner, ErrorAlert, Button } from '../components/UI';
import PerformanceChart from '../components/PerformanceChart';
import AttendanceHeatmap from '../components/AttendanceHeatmap';

const HomePage = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalAttendanceRecords: 0,
    presentToday: 0,
    absentToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStats();
      if (!res.success) throw new Error(res.message || 'Failed to fetch');

      setStats({
        totalEmployees: res.totalEmployees || 0,
        totalAttendanceRecords: res.totalAttendanceRecords || 0,
        presentToday: res.presentToday || 0,
        absentToday: res.absentToday || 0
      });
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {error && <div style={{marginBottom: '1rem'}}><Button onClick={fetchDashboardData} variant="primary">Retry</Button></div>}

      {/* Stat Cards Grid */}
      <div className="grid-4">
        <div className="stat-card stat-primary">
          <div className="stat-label">Total Employees</div>
          <div className="stat-value">{stats.totalEmployees}</div>
          <div className="stat-change">👥</div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-label">Total Records</div>
          <div className="stat-value">{stats.totalAttendanceRecords}</div>
          <div className="stat-change">📅</div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-label">Present Today</div>
          <div className="stat-value">{stats.presentToday}</div>
          <div className="stat-change">✓</div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-label">Absent Today</div>
          <div className="stat-value">{stats.absentToday}</div>
          <div className="stat-change">✕</div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid-3" style={{marginTop: '2rem'}}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Attendance Rate</div>
              <div className="card-subtitle">Today's attendance percentage</div>
            </div>
          </div>
          <div style={{fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', textAlign: 'center', padding: '2rem 0'}}>
            {stats.totalEmployees > 0 
              ? Math.round((stats.presentToday / stats.totalEmployees) * 100) 
              : 0}%
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Employees</div>
              <div className="card-subtitle">Active employees</div>
            </div>
          </div>
          <div style={{fontSize: '2rem', fontWeight: 700, color: 'var(--info)', textAlign: 'center', padding: '2rem 0'}}>
            {stats.totalEmployees}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Leave Requests</div>
              <div className="card-subtitle">Pending approvals</div>
            </div>
          </div>
          <div style={{fontSize: '2rem', fontWeight: 700, color: 'var(--danger)', textAlign: 'center', padding: '2rem 0'}}>
            0
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <PerformanceChart />

      {/* Attendance Heatmap */}
      <div style={{marginTop: '2rem'}}>
        <AttendanceHeatmap />
      </div>

      {/* Additional Info */}
      <div className="grid-2" style={{marginTop: '2rem'}}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Activity</div>
          </div>
          <div className="empty">No recent activity</div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Quick Actions</div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
            <Button variant="primary" style={{width: '100%'}}>➕ Add Employee</Button>
            <Button variant="secondary" style={{width: '100%'}}>📋 Mark Attendance</Button>
            <Button variant="ghost" style={{width: '100%'}}>👁️ View Reports</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
