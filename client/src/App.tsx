import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Activity from './pages/Activity';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default App;
