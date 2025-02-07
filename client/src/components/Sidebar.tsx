import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiList, FiActivity, FiUser, FiLogOut, FiX } from 'react-icons/fi';
import { logoutUser } from '../features/auth/authSlice';
import { useAppDispatch } from '../app/hooks';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>
      <aside
        className={`fixed z-40 inset-y-0 left-0 transform transition duration-300 ease-in-out bg-white shadow-md flex flex-col justify-between p-6 w-64
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-auto`}
      >
        {/* Mobile close button */}
        <div className="flex justify-end md:hidden">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 focus:outline-none">
            <FiX size={24} />
          </button>
        </div>
        <div>
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="bg-green-500 text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full font-bold">
              T
            </div>
            <span className="ml-3 text-xl font-semibold text-gray-800">TaskFlow</span>
          </div>
          {/* Navigation */}
          <nav className="space-y-4">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center space-x-3 text-gray-700 hover:text-green-500 transition-colors ${
                  isActive ? 'text-green-500 font-semibold' : ''
                }`
              }
            >
              <FiHome size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `flex items-center space-x-3 text-gray-700 hover:text-green-500 transition-colors ${
                  isActive ? 'text-green-500 font-semibold' : ''
                }`
              }
            >
              <FiList size={20} />
              <span>Tasks</span>
            </NavLink>
            <NavLink
              to="/activity"
              className={({ isActive }) =>
                `flex items-center space-x-3 text-gray-700 hover:text-green-500 transition-colors ${
                  isActive ? 'text-green-500 font-semibold' : ''
                }`
              }
            >
              <FiActivity size={20} />
              <span>Activity</span>
            </NavLink>
          </nav>
        </div>
        {/* Action Buttons */}
        <div className="space-y-4 mt-8">
          <hr />
          <button 
            onClick={()=>navigate('/profile')}
            className="flex items-center space-x-3 text-gray-700 hover:text-green-500 transition w-full">
            <FiUser size={20} />
            <span>Profile</span>
          </button>
          <button 
            onClick={() => dispatch(logoutUser())}
            className="flex items-center space-x-3 text-gray-700 hover:text-green-500 transition w-full">
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
