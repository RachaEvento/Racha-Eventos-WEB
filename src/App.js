import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Autenticacao from "./pages/Autenticacao";
import Eventos from "./pages/Eventos";
import RotaProtegida from "./auth/RotaProtegida";
import { SnackbarProvider } from './util/SnackbarProvider';
import Contatos from "./pages/Contatos";
import Locais from "./pages/Locais";
import Menu from "./components/Menu";
import Configuracoes from "./pages/Configuracoes";
import NovoEvento from "./pages/NovoEvento";

function App() {
  return (
    <SnackbarProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Autenticacao />} />
        <Route path="/eventos" element={<RotaProtegida><Menu><Eventos /></Menu></RotaProtegida>} />        
        <Route path="/contatos" element={<RotaProtegida><Menu><Contatos /></Menu></RotaProtegida>} />
        <Route path="/locais" element={<RotaProtegida><Menu><Locais /></Menu></RotaProtegida>} />
        <Route path="/novo-evento" element={<RotaProtegida><Menu><NovoEvento /></Menu></RotaProtegida>} />
        <Route path="/configuracoes" element={<RotaProtegida><Menu><Configuracoes /></Menu></RotaProtegida>} />
      </Routes>
    </Router>
    </SnackbarProvider>
  );
}

export default App;
