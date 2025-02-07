import React, { useState, useEffect, FormEvent } from 'react';
import { FiX } from 'react-icons/fi';

export interface TaskFormData {
  _id?: string;
  name: string;
  description: string;
  status: 'pending' | 'ongoing' | 'completed';
  dueDate: string; 
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  task?: TaskFormData; 
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, task }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    description: '',
    status: 'pending',
    dueDate: '',
  });

  useEffect(() => {
    if (task) {
      const formattedDueDate = task.dueDate ? task.dueDate.slice(0, 10) : '';
      setFormData({ ...task, dueDate: formattedDueDate });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'pending',
        dueDate: '',
      });
    }
  }, [task, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black opacity-50" 
        onClick={onClose} 
      />
      {/* Modal Container */}
      <div className="bg-white rounded-lg shadow-xl z-50 w-11/12 md:w-1/2 lg:w-1/3 p-6 relative">
        <button 
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none" 
          onClick={onClose}
        >
          <FiX size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">
          {task ? 'Edit Task' : 'Create Task'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Task Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="pending">Pending</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
