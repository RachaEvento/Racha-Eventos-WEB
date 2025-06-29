import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { alterarStatusEvento, buscarEvento } from "../services/eventosService";
import { useSnackbar } from "../util/SnackbarProvider";
import { MdEvent, MdPlace } from "react-icons/md";
import { format, isSameDay } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import EventoResumo from '../components/EventoResumo'
import EventoCustos from '../components/EventoCustos'
import EventoParticipantes from '../components/EventoParticipantes'
import { PropagateLoader } from "react-spinners";

const StatusEvento = { Aberto: 0, Fechado: 1, Cancelado: 2, Finalizado: 3 };

function Evento() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const { showSnackbar } = useSnackbar();
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);

  const fetchEventos = useCallback(async () => {
    setLoading(true);
    try {
      const result = await buscarEvento(id);
      setData(result);
      //console.log(result);
    } catch (error) {
      showSnackbar(error.message || "Erro ao buscar evento");
    } finally {
      setLoading(false);
    }
  }, [id, showSnackbar]);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  const getNextStatus = (status) => {
    switch (status) {
      case StatusEvento.Aberto:
        return StatusEvento.Fechado;
      case StatusEvento.Fechado:
        return StatusEvento.Finalizado;
      default:
        return null;
    }
  };
  
  const getNextStatusLabel = (status) => {
    switch (status) {
      case StatusEvento.Aberto:
        return "Fechar evento";
      case StatusEvento.Fechado:
        return "Finalizar evento";
      default:
        return null;
    }
  };

  const handleChangeStatus = async (isCancelar = false) => {
    const nextStatus = getNextStatus(data.status);
    if (nextStatus === null) return;
  
    try {
      setLoading(true);

      if (isCancelar) {
        await alterarStatusEvento(data.id, StatusEvento.Cancelado);
      }
      else {
        await alterarStatusEvento(data.id, nextStatus);
      }

      fetchEventos();
      showSnackbar("Status atualizado com sucesso!");
    } catch (error) {
      showSnackbar("Erro ao atualizar status");
      setLoading(true);
    }
  };

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

  const getStatusStyle = (status) => {
    switch (status) {
      case 0:
        return { label: "Aberto", bg: "bg-green-500", text: "text-white" };
      case 1:
        return { label: "Fechado", bg: "bg-yellow-500", text: "text-white" };
      case 2:
        return { label: "Cancelado", bg: "bg-red-500", text: "text-white" };
      case 3:
        return { label: "Finalizado", bg: "bg-blue-600", text: "text-white" };
      default:
        return { label: "Desconhecido", bg: "bg-gray-300", text: "text-black" };
    }
  };

  return (
    <div className="text-black p-4 md:p-6">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <PropagateLoader color="#264f57" size={15} />
        </div>
      ) : data ? (
      <div>
        <div className="p-4 md:p-6 rounded-lg shadow hover:shadow-md border border-[#3e8682]">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Icon and Text */}
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto flex-1">
              <div className="w-16 h-16 rounded-full bg-[#55c6b1] flex items-center justify-center">
                <MdEvent size={36} className="text-white" />
              </div>
              <div className="flex flex-col w-full">
                <div className="flex items-center gap-2">
                <h1 className="flex gap-[5px] justify-center text-xl md:text-2xl font-bold text-[#264f57]">
                  {data.nome}
                </h1>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {isFullDay(data.dataInicio, data.dataFinal) ? (
                    <>Em <strong>{formatSimpleDate(data.dataInicio)}</strong></>
                  ) : (
                    <>
                      De <strong>{formatDate(data.dataInicio)}</strong> até{" "}
                      <strong>{formatDate(data.dataFinal)}</strong>
                    </>
                  )}
                </p>
                <div className="flex flex-col md:flex-row md:justify-between mt-2 gap-2 md:gap-0">
                  <p className={`inline-flex justify-center px-4 py-1 rounded text-xs md:text-sm font-semibold
                    ${getStatusStyle(data.status).bg} 
                    ${getStatusStyle(data.status).text}`}>
                    {getStatusStyle(data.status).label}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2 md:items-center">
                    {(data.status === 1 || data.status === 0) && (
                      <button
                        onClick={() => handleChangeStatus(true)}
                        className="bg-[#c60000] text-white hover:bg-[#930000] px-4 py-1 rounded text-sm font-semibold"
                      >
                        Cancelar evento
                      </button>
                    )}
                    {getNextStatus(data.status) !== null && (
                      <button
                        onClick={handleChangeStatus}
                        className="bg-[#55c6b1] text-white hover:bg-[#3e8682] px-4 py-1 rounded text-sm font-semibold shadow"
                      >
                        {getNextStatusLabel(data.status)}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Local Info */}
            {data.localNome && (
              <div className="bg-[#55c6b1] text-white rounded-lg p-4 flex flex-col w-full md:w-64 min-w-[300px]">
                <h2 className="text-lg font-semibold mb-1 flex justify-between">                  
                  <span>{data.localNome}</span>
                  <MdPlace size={32} className="text-white" />
                </h2>
                {data.localDescricaoLocal && (
                  <p className="text-sm">{data.localDescricaoLocal}</p>
                )}
                <p className="text-sm">
                  {data.localEndereco}, {data.localBairro}
                </p>
                <p className="text-sm">
                  {data.localCidade} - {data.localEstado}
                </p>
              </div>
            )}
          </div>          
        </div>
        <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab} className="flex flex-col w-full">
          <TabList className="my-2 p-2 bg-white flex gap-4">
            <Tab className={({ selected }) =>
              `rounded px-3 py-1 text-sm/6 font-semibold ${
                selected ? "bg-[#264f57] text-white" : "hover:bg-[#e6f2f2]"
              }`
            }>
              Resumo
            </Tab>
            <Tab className={({ selected }) =>
              `rounded px-3 py-1 text-sm/6 font-semibold ${
                selected ? "bg-[#264f57] text-white" : "hover:bg-[#e6f2f2]"
              }`
            }>
              Custos
            </Tab>
            <Tab className={({ selected }) =>
              `rounded px-3 py-1 text-sm/6 font-semibold ${
                selected ? "bg-[#264f57] text-white" : "hover:bg-[#e6f2f2]"
              }`
            }>
              Participantes
            </Tab>            
          </TabList>
          <TabPanels className="p-2">
            <TabPanel><EventoResumo evento={data}/></TabPanel>
            <TabPanel><EventoCustos evento={data}/></TabPanel>
            <TabPanel><EventoParticipantes evento={data}/></TabPanel>
          </TabPanels>
        </TabGroup> 
      </div>
      ) : (
        <p>Nenhum dado encontrado.</p>
      )}      
    </div>
  );
}

export default Evento;
