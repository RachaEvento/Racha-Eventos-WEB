import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";

const contacts = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 91234-5678",
  },
  {
    id: 2,
    name: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    phone: "(21) 99876-5432",
  },
];

function Contatos() {
    return (
        <div className="min-h-screen bg-white p-8">
            <h1 className="text-3xl font-bold text-[#264f57] mb-6">Gestão de Contatos</h1>
        
            <div className="mb-6">
                <input
                type="text"
                placeholder="Pesquisar contato..."
                className="w-full p-2 rounded bg-white text-[#264f57] placeholder-[#264f57] border-2 border-[#264f57] focus:outline-none focus:ring-2 focus:ring-[#55c6b1] focus:border-transparent"
                />
            </div>
        
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-[#264f57]">
                    <thead>
                        <tr className="bg-[#55c6b1] text-white">
                            <th className="p-4 rounded-tl-lg rounded-bl-lg">Nome</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Telefone</th>
                            <th className="p-4 rounded-tr-lg rounded-br-lg">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((contact) => (
                        <tr key={contact.id} className="border-b border-[#3e8682] hover:text-[#3e8682]">
                            <td className="p-4">{contact.name}</td>
                            <td className="p-4">{contact.email}</td>
                            <td className="p-4">{contact.phone}</td>
                            <td className="p-4">
                            <div className="flex gap-2">
                                <button className="bg-[#55c6b1] hover:bg-[#3e8682] text-white px-2 py-1 rounded">
                                    <MdEdit size={16} />
                                </button>
                                <button className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded">
                                    <MdDelete size={16} />
                                </button>
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>            
        </div>
    );
}

export default Contatos;