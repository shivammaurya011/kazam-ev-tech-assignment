import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { checkAuth } from '../features/auth/authSlice';

const ProtectedRoute = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, initialized } = useAppSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    if (!initialized) {
      dispatch(checkAuth()).unwrap().catch((error) => {
        console.log('Authentication check failed:', error);
      });
    }
  }, [dispatch, initialized]);

  if (!initialized || loading) return <div>Loading...</div>;

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
