import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import TaskModal, { TaskFormData } from '../components/TaskModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getTasks, createTask, updateTask, deleteTask } from '../features/tasks/tasksSlice';
import { FiPlus, FiEdit, FiTrash2, FiFilter } from 'react-icons/fi';
import { useToast } from '../components/ToastContext';

interface Task extends TaskFormData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

const Tasks: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);
  const { addToast } = useToast();

  // search, filtering, sorting, and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'ongoing' | 'completed'>('all');
  const [sortField, setSortField] = useState<'name' | 'dueDate' | 'status' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal state for Create/Edit and Delete Confirmation
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskFormData | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);

  // Fetch tasks on mount
  useEffect(() => {
    dispatch(getTasks())
      .unwrap()
      .catch((err) => addToast(err, "error"));
  }, [dispatch, addToast]);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle filter status change
  const handleFilterChange = (status: 'all' | 'pending' | 'ongoing' | 'completed') => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  // Handle sorting for table headers
  const handleSort = (field: 'name' | 'dueDate' | 'status') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Open modal for creating a new task
  const openCreateModal = () => {
    setSelectedTask(undefined);
    setIsTaskModalOpen(true);
  };

  // Open modal for editing an existing task
  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (id: string) => {
    setTaskToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // Close modals
  const closeModal = () => {
    setIsTaskModalOpen(false);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTaskToDeleteId(null);
  };

  // Handle submission from the TaskModal 
  const handleTaskSubmit = (data: TaskFormData) => {
    if (selectedTask && selectedTask._id) {
      // Update existing task
      dispatch(updateTask({ id: selectedTask._id, taskData: data }))
        .unwrap()
        .then(() => addToast("Task updated successfully", "success"))
        .catch((err) => addToast(err, "error"));
    } else {
      // Create new task
      dispatch(createTask(data))
        .unwrap()
        .then(() => addToast("Task created successfully", "success"))
        .catch((err) => addToast(err, "error"));
    }
    closeModal();
  };

  // Handle delete confirmation modal action
  const handleDeleteConfirm = () => {
    if (taskToDeleteId) {
      dispatch(deleteTask(taskToDeleteId))
        .unwrap()
        .then(() => addToast("Task deleted successfully", "success"))
        .catch((err) => addToast(err, "error"));
      closeDeleteModal();
    }
  };

  // Filter tasks by search query and status
  const filteredTasks = tasks.filter((task: Task) => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort tasks if a sort field is selected
  const sortedTasks = sortField
  ? [...filteredTasks].sort((a: Task, b: Task) => {
      if (sortField === 'dueDate') {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const valA = a[sortField] as string;
        const valB = b[sortField] as string;
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }
    })
  : filteredTasks;

  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage);
  const paginatedTasks = sortedTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderSortIndicator = (field: 'name' | 'dueDate' | 'status') => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header & Add Button */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
          <button 
            onClick={openCreateModal}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            <FiPlus className="mr-2" />
            Add New Task
          </button>
        </div>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-green-500"
          />
          <div className="flex gap-2">
            {(['all', 'pending', 'ongoing', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleFilterChange(status)}
                className={`px-4 py-2 rounded transition ${
                  filterStatus === status
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <p className="text-gray-700">Loading tasks...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : sortedTasks.length === 0 ? (
          <p className="text-gray-700">No tasks found matching your criteria.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
                      sortField === 'name' ? 'text-green-600 font-bold' : 'text-gray-500'
                    }`}
                    onClick={() => handleSort('name')}
                  >
                    Task Name{renderSortIndicator('name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Description
                  </th>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
                      sortField === 'status' ? 'text-green-600 font-bold' : 'text-gray-500'
                    }`}
                    onClick={() => handleSort('status')}
                  >
                    Status{renderSortIndicator('status')}
                  </th>
                  <th 
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer flex items-center gap-1 ${
                      sortField === 'dueDate' ? 'text-green-600 font-bold' : 'text-gray-500'
                    }`}
                    onClick={() => handleSort('dueDate')}
                  >
                    <FiFilter className="inline" />
                    Due Date{renderSortIndicator('dueDate')}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedTasks.map((task: Task) => (
                  <tr key={task._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{task.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{task.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">{task.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                      <button 
                        onClick={() => openEditModal(task)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(task._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {/* Task Modal for Create/Edit */}
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={closeModal}
          onSubmit={handleTaskSubmit}
          task={selectedTask}
        />
        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteConfirm}
          message="Are you sure you want to delete this task? This action cannot be undone."
        />
      </div>
    </DashboardLayout>
  );
};

export default Tasks;
