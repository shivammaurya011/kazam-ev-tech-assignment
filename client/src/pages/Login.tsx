import { useNavigate } from "react-router-dom"; 
import AuthForm from "../components/auth/AuthForm";
import { useAppDispatch } from "../app/hooks";
import { checkAuth, clearError, loginUser } from "../features/auth/authSlice";
import { useEffect } from "react";
import { useToast } from "../components/ToastContext";

function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogin = async (name: string | null, email: string, password: string) => {
    const result = await dispatch(loginUser({ email, password }));
    console.log(name)
    if (loginUser.fulfilled.match(result)) {
      addToast("Login successful!", "success");
      dispatch(checkAuth())
      navigate('/');
    } else {
      addToast("Invalid credentials. Please try again.", "error");
    }
  };
  
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <div className="flex flex-col md:flex-row h-screen">

      {/* Branding */}
      <div className="md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-10 md:py-0">
        <h1 className="text-5xl font-extrabold mb-4">TaskFlow</h1>
        <p className="text-lg text-center max-w-md leading-relaxed">
          The ultimate task management tool to organize, track, and boost your productivity.
        </p>
      </div>

      {/* Form */}
      <div className="md:w-1/2 flex items-center justify-center bg-gray-100 px-6">
        <AuthForm type="login" onSubmit={handleLogin} />
      </div>
    </div>
  );
}

export default Login;
