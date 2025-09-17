import React from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../utils/api";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await API.post("/auth/logout");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between bg-blue-600 text-white p-4">
      <h1 className="text-lg font-bold cursor-pointer" onClick={() => navigate("/leads")}>
        Lead Manager
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 px-3 py-1 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </nav>
  );
}
