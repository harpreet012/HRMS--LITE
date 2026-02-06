import React, { useState } from 'react';
import { AttendanceForm } from '../components/AttendanceForm';
import { AttendanceList } from '../components/AttendanceList';

export const AttendancePage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAttendanceMarked = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <AttendanceForm onSuccess={handleAttendanceMarked} />
      <AttendanceList refreshTrigger={refreshTrigger} />
    </div>
  );
};
