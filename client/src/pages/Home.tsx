import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import tmsImg from '../assets/tmsImg.avif';
import { Line, Pie } from 'react-chartjs-2';
import {
  FiList,
  FiClock,
  FiActivity,
  FiCheckCircle,
  FiPlus
} from 'react-icons/fi';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TaskModal, { TaskFormData } from '../components/TaskModal';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { createTask, getTasks } from '../features/tasks/tasksSlice';
import { useToast } from '../components/ToastContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector((state) => state.tasks);
  const { addToast } = useToast();

  // Compute real data from Redux (fallback to 0 if no tasks)
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((task) => task.status === 'pending').length;
  const inProgressTasks = tasks.filter((task) => task.status === 'ongoing').length;
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const totalPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Modal state for Create/Edit Task
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getTasks())
      .unwrap()
      .catch((err) => addToast(err, "error"));
  }, [dispatch, addToast]);

  const openCreateModal = () => {
    setIsTaskModalOpen(true);
  };

  const closeModal = () => {
    setIsTaskModalOpen(false);
  };

  const handleTaskSubmit = (data: TaskFormData) => {
    dispatch(createTask(data))
      .unwrap()
      .then(() => addToast("Task created successfully", "success"))
      .catch((err) => addToast(err, "error"));
    closeModal();
  };

  // Dummy data for monthly progress
  const monthsProgress = [
    { month: 'Jan', tasks: 5 },
    { month: 'Feb', tasks: 7 },
    { month: 'Mar', tasks: 10 },
    { month: 'Apr', tasks: 8 },
    { month: 'May', tasks: 12 },
  ];

  // Line Chart for Total Work Progress
  const lineData = {
    labels: monthsProgress.map((item) => item.month),
    datasets: [
      {
        label: 'Tasks Completed',
        data: monthsProgress.map((item) => item.tasks),
        fill: false,
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(16, 185, 129, 1)',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
  };

  // Pie Chart for Task Breakdown
  const pieData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Task Distribution',
        data: [pendingTasks, inProgressTasks, completedTasks],
        backgroundColor: [
          'rgba(234, 179, 8, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderColor: [
          'rgba(234, 179, 8, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row gap-8 p-4">
        {/* Main Content */}
        <div className="w-full md:w-8/12 space-y-8">
          {/* Welcome Area */}
          <div className="flex flex-col md:flex-row items-center bg-white rounded-lg p-6 shadow-sm">
            <div className="w-full md:w-2/3">
              <h3 className="text-lg font-medium text-gray-600">Welcome To</h3>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Your Task Management Area
              </h2>
              <p className="text-gray-600 mb-4">
                Manage your tasks effectively to improve productivity and track your progress seamlessly.
              </p>
              <button
                onClick={openCreateModal}
                className="flex items-center justify-center space-x-3 bg-green-500 text-white py-2 px-8 rounded shadow hover:bg-green-600 transition"
              >
                <FiPlus size={20} />
                <span>Add New Task</span>
              </button>
            </div>
            <div className="w-full md:w-1/3 mt-6 md:mt-0 flex justify-center">
              <img
                src={tmsImg}
                alt="Task Management"
                className="object-cover rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Numbers Section */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {/* Total Tasks */}
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <FiList className="text-indigo-500 text-3xl mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{totalTasks}</h1>
                <p className="text-gray-600">Total Tasks</p>
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <FiClock className="text-yellow-500 text-3xl mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{pendingTasks}</h1>
                <p className="text-gray-600">Pending</p>
              </div>
            </div>

            {/* In Progress Tasks */}
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <FiActivity className="text-blue-500 text-3xl mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{inProgressTasks}</h1>
                <p className="text-gray-600">In Progress</p>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <FiCheckCircle className="text-green-500 text-3xl mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{completedTasks}</h1>
                <p className="text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Work Progress - Line Chart */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Total Work</h2>
              <Line data={lineData} options={lineOptions} />
            </div>

            {/* Task Breakdown - Pie Chart */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm flex flex-col items-center justify-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Breakdown</h2>
              <div className="w-full max-w-xs">
                <Pie data={pieData} options={pieOptions} />
              </div>
              <div className="mt-4 text-gray-600">
                {completedTasks} of {totalTasks} tasks completed ({totalPercentage}%)
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="w-full md:w-4/12 space-y-8">
          {/* Calendar Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Calendar</h2>
            <div className="flex items-center justify-center">
              <Calendar
                className="w-full rounded-lg border border-gray-300 shadow-md"
                tileClassName="p-2"
                nextLabel={<span className="text-gray-600">&gt;</span>}
                prevLabel={<span className="text-gray-600">&lt;</span>}
                next2Label={null}
                prev2Label={null}
              />
            </div>
          </div>

          {/* Activity Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <ul className="space-y-4 h-[335px] overflow-y-auto text-gray-600 text-sm">
              <li>
                <span className="font-semibold text-gray-800">John Doe</span> completed task “Design Homepage”
              </li>
              <li>
                <span className="font-semibold text-gray-800">Jane Smith</span> updated task “Fix Bug #123”
              </li>
              <li>
                <span className="font-semibold text-gray-800">John Doe</span> added a new task “Update Docs”
              </li>
              <li>
                <span className="font-semibold text-gray-800">Admin</span> approved task “Deploy to Production”
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Task Modal for Create/Edit */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={closeModal}
        onSubmit={handleTaskSubmit}
      />
    </DashboardLayout>
  );
};

export default Home;
