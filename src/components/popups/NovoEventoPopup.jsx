import React, { useState, useEffect, useMemo } from "react";
import { MdEvent, MdLocationOn, MdContacts } from "react-icons/md";
import { todosLocais } from "../../services/locaisService";
import { todosContatos } from "../../services/contatosService";
import { criarEvento } from "../../services/eventosService";
import { useSnackbar } from "../../util/SnackbarProvider";
import Select from "react-select";
import { PropagateLoader } from "react-spinners";
import { useNavigate } from "react-router-dom"; 

function NovoEventoPopup({ onClose }) {

  const navigate = useNavigate();

  const { showSnackbar } = useSnackbar();

  const [contactsOptions, setContactsOptions] = useState([]);
  const [localOptions, setLocalOptions] = useState([]);

  const [selectedLocal, setSelectedLocal] = useState(null);
  const [selectedContatos, setSelectedContatos] = useState([]);

  const [evento, setEvento] = useState({
    nome: "",
    descricao: "",
    dataInicio: "",
  });

  const [loadingOptions, setLoadingOptions] = useState(true); // loading for fetching locais & contatos
  const [loading, setLoading] = useState(false); // loading for saving event
  const [error, setError] = useState("");

  const isValidInfos = useMemo(() => {
    return (
      evento.nome.trim() !== "" &&
      evento.descricao.trim() !== "" &&
      evento.dataInicio !== ""
    );
  }, [evento]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingOptions(true);
      try {
        const locais = await todosLocais();
        const contatos = await todosContatos();
        setLocalOptions(
          locais.map((local) => ({ value: local.id, label: local.nome }))
        );
        setContactsOptions(
          contatos.map((contato) => ({ value: contato.id, label: contato.nome }))
        );
        setError("");
      } catch (err) {
        setError("Erro ao carregar locais ou contatos.");
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchData();
    setEvento({ nome: "", descricao: "", dataInicio: "" });
    setSelectedLocal(null);
    setSelectedContatos([]);
    setError("");
  }, []);

  const handleChange = (field, value) => {
    setEvento((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      const eventoPayload = {
        nome: evento.nome,
        descricao: evento.descricao,
        dataInicio: evento.dataInicio,
        dataFim: evento.dataFinal,
        localId: selectedLocal?.value ?? null,
        contatosParticipantes: selectedContatos.map((c) => c.value),
      };

      await criarEvento(eventoPayload);
      showSnackbar("Evento criado com sucesso!");
      onClose(true);
    } catch (err) {
      setError(err.message || "Erro ao salvar evento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingOptions) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center relative mx-4 flex flex-col items-center justify-center overflow-y-auto max-h-[90vh]">
          <PropagateLoader color="#55c6b1" className="p-10" size={15} />
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <button
            className="mt-4 bg-[#264f57] hover:bg-[#3e8682] text-white px-4 py-2 rounded"
            onClick={() => onClose(false)}
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl sm:max-w-2xl md:max-w-3xl text-center relative mx-2 sm:mx-4 overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-2 right-2 text-[#264f57] hover:text-[#3e8682] text-3xl font-bold"
          onClick={() => onClose(false)}
          aria-label="Fechar popup"
        >
          &times;
        </button>
        <div className="flex flex-col items-center mt-5">
          <input
            type="text"
            placeholder="Nome do evento *"
            value={evento.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            className="text-center font-semibold text-[#264f57] mb-4 w-full p-4 rounded-lg border-2 border-[#55c6b1] focus:outline-none transition-all duration-200 shadow-md text-base sm:text-lg"
            autoComplete="off"
            spellCheck={false}
          />

          <textarea
            placeholder="Descrição do evento *"
            value={evento.descricao}
            onChange={(e) => handleChange("descricao", e.target.value)}
            className="text-left text-[#264f57] mb-4 w-full p-4 rounded-lg border-2 border-[#55c6b1] focus:outline-none transition-all duration-200 shadow-md text-base sm:text-lg resize-none"
            rows={4}
            spellCheck={false}
          />

          <div className="flex flex-col sm:flex-row gap-4 w-full mb-4">
            <div className="flex-1">
              <label className="text-[#264f57] font-medium mb-2 block flex items-center">
                <MdEvent size={20} className="mr-2 text-[#264f57]" />
                Data de Início<span className="text-500 ml-1"> *</span>
              </label>
              <input
                type="datetime-local"
                value={evento.dataInicio}
                onChange={(e) => handleChange("dataInicio", e.target.value)}
                className="w-full p-3 rounded-lg border-2 border-[#55c6b1] text-[#264f57] focus:outline-none transition-all duration-200 shadow-md text-sm sm:text-base"
              />
            </div>

            <div className="flex-1">
              <label className="text-[#264f57] font-medium mb-2 block flex items-center">
                <MdEvent size={20} className="mr-2 text-[#264f57]" />
                Data de Fim
              </label>
              <input
                type="datetime-local"
                value={evento.dataFinal}
                onChange={(e) => handleChange("dataFinal", e.target.value)}
                className="w-full p-3 rounded-lg border-2 border-[#55c6b1] text-[#264f57] focus:outline-none transition-all duration-200 shadow-md text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="w-full mb-4">
            <label className="text-[#264f57] font-medium mb-2 block flex items-center">
              <MdLocationOn size={20} className="mr-2 text-[#264f57]" />
              Local
            </label>
            <Select
              options={localOptions}
              value={selectedLocal}
              onChange={setSelectedLocal}
              placeholder="Selecione o local"
              className="shadow-md"
              menuPlacement="top"
              noOptionsMessage={() => (
                <div className="text-center text-sm p-2">
                  Você não tem locais cadastrados.
                  <br />
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); 
                      navigate("/locais");
                    }}
                    className="mt-2 text-[#55c6b1] underline hover:text-[#3e8682]"
                  >
                    Cadastrar agora
                  </button>
                </div>
              )}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#55c6b1",
                  padding: 10,
                  borderWidth: 2,
                  borderRadius: 8,
                  boxShadow: "none",
                  "&:hover": { borderColor: "#3e8682" },
                  minHeight: 42,
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected
                    ? "#55c6b1"
                    : isFocused
                    ? "#e6f7f4"
                    : "white",
                  color: "black",
                  cursor: "pointer",
                }),
              }}
            />
          </div>

         <div className="w-full mb-4">
          <label className="text-[#264f57] font-medium mb-2 block flex items-center">
            <MdContacts size={20} className="mr-2 text-[#264f57]" />
            Contatos para convidar
          </label>
          <Select
            isMulti
            options={contactsOptions}
            value={selectedContatos}
            onChange={setSelectedContatos}
            placeholder="Selecione os contatos"
            menuPlacement="top"
            className="shadow-md"
            noOptionsMessage={() => (
              <div className="text-center text-sm p-2">
                Você não tem contatos cadastrados.
                <br />
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // impede o fechamento do menu
                    navigate("/contatos");
                  }}
                  className="mt-2 text-[#55c6b1] underline hover:text-[#3e8682]"
                >
                  Cadastrar agora
                </button>
              </div>
            )}
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#55c6b1",
                padding: 10,
                borderWidth: 2,
                borderRadius: 8,
                boxShadow: "none",
                "&:hover": { borderColor: "#3e8682" },
                flexWrap: "wrap",
                minHeight: 42,
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: "#55c6b1",
                color: "white",
                margin: "2px",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: "white",
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: "white",
                ":hover": {
                  backgroundColor: "#3e8682",
                  color: "white",
                },
              }),
              valueContainer: (base) => ({
                ...base,
                flexWrap: "wrap",
                overflow: "visible",
              }),
              option: (base, { isFocused, isSelected }) => ({
                ...base,
                backgroundColor: isSelected
                  ? "#55c6b1"
                  : isFocused
                  ? "#e6f7f4"
                  : "white",
                color: "black",
                cursor: "pointer",
              }),
            }}
          />
        </div>


          {error && (
            <div className="text-red-500 text-sm mt-2 max-w-full break-words">
              {error}
            </div>
          )}

          <div className="mt-2 ml-auto h-[42px] w-full sm:w-auto flex justify-center sm:justify-end">
            <button
              className={`bg-[#264f57] hover:bg-[#3e8682] text-white px-4 py-2 rounded transition-opacity duration-200 ${
                isValidInfos && !loading
                  ? "opacity-100 visible cursor-pointer"
                  : "opacity-50 invisible cursor-not-allowed"
              }`}
              onClick={handleSave}
              disabled={!isValidInfos || loading}
              type="button"
            >
              {loading ? "Carregando..." : "Criar Evento"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NovoEventoPopup;
