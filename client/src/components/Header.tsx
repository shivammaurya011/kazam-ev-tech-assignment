import React, { useState, useRef, useEffect } from 'react';
import { FiUser, FiMenu } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logoutUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onSidebarToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="flex items-center justify-between bg-white shadow py-3 px-4 md:px-12 relative">
      <div className="flex items-center">
        {onSidebarToggle && (
          <button
            onClick={onSidebarToggle}
            className="mr-4 md:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <FiMenu size={24} />
          </button>
        )}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          <div className="text-gray-500 text-sm">{formattedDate}</div>
        </div>
      </div>
      {/* User profile dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 hover:bg-green-100 p-3 rounded-2xl focus:outline-none"
        >
          <FiUser size={24} className="text-gray-600" />
          <span className="text-gray-700">{user?.name}</span>
        </button>
        {dropdownOpen && (
          <div className="absolute -right-8 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-50">
            <div className="py-2">
              <div className="px-4 py-2 text-sm text-gray-700">{user?.email}</div>
              <hr className="border-gray-200" />
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={()=>navigate('/profile')}
              >
                Profile
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => dispatch(logoutUser())}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
