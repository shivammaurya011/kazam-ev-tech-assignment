import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";
import { useAppDispatch } from "../app/hooks";
import { clearError, registerUser } from "../features/auth/authSlice";
import { useEffect } from "react";
import { useToast } from "../components/ToastContext";

function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const handleRegister = async (name: string, email: string, password: string) => {
    const result = await dispatch(registerUser({ name, email, password }));

    if (registerUser.fulfilled.match(result)) {
      addToast("Registration successful! Please log in.", "success");
      const redirectTo = location.state?.from?.pathname || "/login";
      navigate(redirectTo);
    } else {
      addToast("Registration failed. Please try again.", "error");
    }
  };

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <div className="flex flex-col md:flex-row h-screen">

      {/* Branding */}
      <div className="md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-l from-green-500 to-green-600 text-white px-10 py-10 md:py-0">
        <h1 className="text-5xl font-extrabold mb-4">TaskFlow</h1>
        <p className="text-lg text-center max-w-md leading-relaxed">
          The ultimate task management tool to organize, track, and boost your productivity.
        </p>
      </div>

      {/* Form */}
      <div className="md:w-1/2 flex items-center justify-center bg-gray-100 px-6">
        <AuthForm type="register" onSubmit={handleRegister} />
      </div>
      
    </div>
  );
}

export default Register;
