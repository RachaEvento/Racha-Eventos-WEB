import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import Login from "../../components/login/Login";
import Registro from "../../components/registro/Registro";
import { useNavigate } from "react-router-dom";
import loginImagem from "../../resources/loginimage.png";
import "./Style.css";

function Autenticacao() {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/eventos");
    }
  }, [navigate]);

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="typing-wrapper">
          <h1 className="typing-line">
            <Typewriter
              words={["Racha"]}
              loop={true}
              cursor={false}
              typeSpeed={200}
              delaySpeed={1500}
            />
          </h1>
          <h1 className="typing-line">
            <Typewriter
              words={["Eventos"]}
              loop={true}
              cursor
              cursorStyle="|"
              typeSpeed={200}
              delaySpeed={2000}
            />
          </h1>
        </div>
        <p className="auth-slogan">
       <strong> A festa é de todos, o bolso é de cada um! Rache os custos e curta sem peso na consciência.</strong>
        </p>
        <img
          src={loginImagem}
          alt="Imagem de Evento"
          className="auth-image"
        />
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="tab-buttons">
            <button
              className={activeTab === "login" ? "active" : ""}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={activeTab === "register" ? "active" : ""}
              onClick={() => setActiveTab("register")}
            >
              Registro
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Login />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Registro />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Autenticacao;
