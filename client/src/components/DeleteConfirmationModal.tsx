import React from 'react';
import { FiX } from 'react-icons/fi';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black opacity-50" 
        onClick={onClose} 
      />
      {/* Modal Container */}
      <div className="bg-white rounded-lg shadow-xl z-50 w-11/12 md:w-1/3 p-6 relative">
        <button 
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none" 
          onClick={onClose}
        >
          <FiX size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
        <p className="mb-6 text-gray-700">
          {message || 'Are you sure you want to delete this task? This action cannot be undone.'}
        </p>
        <div className="flex justify-end space-x-4">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
