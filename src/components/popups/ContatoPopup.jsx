import React, { useState, useEffect, useRef } from "react";
import { MdPerson, MdEmail, MdPhone } from "react-icons/md";
import Cleave from 'cleave.js/react';
import { criarContato, editarContato } from '../../services/contatosService';
import IconInputWrapper from '../../util/IconInputWrapper';
import { useSnackbar } from '../../util/SnackbarProvider';
import { isValidEmail } from '../../util/validadores';

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const base64ToBlob = (base64) => {
  const [metadata, data] = base64.split(',');
  const mime = metadata.match(/:(.*?);/)[1];
  const binary = atob(data);
  let array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
};

function ContatoPopup({ contact, onClose, isNew }) {
  const [editedContact, setEditedContact] = useState({
    nome: '',
    email: '',
    telefone: '',
    fotoBase64: '', 
  });
  const [editedFields, setEditedFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showSnackbar } = useSnackbar();
  const fileInputRef = useRef(null); 
  
  useEffect(() => {
    if (contact && !isNew) {
      let foto = contact.fotoBase64 || '';
      if (foto && !foto.startsWith('data:image')) {
        foto = `data:image/jpeg;base64,${foto}`;
      }
      setEditedContact({
        ...contact,
        fotoBase64: foto
      });
    } else {
      setEditedContact({ nome: '', email: '', telefone: '', fotoBase64: '' });
    }
    setEditedFields({});
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

    if (!editedContact.nome.trim()) {
      setError('O nome é obrigatório.');
      setLoading(false);
      return;
    }
    if (editedContact.email && !isValidEmail(editedContact.email)) {
      setError('O e-mail é inválido.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('Nome', editedContact.nome);
      formData.append('Email', editedContact.email || '');
      formData.append('Telefone', editedContact.telefone || '');
      formData.append('Ativo', 'true');

      if (editedContact.fotoBase64) {
        const fotoBlob = base64ToBlob(editedContact.fotoBase64);
        formData.append('Foto', fotoBlob, 'foto.jpg');
      }

      if (isNew) {
        await criarContato(formData);
        showSnackbar('Contato criado com sucesso!');
      } else {
        formData.append('Id', contact.id);
        await editarContato(contact.id, formData);
        showSnackbar('Contato editado com sucesso!');
      }

      onClose(true);
    } catch (err) {
      setError(err.message || 'Erro ao salvar contato. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await toBase64(file);
    handleChange("fotoBase64", base64);
    e.target.value = ''; 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center relative mx-4">
        <button
          className="absolute top-2 right-2 text-[#264f57] hover:text-[#3e8682] text-2xl font-bold"
          onClick={() => onClose(false)}
        >
          &times;
        </button>

        <div className="flex flex-col items-center">
          <div
            className="w-24 h-24 rounded-full bg-[#55c6b1] flex items-center justify-center mb-4 overflow-hidden cursor-pointer"
            onClick={handleImageClick}
          >
            {editedContact.fotoBase64 ? (
              <img
                src={editedContact.fotoBase64}
                alt="Foto do contato"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <MdPerson size={48} className="text-white" />
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

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
  