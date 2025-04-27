import React from "react";
import { useNavigate } from "react-router-dom";

function Eventos() {
  const navigate = useNavigate();

  const handleNovoEvento = () => {
    navigate("/novo-evento");
  };

  return (
    <div className="bg-white min-h-screen font-inter">
      <div className="p-6">
        {/* Cabeçalho com título e botão */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-extrabold text-[#3F9184]">Meus Eventos</h1>
          <button
            onClick={handleNovoEvento}
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
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3F9184]"
          />
        </div>

        {/* Cards de eventos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl overflow-hidden shadow-md">
              <div className="h-40 bg-gray-300" />
              <div className="p-4">
                <h2 className="font-semibold text-lg text-gray-800">Título do evento</h2>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">01/01/25 23:59</span>
                  <span className="bg-[#3F9184] text-white px-4 py-1 rounded-full text-sm font-medium">
                    Status
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
