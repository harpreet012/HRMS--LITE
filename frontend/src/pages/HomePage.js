import React from 'react';
import { Dashboard } from '../components/Dashboard';

export const HomePage = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to HRMS Lite</h1>
      <Dashboard />
    </div>
  );
};
