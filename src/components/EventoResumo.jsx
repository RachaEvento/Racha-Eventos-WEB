import React, { useEffect, useState } from 'react';
import { resumoEvento } from '../services/relatorioService';
import {
  MdEvent,
  MdLocationOn,
  MdPerson,
  MdPeople,
  MdCheckCircle,
  MdAttachMoney,
  MdReceipt,
} from 'react-icons/md';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const EventoResumo = ({ evento }) => {
  const [resumo, setResumo] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregarResumo = async () => {
      try {
        const dadosResumo = await resumoEvento(evento.id);
        setResumo(dadosResumo);
      } catch (e) {
        setErro(e.message);
      }
    };

    if (evento?.id) {
      carregarResumo();
    }
  }, [evento]);

  if (erro) {
    return <p className="text-red-600 text-center mt-4">{erro}</p>;
  }

  if (!resumo) {
    return <p className="text-gray-500 text-center mt-4">Carregando resumo do evento...</p>;
  }

  const pieData = {
    labels: ['Confirmados', 'Não Confirmados'],
    datasets: [{
      data: [resumo.quantidadeConfirmados, resumo.quantidadeParticipantes - resumo.quantidadeConfirmados],
      backgroundColor: ['#4CAF50', '#FFC107'],
      hoverBackgroundColor: ['#66BB6A', '#FFD54F'],
    }],
  };

  return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Informações Gerais */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#55c6b1] mb-4 flex items-center gap-2">
              <MdEvent size={20} />
              Informações Gerais
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>{resumo.descricao}</p>
              <p className="flex items-center gap-2">
                <MdPerson size={18} />
                <strong>Responsável:</strong> {resumo.responsavel}
              </p>
            </div>
          </div>

          {/* Participação */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#55c6b1] mb-4 flex items-center gap-2">
              <MdPeople size={20} />
              Participação
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="flex items-center gap-2">
                <MdPeople size={18} />
                <strong>Participantes:</strong> {resumo.quantidadeParticipantes}
              </p>
              <p className="flex items-center gap-2">
                <MdCheckCircle size={18} className="text-green-600" />
                <strong>Confirmados:</strong> {resumo.quantidadeConfirmados}
              </p>
              {resumo.quantidadeParticipantes > 0 && (
                <div className="mt-4 h-48">
                  <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              )}
            </div>
          </div>

          {/* Custos */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#55c6b1] mb-4 flex items-center gap-2">
              <MdAttachMoney size={20} />
              Custos
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="flex items-center gap-2">
                <MdReceipt size={18} />
                <strong>Listas de Custo:</strong> {resumo.quantidadeListasCusto}
              </p>
              <p className="flex items-center gap-2">
                <MdAttachMoney size={18} className="text-green-600" />
                <strong>Total:</strong> R$ {resumo.custoTotal.toFixed(2)}
              </p>
              <p className="flex items-center gap-2">
                <MdAttachMoney size={18} className="text-blue-600" />
                <strong>Menor Custo:</strong> R$ {resumo.menorCusto.toFixed(2)}
              </p>
              <p className="flex items-center gap-2">
                <MdAttachMoney size={18} className="text-blue-600" />
                <strong>Maior Custo:</strong> R$ {resumo.maiorCusto.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default EventoResumo;