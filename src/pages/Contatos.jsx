import React, { useState, useEffect } from "react";
import { MdAdd } from "react-icons/md";
import { todosContatos } from '../services/contatosService';
import { PropagateLoader } from "react-spinners";
import ContatoCard from "../components/cards/ContatoCard";
import ContatoPopup from "../components/popups/ContatoPopup";

function Contatos() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);  
  const [isNew, setIsNew] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchContatos = async () => {
    setLoading(true);
    try {
      const data = await todosContatos();
      setContacts(data);
      setFilteredContacts(data);
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContatos();
  }, []);

  useEffect(() => {
    // Mostrar o loader enquanto filtra os contatos
    const filterContacts = () => {
      setLoading(true);
      const filtered = contacts.filter(contact => {
        return (
          contact.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.telefone.includes(searchQuery)
        );
      });
      setFilteredContacts(filtered);
      setLoading(false);
    };

    if (searchQuery) {
      filterContacts(); // Chama o filtro quando a consulta muda
    } else {
      setFilteredContacts(contacts); // Se a consulta estiver vazia, mostrar todos os contatos
    }
  }, [searchQuery, contacts]);

  const openPopup = (contact = null, isNew = false) => {
    setSelectedContact(contact);
    setIsNew(isNew);
    setShowPopup(true);
  };

  const closePopup = (refresh = false) => {
    setSelectedContact(null);
    setShowPopup(false);
    if (refresh) {
      fetchContatos();
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 relative">
      <h1 className="text-3xl font-bold text-[#264f57] mb-6">Gestão de Contatos</h1>

      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Atualiza o estado do valor de busca
          placeholder="Pesquisar por nome, telefone, email..."
          className="w-full p-2 rounded bg-white text-[#264f57] placeholder-[#264f57] border-2 border-[#264f57] focus:outline-none focus:ring-2 focus:ring-[#55c6b1] focus:border-transparent"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-16">
          <PropagateLoader color="#264f57" size={15} />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-6 mb-20">
          {filteredContacts.map((contact) => (
            <ContatoCard
              key={contact.id}
              nome={contact.nome}
              email={contact.email}
              telefone={contact.telefone}
              onClick={() => openPopup(contact, false)}
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
        <ContatoPopup
          contact={selectedContact}
          isNew={isNew}
          onClose={closePopup}
        />
      )}
    </div>
  );
}

export default Contatos;
