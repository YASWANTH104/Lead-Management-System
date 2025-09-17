import { useState } from "react";
import { API } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/login", { email, password });
      navigate("/leads");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-300 via-purple-200 to-pink-200">
      <form
        onSubmit={handleLogin}
        className="bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96 animate-fadeIn"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        <div className="relative mb-5">
          <label className="mb-3 text-gray-600" htmlFor="email-field">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            id="email-field"
          />
        </div>
        <div className="relative mb-5">
          <label className="mb-3 text-gray-600" htmlFor="password-field">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
            id="password-field"
          />
        </div>
        <button className="w-full bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-105 transform transition-all duration-300">
          Login
        </button>
        <p
          onClick={() => navigate("/register")}
          className="mt-4 text-center text-gray-500 text-sm hover:text-gray-700 cursor-pointer transition"
        >
          Don't have an account?{" "}
          <span className="underline hover:text-blue-800">Register</span>
        </p>
      </form>
    </div>
  );
}
