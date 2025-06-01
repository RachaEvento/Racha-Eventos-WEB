import React, { useState, useEffect, useCallback } from 'react';
import { listarParticipantes } from '../services/participanteService'; // Certifique-se que o caminho está correto
import { convidarParticipante, confirmarParticipacao, recusarParticipacao, convidarTodosParticipantes } from '../services/conviteService';
import { useSnackbar } from '../util/SnackbarProvider';
// Importando os ícones do react-md-icons
import { MdMail, MdAttachMoney, MdSearch, MdCheckCircle, MdSend, MdContactMail } from 'react-icons/md';
import { IoMdCloseCircle } from "react-icons/io";

// Importando o react-confirm-alert
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Estilo padrão do popup

// --- ADDED IMPORT FOR CLIPLOADER ---
import { ClipLoader } from 'react-spinners';
import ConvidarContatoPopup from './popups/ConvidarContatoPopup';
import PagamentoParticipantePopup from './popups/PagamentoParticipantePopup';

const EventoParticipantes = ({ evento }) => {
  const { showSnackbar } = useSnackbar();
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');  
  const [showPopup, setShowPopup] = useState(false);
  const [showPagamentoParticipantePopup, setShowPagamentoParticipantePopup] = useState(false);
  const [selectedParticipante, setSelectedParticipante] = useState(null);

  const fetchParticipantes = useCallback(async () => {
    if (!evento.id) {
      setLoading(false);
      setParticipantes([]);
      setError("ID do evento não fornecido.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await listarParticipantes(evento.id);
      setParticipantes(data);
    } catch (err) {
      console.error("Erro ao buscar participantes:", err);
      setError("Não foi possível carregar os participantes. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }, [evento.id]);

  useEffect(() => {
    fetchParticipantes();
  }, [fetchParticipantes]);

  const handleVerPagamento = (participante) => {
    setSelectedParticipante(participante);
    setShowPagamentoParticipantePopup(true);
  };

  const handleConvidar = (participante) => {
    const linkConvite = `${window.location.protocol}//${window.location.host}/convite/${participante.id}`;
    console.log(participante);
    if (participante.email?.trim() !== '') {
      confirmAlert({
        message: (
          <>
            <p>
              Você está prestes a enviar um convite para:
            </p>
            <strong>{participante.nome}</strong> (<em>{participante.email}</em>)
            <p>
              Se preferir, copie o link e envie manualmente ao participante.
            </p>
          </>
        ),
        buttons: [
          {
            label: 'Enviar Convite',
            onClick: async () => {
              try {
                setLoading(true);
                await convidarParticipante(evento.id, participante.id);
                confirmAlert({
                  title: 'Convite Enviado!',
                  message: `O convite foi enviado com sucesso para ${participante.nome} (${participante.email}).`,
                  buttons: [{ label: 'Ok' }]
                });
                setParticipantes(prev => prev.map(p =>
                  p.id === participante.id ? { ...p, status: 1 } : p
                ));
                setLoading(false);
              } catch (inviteErr) {
                setLoading(false);
                confirmAlert({
                  title: 'Erro no Envio',
                  message: `Não foi possível enviar o convite para ${participante.nome}. Detalhes: ${inviteErr.message || 'Erro desconhecido'}`,
                  buttons: [{ label: 'Ok' }]
                });
              }
            }
          },
          {
            label: 'Link do Convite',
            onClick: () => {
              navigator.clipboard.writeText(linkConvite);
              showSnackbar('Link copiado para área de transferência!');
            }
          },
          {
            label: 'Cancelar'
          }
        ]
      });
    } else {
      confirmAlert({
        message: (
          <>
            <p>
              O participante <strong>{participante.nome}</strong> não possui um e-mail cadastrado.
            </p>
            <p>
              Se preferir, copie o link e envie manualmente ao participante.
            </p>
          </>
        ),
        buttons: [
          {
            label: 'Link do Convite',
            onClick: () => {
              navigator.clipboard.writeText(linkConvite);
              showSnackbar('Link copiado para área de transferência!');
            }
          },
          {
            label: 'Fechar'
          }
        ]
      });
    }
  };

  const handleConfirmarParticipante = async (participante) => {
    try {
      setLoading(true);
      await confirmarParticipacao(participante.id);
      showSnackbar(`Participação de ${participante.nome} confirmada!`);
      setParticipantes(prev => prev.map(p =>
        p.id === participante.id ? { ...p, status: 2 } : p
      ));
      setLoading(false);
    } catch (confirmErr) {
      setLoading(false);
      console.error("Erro ao confirmar participação:", confirmErr);
      confirmAlert({
        message: (`Erro ao confirmar participação de ${participante.nome}. Detalhes: ${confirmErr.message || 'Erro desconhecido'}`),
        buttons: [{ label: 'Fechar' }]
      });
    }
  };

  const handleRecusarParticipante = async (participante) => {
    try {
      setLoading(true);
      await recusarParticipacao(participante.id);
      showSnackbar(`Participação de ${participante.nome} recusada.`);
      setParticipantes(prev => prev.map(p =>
        p.id === participante.id ? { ...p, status: 0 } : p
      ));
      setLoading(false);
    } catch (refuseErr) {
      setLoading(false);
      console.error("Erro ao recusar participação:", refuseErr);
      confirmAlert({
        message: (`Erro ao recusar participação de ${participante.nome}. Detalhes: ${refuseErr.message || 'Erro desconhecido'}`),
        buttons: [{ label: 'Fechar' }]
      });
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0: return 'Recusado';
      case 1: return 'Pendente';
      case 2: return 'Confirmado';
      default: return 'Desconhecido';
    }
  };

  const convidarParticipantesPendentes = () => {
      confirmAlert({
        message: (
          <>
            <p>
              Você está prestes a enviar um convite para todos os participantes pendentes.
            </p>
          </>
        ),
        buttons: [
          {
            label: 'Enviar',
            onClick: async () => {
              try {
                setLoading(true);
                await convidarTodosParticipantes(evento.id);
                showSnackbar('Convites Enviados!');
                setLoading(false);
              } catch (inviteErr) {
                setLoading(false);
                confirmAlert({
                  message: `Não foi possível enviar os convites. Detalhes: ${inviteErr.message || 'Erro desconhecido'}`,
                  buttons: [{ label: 'Ok' }]
                });
              }
            }
          },
          {
            label: 'Cancelar'
          }
        ]
      });
  };

  const openPopupAdicionarContato = () => {
    setShowPopup(true);
  }

  const closePopupAdicionarContato = (refresh = false) => {
    setShowPopup(false);
    if (refresh) {
      fetchParticipantes();
    }
  };

  const closePagamentoParticipantePopup = (refresh = false) => {
    setShowPagamentoParticipantePopup(false);
    if (refresh) {
      fetchParticipantes();
    }
  };

  

  const participantesFiltrados = participantes.filter(participante => {
    const termoBusca = filtro.toLowerCase();
    return (
      participante.nome.toLowerCase().includes(termoBusca) ||
      (participante.email && participante.email.toLowerCase().includes(termoBusca)) ||
      (participante.telefone && participante.telefone.toLowerCase().includes(termoBusca))
    );
  });

  // --- MODIFIED LOADING BLOCK ---
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center bg-white rounded-lg shadow-md min-h-[200px]">
        <ClipLoader
          color={"#55C6B1"} // Color matching your table header
          loading={loading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-700 bg-red-100 border border-red-300 rounded-lg shadow-md">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {evento.status === 0 && (
        <div className="flex justify-end gap-5">
          <button
            onClick={() => convidarParticipantesPendentes()}
            className="flex gap-2 text-sm p-2 rounded-md bg-[#55C6B1] text-white hover:text-[#55C6B1] hover:bg-[#c9fff4] transition-colors duration-150"
          >
            <MdSend size={20} />
            Enviar Convites Pendentes
          </button>
          <button
            onClick={() => openPopupAdicionarContato()}
            className="flex gap-2 text-sm p-2 rounded-md bg-[#264F57] text-white hover:text-[#55C6B1] hover:bg-[#c9fff4] transition-colors duration-150"
          >
            <MdContactMail size={20} />
            Convidar Contatos
          </button>
        </div>
      )}

      <div className="py-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdSearch className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            placeholder="Filtrar por nome, email ou telefone..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#55C6B1] focus:border-[#55C6B1] sm:text-sm"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
      </div>

      {participantes.length > 0 && participantesFiltrados.length === 0 && filtro !== '' && (
        <div className="p-6 text-center text-[#6B7280] bg-white">
          Nenhum participante encontrado com o termo "{filtro}".
        </div>
      )}
      
      {participantes.length === 0 && !loading && !error && (
        <div className="p-6 text-center text-[#6B7280] bg-white rounded-lg shadow-md">
          Nenhum participante encontrado para este evento.
        </div>
      )}

      {participantesFiltrados.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#55C6B1]">
              <tr className="hidden md:table-row">
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-50 uppercase tracking-wider rounded-l-lg">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-50 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-50 uppercase tracking-wider">
                  Telefone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-50 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-50 uppercase tracking-wider rounded-r-lg">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 md:divide-none">
              {participantesFiltrados.map((participante) => (
                <tr key={participante.id} className="block md:table-row mb-4 md:mb-0 border md:border-0 border-gray-200 rounded-lg md:rounded-none shadow-lg md:shadow-none">
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap block md:table-cell">
                    <div className="flex items-center justify-between md:block">
                      <span className="text-sm text-[#264F57] font-medium">{participante.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap block md:table-cell">
                    <div className="flex items-center justify-between md:block">
                      <span className="text-sm text-[#6B7280]">{participante.email || '-'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap block md:table-cell">
                    <div className="flex items-center justify-between md:block">
                      <span className="text-sm text-[#6B7280]">{participante.telefone || '-'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap block md:table-cell">
                    <div className="flex items-center justify-between md:block">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${participante.status === 2 ? 'bg-green-100 text-green-800' :
                          participante.status === 1 ? 'bg-yellow-100 text-yellow-800' :
                            participante.status === 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                        {getStatusText(participante.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap block md:table-cell">
                    <div className="flex flex-row items-start justify-around md:justify-start sm:items-center mt-1 md:mt-0">     
                      {(evento.status === 1 || evento.status === 3) && (
                        <button
                          onClick={() => handleVerPagamento(participante)}
                          title="Ver Pagamento"
                          className="p-2 rounded-md text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 transition-colors duration-150"
                        >
                          <MdAttachMoney size={20} />
                        </button>
                      )}
                      {evento.status === 0 && (
                        <>
                          <button
                            onClick={() => handleConvidar(participante)}
                            title="Convidar"
                            className="p-2 rounded-md text-[#55C6B1] hover:bg-[#c9fff4] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#55C6B1] transition-colors duration-150"
                          >
                            <MdMail size={20} />
                          </button>

                          {(participante.status === 1 || participante.status === 0) && (
                            <button
                              onClick={() => handleConfirmarParticipante(participante)}
                              title="Confirmar Participante"
                              className="p-2 rounded-md text-[#00ef33] hover:bg-[#c4ffd1] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#00ef33] transition-colors duration-150"
                            >
                              <MdCheckCircle size={20} />
                            </button>
                          )}

                          {(participante.status === 1 || participante.status === 2) && (
                            <button
                              onClick={() => handleRecusarParticipante(participante)}
                              title="Recusar Participante"
                              className="p-2 rounded-md text-[#d30038] hover:bg-[#ffc1d2] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#d30038] transition-colors duration-150"
                            >
                              <IoMdCloseCircle size={20} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPopup && (
        <ConvidarContatoPopup
          evento={evento}
          onClose={closePopupAdicionarContato}
        />
      )}

      {showPagamentoParticipantePopup && (
        <PagamentoParticipantePopup
          participante={selectedParticipante}
          onClose={closePagamentoParticipantePopup}
        />
      )}
      
    </div>
  );
};

export default EventoParticipantes;
