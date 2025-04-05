import React from "react";
import { useNavigate } from "react-router-dom";

function Eventos() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome to the Eventos Page</h1>
      <button
        onClick={handleLogout}
        className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition duration-300 shadow-md"
      >
        Logout
      </button>
    </div>
  );
}

export default Eventos;
