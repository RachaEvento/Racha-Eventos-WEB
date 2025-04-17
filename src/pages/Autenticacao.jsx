import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "../components/Login";
import Registro from "../components/Registro";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Autenticacao() {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/eventos');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center sm:bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg sm:shadow-lg">
        <img
          src="/logo-bar.png"
          alt="Logo"
          className="w-full bg-white rounded-lg"
        />
        <div className="flex mb-4 border-b">
          <button
            className={`py-2 px-4 w-1/2 text-center ${
              activeTab === "login"
                ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`py-2 px-4 w-1/2 text-center ${
              activeTab === "register"
                ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("register")}
          >
            Registro
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "login" ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Login />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Registro setActiveTab={setActiveTab} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default Autenticacao;
