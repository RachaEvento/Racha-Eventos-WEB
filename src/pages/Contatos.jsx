import React, { useState, useEffect } from "react";
import { MdAdd, MdPerson } from "react-icons/md";

const contacts = [
  { id: 1, name: "João Silva", email: "joao.silva@email.com", phone: "(11) 91234-5678" },
  { id: 2, name: "Maria Oliveira", email: "maria.oliveira@email.com", phone: "(21) 99876-5432" },
  { id: 3, name: "Carlos Santos", email: "carlos.santos@email.com", phone: "(31) 98765-4321" },
  { id: 4, name: "Ana Pereira", email: "ana.pereira@email.com", phone: "(41) 91234-0011" },
];

function ContactCard({ name, email, phone, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex flex-col items-center justify-center bg-white border border-[#3e8682] rounded-lg w-full aspect-square shadow hover:shadow-md"
    >
      <div className="w-1/2 h-1/2 rounded-full bg-[#55c6b1] flex items-center justify-center mb-4">
        <MdPerson size={48} className="text-white" />
      </div>
      <span className="text-[#264f57] font-semibold mb-1 text-center">{name}</span>
    </div>
  );
}

function ContactPopup({ contact, onClose }) {
    const [editedContact, setEditedContact] = useState(null);
    const [editedFields, setEditedFields] = useState({});
  
    useEffect(() => {
      if (contact) {
        setEditedContact(contact);
        setEditedFields({});
      }
    }, [contact]);
  
    if (!contact || !editedContact) return null;
  
    const handleChange = (field, value) => {
      setEditedContact((prev) => ({ ...prev, [field]: value }));
      setEditedFields((prev) => ({
        ...prev,
        [field]: value !== contact[field],
      }));
    };
  
    const hasChanges = Object.values(editedFields).some(Boolean);
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center relative mx-4">
          <button
            className="absolute top-2 right-2 text-[#264f57] hover:text-[#3e8682] text-2xl font-bold"
            onClick={onClose}
          >
            &times;
          </button>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[#55c6b1] flex items-center justify-center mb-4">
              <MdPerson size={48} className="text-white" />
            </div>
  
            <input
              type="text"
              value={editedContact.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`text-center font-semibold text-[#264f57] mb-4 w-full p-2 rounded focus:outline-none transition-shadow duration-200 ${
                editedFields.name
                  ? "shadow-[inset_0_0_0_2px_#264f57]"
                  : "shadow-none"
              }`}
            />
  
            <div className="w-full mb-2">
              <input
                type="text"
                value={editedContact.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={`text-left text-[#264f57] w-full p-2 rounded focus:outline-none transition-shadow duration-200 ${
                  editedFields.phone
                    ? "shadow-[inset_0_0_0_2px_#264f57]"
                    : "shadow-none"
                }`}
              />
            </div>
  
            <div className="w-full">
              <input
                type="text"
                value={editedContact.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`text-left text-[#264f57] w-full p-2 rounded focus:outline-none transition-shadow duration-200 ${
                  editedFields.email
                    ? "shadow-[inset_0_0_0_2px_#264f57]"
                    : "shadow-none"
                }`}
              />
            </div>
  
            {/* Botão sempre presente, mas invisível se não houver mudanças */}
            <div className="mt-4 ml-auto h-[42px]">
              <button
                className={`bg-[#264f57] hover:bg-[#3e8682] text-white px-4 py-2 rounded transition-opacity duration-200 ${
                  hasChanges ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
                onClick={() => console.log("Salvar alterações", editedContact)}
                disabled={!hasChanges}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}

function Contatos() {
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <div className="min-h-screen bg-white p-8 relative">
      <h1 className="text-3xl font-bold text-[#264f57] mb-6">Gestão de Contatos</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Pesquisar por nome, telefone, email..."
          className="w-full p-2 rounded bg-white text-[#264f57] placeholder-[#264f57] border-2 border-[#264f57] focus:outline-none focus:ring-2 focus:ring-[#55c6b1] focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-6 mb-20">
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            name={contact.name}
            email={contact.email}
            phone={contact.phone}
            onClick={() => setSelectedContact(contact)}
          />
        ))}
      </div>

      <div className="fixed bottom-6 right-6 group flex items-center gap-[15px]">
        <span className="hidden md:inline-block opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 bg-[#3e8682] text-white px-3 py-2 rounded-md whitespace-nowrap">
          Adicionar contato
        </span>
        <button
          className="bg-[#264f57] hover:bg-[#3e8682] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          onClick={() => console.log("Adicionar novo contato")}
        >
          <MdAdd size={28} />
        </button>
      </div>

      <ContactPopup contact={selectedContact} onClose={() => setSelectedContact(null)} />
    </div>
  );
}

export default Contatos;
