import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Autenticacao from "./pages/Autenticacao";
import RotaProtegida from "./auth/RotaProtegida";
import { SnackbarProvider } from './util/SnackbarProvider';
import Contatos from "./pages/Contatos";
import Locais from "./pages/Locais";
import Menu from "./components/Menu";
import Configuracoes from "./pages/Configuracoes";
import Eventos from "./pages/Eventos";
import Evento from "./pages/Evento";
import Convite from "./pages/Convite";
import Cobrar from "./pages/Cobrar";
import DocumentacaoPage from "./pages/Documentacao/DocumentacaoPage";

function App() {
  return (
    <SnackbarProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Autenticacao />} />
        <Route path="/eventos" element={<RotaProtegida><Menu><Eventos /></Menu></RotaProtegida>} />
        <Route path="/eventos/:id" element={<RotaProtegida><Menu><Evento /></Menu></RotaProtegida>} />
        <Route path="/contatos" element={<RotaProtegida><Menu><Contatos /></Menu></RotaProtegida>} />
        <Route path="/locais" element={<RotaProtegida><Menu><Locais /></Menu></RotaProtegida>} />
        <Route path="/configuracoes" element={<RotaProtegida><Menu><Configuracoes /></Menu></RotaProtegida>} />
        <Route path="/convite/:id" element={<Convite />} />
        <Route path="/cobrar/:id" element={<Cobrar />} />
        <Route path="/documentacao" element={<DocumentacaoPage />} />
      </Routes>
     </Router>
    </SnackbarProvider>
  );
}

export default App;
