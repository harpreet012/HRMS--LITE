import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PerformanceChart = () => {
  const [performance, setPerformance] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const perfRes = await axios.get('http://localhost:5000/api/performance');
      const trendRes = await axios.get('http://localhost:5000/api/performance/attendance-trend');

      if (perfRes.data.success) {
        setPerformance(perfRes.data);
      }
      if (trendRes.data.success) {
        setTrend(trendRes.data.data || []);
      }
    } catch (err) {
      console.error('Performance fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;

  if (!performance) return null;

  // Simple bar chart using divs
  const maxRate = 100;
  const recentData = trend.slice(-14); // Last 14 days

  return (
    <div className="grid-2 grid-full">
      {/* Performance Metrics */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Performance Overview</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Attendance %</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)', marginTop: '0.5rem' }}>
              {performance.attendance_percentage}%
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Employees</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--info)', marginTop: '0.5rem' }}>
              {performance.employee_count}
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Present</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)', marginTop: '0.5rem' }}>
              {performance.total_present}
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Absent</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)', marginTop: '0.5rem' }}>
              {performance.total_absent}
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Trend Chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Attendance Trend (Last 14 Days)</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '0.5rem', marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: '8px' }}>
          {recentData.map((day, idx) => {
            const rate = day.attendance_rate || 0;
            const height = (rate / maxRate) * 100;

            return (
              <div
                key={idx}
                style={{
                  flex: 1,
                  height: `${height}%`,
                  minHeight: '20px',
                  backgroundColor: rate >= 80 ? 'var(--success)' : rate >= 60 ? 'var(--warning)' : 'var(--danger)',
                  borderRadius: '4px 4px 0 0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
                title={`${day.date}: ${rate}%`}
              >
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-20px',
                    left: 0,
                    right: 0,
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                  }}
                >
                  {new Date(day.date).getDate()}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '3rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Green (≥80%) | Amber (60-79%) | Red (&lt;60%)
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
