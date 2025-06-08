import React, { useEffect, useState } from 'react';
import { listarParticipantes } from '../../services/participanteService';
import { adicionarParticipantes } from '../../services/listaCustoService';
import { useSnackbar } from '../../util/SnackbarProvider';

const AdicionarParticipanteListaCustoPopup = ({
  listaCustoId,
  eventoId,
  onClose
}) => {
  const [participantes, setParticipantes] = useState([]);
  const [participanteSelecionado, setParticipanteSelecionado] = useState('');
  const [carregando, setCarregando] = useState(false);

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const carregarParticipantes = async () => {
      try {
        setCarregando(true);
        const lista = await listarParticipantes(eventoId);
        setParticipantes(lista);
      } catch (e) {
        showSnackbar(e.message || 'Erro ao carregar participantes');
        onClose(false); // Fecha popup em caso de erro
      } finally {
        setCarregando(false);
      }
    };

    carregarParticipantes();
  }, [eventoId, onClose, showSnackbar]);

  const handleAdicionarParticipante = async () => {
    if (!participanteSelecionado) {
      showSnackbar('Selecione um participante.');
      return;
    }

    try {
      setCarregando(true);
      var listaParticipantesRemover = {
        participantesIds: [participanteSelecionado]
      }
      await adicionarParticipantes(listaCustoId, listaParticipantesRemover);
      showSnackbar('Participante adicionado com sucesso!');
      onClose(true);
    } catch (e) {
      showSnackbar(e.message || 'Erro ao adicionar participante');
    } finally {
      setCarregando(false);
    }
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

        <h2 className="text-xl font-semibold mb-4">Adicionar Participante</h2>

        {carregando && <p>Carregando...</p>}

        {!carregando && (
          <>
            <select
              className="border border-gray-300 rounded w-full p-2 mb-4"
              value={participanteSelecionado}
              onChange={(e) => setParticipanteSelecionado(e.target.value)}
            >
              <option value="">Selecione um participante</option>
              {participantes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>

            <button
              className="bg-[#264f57] hover:bg-[#3e8682] text-white px-4 py-2 rounded"
              onClick={handleAdicionarParticipante}
              disabled={carregando}
            >
              Adicionar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdicionarParticipanteListaCustoPopup;
