import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { EmployeesPage } from './pages/EmployeesPage';
import { AttendancePage } from './pages/AttendancePage';
import { Users, Calendar, Home } from 'lucide-react';
import './App.css';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation Bar */}
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold">
              📊 HRMS Lite
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="hover:text-blue-200 transition-colors flex items-center gap-2">
                <Home size={20} /> Home
              </Link>
              <Link to="/employees" className="hover:text-blue-200 transition-colors flex items-center gap-2">
                <Users size={20} /> Employees
              </Link>
              <Link to="/attendance" className="hover:text-blue-200 transition-colors flex items-center gap-2">
                <Calendar size={20} /> Attendance
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-2xl"
            >
              ☰
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-blue-700 px-4 py-2 space-y-2">
              <Link
                to="/"
                className="block hover:text-blue-200 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Home size={20} /> Home
                </div>
              </Link>
              <Link
                to="/employees"
                className="block hover:text-blue-200 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Users size={20} /> Employees
                </div>
              </Link>
              <Link
                to="/attendance"
                className="block hover:text-blue-200 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Calendar size={20} /> Attendance
                </div>
              </Link>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 text-white text-center py-6 mt-12">
          <p>&copy; 2024 HRMS Lite. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
