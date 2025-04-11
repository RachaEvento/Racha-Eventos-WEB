import React from "react";
import { useNavigate } from "react-router-dom";

function Locais() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome to the Locais Page</h1>
      <LocalCard/>
    </div>
  );
}

export default Locais;
