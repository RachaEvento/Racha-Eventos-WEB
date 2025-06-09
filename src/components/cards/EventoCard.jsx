import React from "react";
import { MdEvent } from "react-icons/md";

const statusEventoLabel = {
  0: "Aberto",
  1: "Fechado",
  2: "Cancelado",
  3: "Finalizado",
};

function EventoCard({ evento, onClick }) {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const dia = date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    const hora = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { dia, hora, raw: date };
  };

  const dataInicio = formatDate(evento.dataInicio);
  const dataFinal = formatDate(evento.dataFinal);

  let dataTexto = "";

  if (dataInicio && dataFinal) {
    const mesmoDia =
      dataInicio.raw.getDate() === dataFinal.raw.getDate() &&
      dataInicio.raw.getMonth() === dataFinal.raw.getMonth() &&
      dataInicio.raw.getFullYear() === dataFinal.raw.getFullYear();

    const mesmaHora =
      dataInicio.raw.getHours() === dataFinal.raw.getHours() &&
      dataInicio.raw.getMinutes() === dataFinal.raw.getMinutes();

    const diaInteiro =
      dataInicio.raw.getHours() === 0 &&
      dataInicio.raw.getMinutes() === 0 &&
      dataFinal.raw.getHours() === 23 &&
      dataFinal.raw.getMinutes() === 59;

    if ((mesmoDia && mesmaHora) || diaInteiro) {
      dataTexto = `${dataInicio.dia}`;
    } else if (mesmoDia) {
      dataTexto = `${dataInicio.dia} ${dataInicio.hora} até ${dataFinal.hora}`;
    } else {
      dataTexto = `${dataInicio.dia} ${dataInicio.hora} até ${dataFinal.dia} ${dataFinal.hora}`;
    }
  } else if (dataInicio) {
    dataTexto = `${dataInicio.dia} ${dataInicio.hora}`;
  }

  const statusLabel = statusEventoLabel[evento.status] ?? "Desconhecido";

  const statusColor = {
    0: "bg-green-500",
    1: "bg-yellow-500",
    2: "bg-red-500",
    3: "bg-blue-500",
  }[evento.status] || "bg-gray-500";

  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex flex-col items-center justify-center bg-white border border-[#3e8682] rounded-2xl w-full shadow-md hover:shadow-lg transition duration-200 p-4"
    >
      <div className="w-20 h-20 rounded-full bg-[#55c6b1] flex items-center justify-center mb-3">
        <MdEvent size={40} className="text-white" />
      </div>

      <div className="w-full">
        <h3 className="text-[#264f57] font-semibold text-lg text-center">
          {evento.nome}
        </h3>

        {/* Status */}
        <div className={`px-2 py-1 rounded-full text-xs text-white font-semibold w-fit mx-auto mt-1 ${statusColor}`}>
          {statusLabel}
        </div>

        {/* {evento.descricao && (
          <p className="text-[#264f57] text-sm text-center mt-1">
            {evento.descricao}
          </p>
        )} */}

        <div className="flex flex-col sm:flex-col justify-between gap-1 mt-2">
          {evento.localNome && (
            <p className="text-[#264f57] text-sm">{evento.localNome}</p>
          )}
          {dataTexto && (
            <p className="text-[#264f57] text-sm">{dataTexto}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventoCard;
