import React, { useState, useEffect, useCallback } from "react";
import { MdAdd } from "react-icons/md";
import { todosEventos } from '../services/eventosService';
import { PropagateLoader } from "react-spinners";
import EventoCard from "../components/cards/EventoCard";
import NovoEventoPopup from "../components/popups/NovoEventoPopup";
import { useSnackbar } from '../util/SnackbarProvider';
import { useNavigate } from "react-router-dom";

function Eventos() {
  const { showSnackbar } = useSnackbar();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");  
  const navigate = useNavigate();

  const fetchEventos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await todosEventos();
      setEventos(data);
      setFilteredEventos(data);
    } catch (error) {
      showSnackbar(error.message);
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  useEffect(() => {
    const filterEventos = () => {
      setLoading(true);
      const filtered = eventos.filter(evento => {
        return (
          evento.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
          evento.descricao.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setFilteredEventos(filtered);
      setLoading(false);
    };

    if (searchQuery) {
      filterEventos();
    } else {
      setFilteredEventos(eventos);
    }
  }, [searchQuery, eventos]);

  const openPopup = (evento = null) => {
    setSelectedEvento(evento);
    setShowPopup(true);
  };

  const closePopup = (refresh = false) => {
    setSelectedEvento(null);
    setShowPopup(false);
    if (refresh) {
      fetchEventos();
    }
  };

  const paginaEvento = (evento = null) => {
    if (evento && evento.id) {
      navigate(`/eventos/${evento.id}`);
    }
  }

  return (
    <div className="min-h-screen bg-white p-8 relative">
      <h1 className="text-3xl font-bold text-[#264f57] mb-6">Meus Eventos</h1>

      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar por nome ou descrição"
          className="w-full p-2 rounded bg-white text-[#264f57] placeholder-[#264f57] border-2 border-[#264f57] focus:outline-none focus:ring-2 focus:ring-[#55c6b1] focus:border-transparent"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-16">
          <PropagateLoader color="#264f57" size={15} />
        </div>
      ) : (filteredEventos.length === 0 && searchQuery !== "") ? (
        <div className="flex flex-col justify-center items-center p-8">
          <div className="text-3xl font-bold text-[#264f57] mb-4">Evento não encontrado!</div>
          <div className="text-lg text-gray-500">
            Utilize o botão abaixo para cadastrar um evento.
          </div>
        </div>
      ) : (filteredEventos.length === 0) ? (
        <div className="flex flex-col justify-center items-center p-8">
          <div className="text-3xl font-bold text-[#264f57] mb-4">Você não possui eventos!</div>
          <div className="text-lg text-gray-500">
            Utilize o botão abaixo para cadastrar um evento.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
           {filteredEventos.map((evento) => (
            <EventoCard
              key={evento.id}
              evento={evento}
              onClick={() => paginaEvento(evento)}
            />      
          ))}
        </div>
      )}

      <div className="fixed bottom-6 right-6 group flex items-center gap-[15px]">
        <span className="hidden md:inline-block opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 bg-[#3e8682] text-white px-3 py-2 rounded-md whitespace-nowrap">
          Adicionar evento
        </span>
        <button
          className="bg-[#264f57] hover:bg-[#3e8682] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          onClick={() => openPopup(null, true)}
        >
          <MdAdd size={28} />
        </button>
      </div>

      {showPopup && (
        <NovoEventoPopup
          evento={selectedEvento}
          onClose={closePopup}
        />
      )}
    </div>
  );
}

export default Eventos;
