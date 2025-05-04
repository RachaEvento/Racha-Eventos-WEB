import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa o hook de navegação

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate(); // Hook para navegação

  const eventosFiltrados = eventos.filter((evento) =>
    evento.nome?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen font-inter">
      <div className="p-6">
        {/* Cabeçalho com título e botão */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-extrabold text-[#3F9184]">Meus Eventos</h1>
          <button
            onClick={() => navigate("/novo-evento")}
            className="border border-[#3F9184] text-[#3F9184] px-5 py-2 rounded-full hover:bg-[#3F9184] hover:text-white transition"
          >
            Novo Evento
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-gray-200 p-4 rounded-xl mb-6">
          <input
            type="text"
            placeholder="Filtros..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3F9184]"
          />
        </div>

        {/* Cards de eventos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {eventosFiltrados.map((evento) => (
            <div key={evento.id} className="bg-gray-100 rounded-xl overflow-hidden shadow-md">
              <div className="h-40 bg-gray-300" />
              <div className="p-4">
                <h2 className="font-semibold text-lg text-gray-800">{evento.nome}</h2>
                <p className="text-sm text-gray-600 mb-2">{evento.descricao}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">
                    {new Date(evento.dataFinal).toLocaleDateString()}{" "}
                    {new Date(evento.dataFinal).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="bg-[#3F9184] text-white px-4 py-1 rounded-full text-sm font-medium">
                    {evento.status === 0 ? "Pendente" : "Finalizado"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Eventos;
