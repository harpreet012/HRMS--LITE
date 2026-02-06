import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EmployeesPage from './pages/EmployeesPage';
import AttendancePage from './pages/AttendancePage';
import './App.css';

function AppContent() {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: '📊' },
    { label: 'Employees', path: '/employees', icon: '👥' },
    { label: 'Attendance', path: '/attendance', icon: '📅' },
    { label: 'Performance', path: '/performance', icon: '📈' },
    { label: 'Leave Management', path: '/leave', icon: '✈️' },
    { label: 'Payroll', path: '/payroll', icon: '💰' },
  ];

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>🏢</span>
          <span>TeamHub</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <h1 className="header-title">
            {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </h1>
          <div className="header-right">
            <button className="btn btn-primary">+ Add New</button>
          </div>
        </header>

        {/* Page Container */}
        <div className="page-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/performance" element={<div><h2>Performance Management</h2><p>Coming soon...</p></div>} />
            <Route path="/leave" element={<div><h2>Leave Management</h2><p>Coming soon...</p></div>} />
            <Route path="/payroll" element={<div><h2>Payroll</h2><p>Coming soon...</p></div>} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="card" style={{ margin: '2rem', marginTop: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>&copy; 2026 TeamHub HR Management System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
