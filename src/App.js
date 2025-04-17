import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Autenticacao from "./pages/Autenticacao";
import Eventos from "./pages/Eventos";
import RotaProtegida from "./auth/RotaProtegida";
import { SnackbarProvider } from './util/SnackbarProvider';

function App() {
  return (
    <SnackbarProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Autenticacao />} />
        <Route path="/eventos" element={<RotaProtegida><Eventos /></RotaProtegida>} />
      </Routes>
    </Router>
    </SnackbarProvider>
  );
}

export default App;
