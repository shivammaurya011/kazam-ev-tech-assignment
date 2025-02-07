import { useState, useEffect } from "react";
import { useAppSelector } from "../../app/hooks";

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (name: string, email: string, password: string) => void;
}

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const { loading } = useAppSelector(state => state.auth);

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};

    if (type === "register" && !name.trim()) {
      newErrors.name = "Full name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(name, email, password);
    }
  };

  // Reset error when user starts typing
  useEffect(() => {
    if (name) setErrors((prev) => ({ ...prev, name: undefined }));
  }, [name]);

  useEffect(() => {
    if (email) setErrors((prev) => ({ ...prev, email: undefined }));
  }, [email]);

  useEffect(() => {
    if (password) setErrors((prev) => ({ ...prev, password: undefined }));
  }, [password]);

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl mt-6 transition-all">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        {type === "login" ? "Welcome Back!" : "Create an Account"}
      </h2>

      <form noValidate onSubmit={handleSubmit} className="space-y-5">
        {type === "register" && (
          <div>
            <label className="block text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition disabled:bg-green-300"
          disabled={loading}
        >
          {loading ? "Loading..." : type === "login" ? "Sign In" : "Sign Up"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        {type === "login" ? "Don't have an account?" : "Already have an account?"} {" "}
        <a href={type === "login" ? "/register" : "/login"} className="text-green-500 font-medium hover:underline">
          {type === "login" ? "Sign up" : "Login"}
        </a>
      </p>
    </div>
  );
}
