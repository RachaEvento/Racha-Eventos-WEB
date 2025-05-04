import React, { useState, useEffect } from "react";
import { MdEvent, MdLocationOn, MdDescription } from "react-icons/md";
import { requisitar } from "../../util/requisicaoApi";
import { todosLocais } from "../../services/locaisService";
import { useSnackbar } from "../../util/SnackbarProvider";

function NovoEventoPopup({ evento, onClose, isNew }) {
  const { showSnackbar } = useSnackbar();

  const [localOptions, setLocalOptions] = useState([]);
  const [selectedLocal, setSelectedLocal] = useState(null);

  const [editedEvento, setEditedEvento] = useState({
    nome: "",
    descricao: "",
    dataInicio: "",
    dataFinal: "",
    status: 1, // Pendente por padrão
  });

  const [editedFields, setEditedFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Carregar os locais
    const fetchLocais = async () => {
      try {
        const locais = await todosLocais();
        setLocalOptions(locais);
      } catch (err) {
        setError("Erro ao carregar locais");
      }
    };

    fetchLocais();

    if (evento && !isNew) {
      setEditedEvento(evento);
      setEditedFields({});
    } else {
      setEditedEvento({ nome: "", descricao: "", dataInicio: "", dataFinal: "", status: 1 });
      setEditedFields({});
    }
  }, [evento, isNew]);

  const handleChange = (field, value) => {
    setEditedEvento((prev) => ({ ...prev, [field]: value }));
    setEditedFields((prev) => ({
      ...prev,
      [field]: value !== evento?.[field],
    }));
  };

  const handleStatusChange = (status) => {
    setEditedEvento((prev) => ({ ...prev, status }));
  };

  const hasChanges = Object.values(editedFields).some(Boolean);

  const handleSave = async () => {
    setLoading(true);
    setError("");

    if (!editedEvento.nome.trim()) {
      setError("O nome do evento é obrigatório.");
      setLoading(false);
      return;
    }

    if (!editedEvento.descricao.trim()) {
      setError("A descrição do evento é obrigatória.");
      setLoading(false);
      return;
    }

    if (!editedEvento.dataInicio || !editedEvento.dataFinal) {
      setError("As datas de início e fim são obrigatórias.");
      setLoading(false);
      return;
    }

    if (!selectedLocal) {
      setError("O local do evento é obrigatório.");
      setLoading(false);
      return;
    }

    try {
      const eventoData = {
        ...editedEvento,
        localId: selectedLocal.id,
      };

      if (isNew) {
        await requisitar("/eventos", "POST", eventoData);
        showSnackbar("Evento criado com sucesso!");
      } else {
        await requisitar(`/eventos/${evento.id}`, "PUT", eventoData);
        showSnackbar("Evento atualizado com sucesso!");
      }
      onClose(true);
    } catch (err) {
      setError(err.message || "Erro ao salvar evento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg text-center relative mx-4">
        <button
          className="absolute top-2 right-2 text-[#264f57] hover:text-[#3e8682] text-3xl font-bold"
          onClick={() => onClose(false)}
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-[#55c6b1] flex items-center justify-center mb-6 shadow-lg">
            <MdEvent size={50} className="text-white" />
          </div>

          <input
            type="text"
            placeholder="Nome do evento"
            value={editedEvento.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            className="text-center font-semibold text-[#264f57] mb-4 w-full p-4 rounded-lg border-2 border-[#55c6b1] focus:outline-none transition-all duration-200 shadow-md"
          />

          <textarea
            placeholder="Descrição do evento"
            value={editedEvento.descricao}
            onChange={(e) => handleChange("descricao", e.target.value)}
            className="text-left text-[#264f57] mb-4 w-full p-4 rounded-lg border-2 border-[#55c6b1] focus:outline-none transition-all duration-200 shadow-md"
          />

          <div className="w-full mb-4">
            <label className="text-[#264f57] font-medium mb-2 block flex items-center justify-start">
              <MdEvent size={20} className="mr-2 text-[#264f57]" />
              Data de Início
            </label>
            <input
              type="datetime-local"
              value={editedEvento.dataInicio}
              onChange={(e) => handleChange("dataInicio", e.target.value)}
              className="w-full p-4 rounded-lg border-2 border-[#55c6b1] text-[#264f57] focus:outline-none transition-all duration-200 shadow-md"
            />
          </div>

          <div className="w-full mb-4">
            <label className="text-[#264f57] font-medium mb-2 block flex items-center justify-start">
              <MdEvent size={20} className="mr-2 text-[#264f57]" />
              Data de Fim
            </label>
            <input
              type="datetime-local"
              value={editedEvento.dataFinal}
              onChange={(e) => handleChange("dataFinal", e.target.value)}
              className="w-full p-4 rounded-lg border-2 border-[#55c6b1] text-[#264f57] focus:outline-none transition-all duration-200 shadow-md"
            />
          </div>

          <div className="w-full mb-4">
            <label className="text-[#264f57] font-medium mb-2 block flex items-center justify-start">
              <MdDescription size={20} className="mr-2 text-[#264f57]" />
              Status
            </label>
            <select
              value={editedEvento.status}
              onChange={(e) => handleStatusChange(Number(e.target.value))}
              className="w-full p-4 rounded-lg border-2 border-[#55c6b1] text-[#264f57] focus:outline-none transition-all duration-200 shadow-md"
            >
              <option value={1}>Pendente</option>
              <option value={0}>Finalizado</option>
            </select>
          </div>

          <div className="w-full mb-4">
            <label className="text-[#264f57] font-medium mb-2 block flex items-center justify-start">
              <MdLocationOn size={20} className="mr-2 text-[#264f57]" />
              Local
            </label>
            <select
              value={selectedLocal?.id || ""}
              onChange={(e) => setSelectedLocal(localOptions.find(local => local.id === e.target.value))}
              className="w-full p-4 rounded-lg border-2 border-[#55c6b1] text-[#264f57] focus:outline-none transition-all duration-200 shadow-md"
            >
              <option value="">Selecione o local</option>
              {localOptions.map((local) => (
                <option key={local.id} value={local.id}>
                  {local.nome}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <div className="mt-6">
            <button
              className={`bg-[#264f57] hover:bg-[#3e8682] text-white px-8 py-3 rounded-lg shadow-xl transition-opacity duration-200 ${
                hasChanges && !loading ? "opacity-100 visible" : "opacity-60"
              }`}
              onClick={handleSave}
              disabled={!hasChanges || loading}
            >
              {loading ? "Carregando..." : isNew ? "Criar Evento" : "Salvar Evento"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NovoEventoPopup;
