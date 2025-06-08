import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { buscarConvite, confirmarParticipacao, recusarParticipacao } from '../services/conviteService';
import { ClipLoader } from 'react-spinners';
import { format, isSameDay } from 'date-fns';
import ptBR from "date-fns/locale/pt-BR";
import { MdPlace } from 'react-icons/md';

const statusEvento = {
  0: 'Aberto',
  1: 'Fechado',
  2: 'Cancelado',
  3: 'Finalizado',
};

const Convite = () => {
  const { id } = useParams();
  const [convite, setConvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchConvite = async () => {
      try {
        setLoading(true);
        const data = await buscarConvite(id);
        setConvite(data);
      } catch (error) {
        console.error('Erro ao buscar convite:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConvite();
  }, [id]);

  const handleConfirm = async () => {
    try {
      setProcessing(true);
      await confirmarParticipacao(id);
      const data = await buscarConvite(id);
      setConvite(data);
    } catch (error) {
      console.error('Erro ao confirmar participação:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleRecusar = async () => {
    try {
      setProcessing(true);
      await recusarParticipacao(id);
      const data = await buscarConvite(id);
      setConvite(data);
    } catch (error) {
      console.error('Erro ao recusar participação:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-radial">
        <ClipLoader color="#fff" size={60} />
      </div>
    );
  }

  if (!convite) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-radial">
        <p className="text-2xl text-white">Convite não encontrado.</p>
      </div>
    );
  }

  const { contatoParticipante, evento } = convite;

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
        locale: ptBR,
      });
    } catch {
      return dateString;
    }
  };
  
  const formatSimpleDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      });
    } catch {
      return dateString;
    }
  };
  
  const isFullDay = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
  
    const startIsStartOfDay =
      startDate.getHours() === 0 &&
      startDate.getMinutes() === 0;
  
    const endIsEndOfDay =
      endDate.getHours() === 23 &&
      endDate.getMinutes() === 59;
  
    return isSameDay(startDate, endDate) && startIsStartOfDay && endIsEndOfDay;
  };

  const eventoAberto = evento.status === 0;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(circle,_rgba(85,198,177,1)_0%,_rgba(38,79,87,1)_100%)] p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border-4 border-white">
        
        {/* Header */}
        <div className="p-4 flex justify-center">
          <img src="/logo-bar.png" alt="Logo" className="h-20 object-contain" />
        </div>

        <div className="p-6">
          <h1 className="text-2xl text-center font-bold text-[#264F57]">
            Olá <span className='text-[#55C6B1]'>{contatoParticipante.nome}</span>, você está convidado para:
          </h1>
          <h2 className="text-3xl text-center text-[#55C6B1] font-semibold mt-2">
            {evento.nome}
          </h2>
          <h4 className="text-xs text-center text-gray-500 mt-1">
            {isFullDay(evento.dataInicio, evento.dataFinal) ? (
            <>Em <strong>{formatSimpleDate(evento.dataInicio)}</strong></>
            ) : (
            <>
                De <strong>{formatDate(evento.dataInicio)}</strong> até{" "}
                <strong>{formatDate(evento.dataFinal)}</strong>
            </>
            )}
          </h4>

          <div className="mt-6 space-y-4">
            {/* Evento */}
            <div className="border border-[#55C6B1] rounded-xl p-4 bg-[#f9f9f9]">
              <h3 className="text-xl font-semibold text-[#55C6B1] mb-2">
                Detalhes do Evento
              </h3>
              <p>{evento.descricao}</p>
            </div>        
            
            {/* Local */}
            {evento.localNome && (
              <div className="bg-[#55c6b1] text-white rounded-lg p-4 flex flex-col-3 w-full">
                <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-1">
                        {evento.localNome}
                        {evento.localDescricaoLocal && (
                            <p className="text-sm">{evento.localDescricaoLocal}</p>
                        )}                  
                    </h2>                
                    <div className="flex gap-1 flex-1">
                        <p className="text-sm">
                            {evento.localEndereco}, {evento.localBairro}.
                        </p>
                        <p className="text-sm">
                            {evento.localCidade}/{evento.localEstado}
                        </p>
                    </div>
                </div>
                <MdPlace size={32} className="text-white" />
              </div>
            )}

          </div>

          {/* Ações */}
          {eventoAberto ? (
           contatoParticipante.status === 1 ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button
                    onClick={handleConfirm}
                    disabled={processing}
                    className={`px-6 py-3 rounded-xl text-white font-semibold ${
                    processing ? 'bg-[#55C6B1]/50' : 'bg-[#55C6B1] hover:bg-[#48b09e]'
                    } transition`}
                >
                    {processing ? 'Processando...' : 'Confirmar Presença'}
                </button>
                <button
                    onClick={handleRecusar}
                    disabled={processing}
                    className={`px-6 py-3 rounded-xl text-white font-semibold ${
                    processing ? 'bg-[#264F57]/50' : 'bg-[#264F57] hover:bg-[#1e4047]'
                    } transition`}
                >
                    {processing ? 'Processando...' : 'Recusar Convite'}
                </button>
                </div>
            ) : (
                <div className="mt-6 text-center">
                {contatoParticipante.status === 2 ? (
                    <p className="text-lg text-[#264F57] font-semibold">
                    Você <strong>confirmou</strong> sua presença neste evento.
                    </p>
                ) : (
                    <p className="text-lg text-[#264F57] font-semibold">
                    Você <strong>recusou</strong> este convite.
                    </p>
                )}
                </div>
            )
           ) : (
            <div className="mt-6 text-center">
                <p className="text-lg text-[#264F57] font-semibold">
                Este evento está <strong>{statusEvento[evento.status]}</strong> no momento.
                </p>
            </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Convite;
