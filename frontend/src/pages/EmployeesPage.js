import React, { useState } from 'react';
import { EmployeeForm } from '../components/EmployeeForm';
import { EmployeeList } from '../components/EmployeeList';

const EmployeesPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEmployeeAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <EmployeeForm onSuccess={handleEmployeeAdded} />
      <EmployeeList refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default EmployeesPage;
