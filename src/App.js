import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Autenticacao from "./pages/Autenticacao";
import Eventos from "./pages/Eventos";
import RotaProtegida from "./auth/RotaProtegida";
import Locais from "./pages/Locais";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Autenticacao />} />
        <Route path="/eventos" element={<RotaProtegida><Eventos /></RotaProtegida>} />
        <Route path="/locais" element={<RotaProtegida><Locais /></RotaProtegida>} />
      </Routes>
    </Router>
  );
}

export default App;
