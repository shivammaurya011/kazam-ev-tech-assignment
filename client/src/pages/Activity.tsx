// src/pages/Activity.tsx
import React from 'react';
import DashboardLayout from '../layout/DashboardLayout';

const Activity: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800">Activity</h1>
        <p className="mt-4 text-gray-600">See your recent activity here.</p>
      </div>
    </DashboardLayout>
  );
};

export default Activity;
