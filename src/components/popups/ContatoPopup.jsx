import React, { useState, useEffect } from "react";
import { MdPerson, MdEmail, MdPhone } from "react-icons/md";
import Cleave from 'cleave.js/react';
import { criarContato, editarContato } from '../../services/contatosService';
import IconInputWrapper from '../../util/IconInputWrapper';
import { useSnackbar } from '../../util/SnackbarProvider';

function ContatoPopup({ contact, onClose, isNew }) {
  const [editedContact, setEditedContact] = useState({
    nome: '',
    email: '',
    telefone: '',
  });
  const [editedFields, setEditedFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');  
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (contact && !isNew) {
      setEditedContact(contact);
      setEditedFields({});
    } else if (isNew) {
      setEditedContact({ nome: '', email: '', telefone: '' });
      setEditedFields({});
    }
  }, [contact, isNew]);

  const handleChange = (field, value) => {
    setEditedContact((prev) => ({ ...prev, [field]: value }));
    setEditedFields((prev) => ({
      ...prev,
      [field]: value !== contact?.[field],
    }));
  };

  const hasChanges = Object.values(editedFields).some(Boolean);

  const handleSave = async () => {
    setLoading(true);
    setError('');

    var errorMsg = '';

    if (!editedContact.nome.trim()) {
      errorMsg = 'O nome é obrigatório.';
    }

    if (errorMsg) {
      setError(errorMsg);      
      setLoading(false);   
      return;
    }

    try {
      if (isNew) {
        await criarContato(editedContact.nome, editedContact.email, editedContact.telefone);        
        showSnackbar('Contato criado com sucesso!');
      } else {
        await editarContato(contact.id, editedContact.nome, editedContact.email, editedContact.telefone, editedContact.ativo);
        showSnackbar('Contato editado com sucesso!');
      }
      onClose(true);
    } catch (err) {
      setError(err || 'Erro ao salvar contato. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center relative mx-4">
        <button
          className="absolute top-2 right-2 text-[#264f57] hover:text-[#3e8682] text-2xl font-bold"
          onClick={() => { onClose(false) }}
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-[#55c6b1] flex items-center justify-center mb-4">
            <MdPerson size={48} className="text-white" />
          </div>

          <input
            type="text"
            placeholder="Nome"
            value={editedContact.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            className={`text-center font-semibold text-[#264f57] mb-4 w-full p-2 rounded focus:outline-none transition-shadow duration-200 ${
              editedFields.nome ? "shadow-[inset_0_0_0_2px_#264f57]" : "shadow-none"
            }`}
          />

          <div className="w-full mb-2">
            <IconInputWrapper Icon={MdPhone}>
              <Cleave
                options={{
                  delimiters: ['(', ') ', '-', ''],
                  blocks: [0, 2, 5, 4],
                  numericOnly: true,
                }}
                value={editedContact.telefone}
                onChange={(e) => handleChange("telefone", e.target.value)}
                name="telefone"
                className={`text-left text-[#264f57] w-full p-2 rounded focus:outline-none transition-shadow duration-200 ${
                  editedFields.telefone ? "shadow-[inset_0_0_0_2px_#264f57]" : "shadow-none"
                }`}
                placeholder="Telefone"
              />
            </IconInputWrapper>
          </div>

          <div className="w-full">
            <IconInputWrapper Icon={MdEmail}>
              <input
                type="email"
                placeholder="Email"
                value={editedContact.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`text-left text-[#264f57] w-full p-2 rounded focus:outline-none transition-shadow duration-200 ${
                  editedFields.email ? "shadow-[inset_0_0_0_2px_#264f57]" : "shadow-none"
                }`}
              />
            </IconInputWrapper>
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <div className="mt-4 ml-auto h-[42px]">
            <button
              className={`bg-[#264f57] hover:bg-[#3e8682] text-white px-4 py-2 rounded transition-opacity duration-200 ${
                hasChanges && !loading ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
              onClick={handleSave}
              disabled={!hasChanges || loading}
            >
              {loading ? "Carregando..." : isNew ? "Criar" : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContatoPopup;
