import React, { useState, useEffect } from "react";
import { MdPlace, MdOutlinePlace, MdDescription, MdMap, MdLocationCity } from "react-icons/md";
import { criarLocal, editarLocal } from '../../services/locaisService';
import IconInputWrapper from '../../util/IconInputWrapper';
import { useSnackbar } from '../../util/SnackbarProvider';
import { IoMdGlobe } from "react-icons/io";

function LocalPopup({ Local, onClose, isNew }) {
  const [editedLocal, setEditedLocal] = useState({
    nome: '',
    endereco: '',
    descricaoLocal: '',
    bairro: '',
    cidade: '',
    estado: '',
  });
  const [editedFields, setEditedFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');  
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (Local && !isNew) {
      setEditedLocal(Local);
      setEditedFields({});
    } else if (isNew) {
      setEditedLocal({ nome: '', endereco: '', descricaoLocal: '', bairro: '', cidade: '', estado: '', });
      setEditedFields({});
    }
  }, [Local, isNew]);

  const handleChange = (field, value) => {
    setEditedLocal((prev) => ({ ...prev, [field]: value }));
    setEditedFields((prev) => ({
      ...prev,
      [field]: value !== Local?.[field],
    }));
  };

  const hasChanges = Object.values(editedFields).some(Boolean);

  const handleSave = async () => {
    setLoading(true);
    setError('');

    var errorMsg = '';

    if (!editedLocal.nome.trim()) {
      errorMsg = 'O nome é obrigatório.';
    }

    if (errorMsg) {
      setError(errorMsg);      
      setLoading(false);   
      return;
    }

    try {
      if (isNew) {
        await criarLocal(editedLocal.nome, editedLocal.endereco, editedLocal.descricaoLocal, editedLocal.bairro, editedLocal.cidade, editedLocal.estado);
        showSnackbar('Local criado com sucesso!');
      } else {
        await editarLocal(Local.id, editedLocal.nome, editedLocal.endereco, editedLocal.descricaoLocal, editedLocal.bairro, editedLocal.cidade, editedLocal.estado);
        showSnackbar('Local editado com sucesso!');
      }
      onClose(true);
    } catch (err) {
      setError(err.message || 'Erro ao salvar contato. Tente novamente.');
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
            <MdPlace size={48} className="text-white" />
          </div>

          <input
            type="text"
            placeholder="Nome"
            value={editedLocal.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            className={`text-center font-semibold text-[#264f57] mb-4 w-full p-2 rounded focus:outline-none transition-shadow duration-200 ${
              editedFields.nome ? "shadow-[inset_0_0_0_2px_#264f57]" : "shadow-none"
            }`}
          />

          <div className="w-full mb-2">
            <IconInputWrapper Icon={MdOutlinePlace}>
              <input
                type="text"
                placeholder="Endereço"
                value={editedLocal.endereco}
                onChange={(e) => handleChange("endereco", e.target.value)}
                className={`text-left text-[#264f57] w-full p-2 rounded focus:outline-none transition-shadow duration-200 ${
                  editedFields.endereco ? "shadow-[inset_0_0_0_2px_#264f57]" : "shadow-none"
                }`}
              />
            </IconInputWrapper>
          </div>

          <div className="w-full mb-2">
            <IconInputWrapper Icon={MdDescription}>
              <input
                type="text"
                placeholder="Descrição"
                value={editedLocal.descricaoLocal}
                onChange={(e) => handleChange("descricaoLocal", e.target.value)}
                className={`text-left text-[#264f57] w-full p-2 rounded focus:outline-none transition-shadow duration-200 ${
                  editedFields.descricaoLocal ? "shadow-[inset_0_0_0_2px_#264f57]" : "shadow-none"
                }`}
              />
            </IconInputWrapper>
          </div>

          <div className="w-full mb-2">
            <IconInputWrapper Icon={MdMap}>
              <input
                type="text"
                placeholder="Bairro"
                value={editedLocal.bairro}
                onChange={(e) => handleChange("bairro", e.target.value)}
                className={`text-left text-[#264f57] w-full p-2 rounded focus:outline-none transition-shadow duration-200 ${
                  editedFields.bairro ? "shadow-[inset_0_0_0_2px_#264f57]" : "shadow-none"
                }`}
              />
            </IconInputWrapper>
          </div>

          <div className="w-full mb-2">
            <IconInputWrapper Icon={MdLocationCity}>
              <input
                type="text"
                placeholder="Cidade"
                value={editedLocal.cidade}
                onChange={(e) => handleChange("cidade", e.target.value)}
                className={`text-left text-[#264f57] w-full p-2 rounded focus:outline-none transition-shadow duration-200 ${
                  editedFields.cidade ? "shadow-[inset_0_0_0_2px_#264f57]" : "shadow-none"
                }`}
              />
            </IconInputWrapper>
          </div>

          <div className="w-full mb-2">
            <IconInputWrapper Icon={IoMdGlobe}>
              <input
                type="text"
                placeholder="Estado"
                value={editedLocal.estado}
                onChange={(e) => handleChange("estado", e.target.value)}
                className={`text-left text-[#264f57] w-full p-2 rounded focus:outline-none transition-shadow duration-200 ${
                  editedFields.estado ? "shadow-[inset_0_0_0_2px_#264f57]" : "shadow-none"
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

export default LocalPopup;
