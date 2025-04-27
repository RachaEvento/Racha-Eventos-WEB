import React, { useState, useEffect } from "react";
import { MdAdd } from "react-icons/md";
import { todosLocais } from '../services/locaisService';
import { PropagateLoader } from "react-spinners";
import LocalCard from "../components/cards/LocalCard";
import LocalPopup from "../components/popups/LocalPopup";

function Locais() {
  const [locals, setlocals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredlocals, setFilteredlocals] = useState([]);
  const [selectedLocal, setSelectedLocal] = useState(null);  
  const [isNew, setIsNew] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLocais = async () => {
    setLoading(true);
    try {
      const data = await todosLocais();
      setlocals(data);
      setFilteredlocals(data);
    } catch (error) {
      console.error("Erro ao buscar Locais:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocais();
  }, []);

  useEffect(() => {
    // Mostrar o loader enquanto filtra os Locais
    const filterlocals = () => {
      setLoading(true);
      const filtered = locals.filter(Local => {
        return (
          Local.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
          Local.endereco.toLowerCase().includes(searchQuery.toLowerCase()) ||
          Local.bairro.includes(searchQuery) ||
          Local.cidade.includes(searchQuery)
        );
      });
      setFilteredlocals(filtered);
      setLoading(false);
    };

    if (searchQuery) {
      filterlocals(); // Chama o filtro quando a consulta muda
    } else {
      setFilteredlocals(locals); // Se a consulta estiver vazia, mostrar todos os Locais
    }
  }, [searchQuery, locals]);

  const openPopup = (Local = null, isNew = false) => {
    setSelectedLocal(Local);
    setIsNew(isNew);
    setShowPopup(true);
  };

  const closePopup = (refresh = false) => {
    setSelectedLocal(null);
    setShowPopup(false);
    if (refresh) {
      fetchLocais();
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 relative">
      <h1 className="text-3xl font-bold text-[#264f57] mb-6">Gestão de Locais</h1>

      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Atualiza o estado do valor de busca
          placeholder="Pesquisar por nome, endereço, bairro ou cidade"
          className="w-full p-2 rounded bg-white text-[#264f57] placeholder-[#264f57] border-2 border-[#264f57] focus:outline-none focus:ring-2 focus:ring-[#55c6b1] focus:border-transparent"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-16">
          <PropagateLoader color="#264f57" size={15} />
        </div>
      ) : filteredlocals.length === 0 ? (
        <div className="flex flex-col justify-center items-center p-8">
          <div className="text-3xl font-bold text-[#264f57] mb-4">Você não possuí Locais!</div>
          <div className="text-lg text-gray-500">
            Utilize o botão abaixo para cadastrar um contato!
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-6 mb-20">
          {filteredlocals.map((Local) => (
            <LocalCard
              key={Local.id}
              nome={Local.nome}
              email={Local.email}
              telefone={Local.telefone}
              onClick={() => openPopup(Local, false)}
            />
          ))}
        </div>
      )}

      <div className="fixed bottom-6 right-6 group flex items-center gap-[15px]">
        <span className="hidden md:inline-block opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 bg-[#3e8682] text-white px-3 py-2 rounded-md whitespace-nowrap">
          Adicionar contato
        </span>
        <button
          className="bg-[#264f57] hover:bg-[#3e8682] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          onClick={() => openPopup(null, true)}
        >
          <MdAdd size={28} />
        </button>
      </div>

      {showPopup && (
        <LocalPopup
          Local={selectedLocal}
          isNew={isNew}
          onClose={closePopup}
        />
      )}
    </div>
  );
}

export default Locais;
