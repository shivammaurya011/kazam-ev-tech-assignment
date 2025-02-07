import React from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { useAppSelector } from '../app/hooks';

const Profile: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile</h1>
        {user ? (
          <div className="divide-y divide-gray-200">
            <div className="py-4 flex flex-col sm:flex-row sm:justify-between">
              <span className="font-semibold text-gray-700">Name</span>
              <span className="text-gray-600 break-words">{user.name}</span>
            </div>
            <div className="py-4 flex flex-col sm:flex-row sm:justify-between">
              <span className="font-semibold text-gray-700">Email</span>
              <span className="text-gray-600 break-words">{user.email}</span>
            </div>
            {user.createdAt && (
              <div className="py-4 flex flex-col sm:flex-row sm:justify-between">
                <span className="font-semibold text-gray-700">Created At</span>
                <span className="text-gray-600">
                  {new Date(user.createdAt).toLocaleString()}
                </span>
              </div>
            )}
            {user.updatedAt && (
              <div className="py-4 flex flex-col sm:flex-row sm:justify-between">
                <span className="font-semibold text-gray-700">Updated At</span>
                <span className="text-gray-600">
                  {new Date(user.updatedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No user details found.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
