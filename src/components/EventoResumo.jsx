import React, { useEffect, useState } from 'react';
import { resumoEvento } from '../services/relatorioService';

import {
  MdAttachMoney,
  MdCheckCircle,
  MdLocationOn,
  MdEvent,
  MdPerson,
  MdList,
} from 'react-icons/md';
import { IoMdCloseCircle } from 'react-icons/io';

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
    return <p className="text-red-600 text-center mt-2">{erro}</p>;
  }

  if (!resumo) {
    return <p className="text-gray-500 text-center mt-2">Carregando resumo do evento...</p>;
  }

  return (
    <div className="bg-[#F7FAFA] py-4 pl-6 sm:pl-8 pr-0">
      <div className="max-w-4xl bg-white shadow-md rounded-xl p-6">
        
        {/* Título geral sem lupa */}
        <h1 className="text-2xl font-bold text-[#264F57] mb-6">
          Resumo do Evento
        </h1>

        {/* Conteúdo lado a lado */}
        <div className="flex flex-wrap gap-8">
          
          {/* Informações Gerais */}
          <section className="flex-1 min-w-[280px]">
            <h2 className="text-xl font-semibold text-[#264F57] mb-4 flex items-center gap-2">
              <MdEvent size={20} />
              Informações Gerais
            </h2>
            <div className="space-y-2 text-base text-[#264F57]">
              <p className="flex items-center gap-2">
                <MdList size={18} />
                <strong>Nome:</strong> {resumo.nomeEvento}
              </p>
              <p className="flex items-center gap-2">
                <MdList size={18} />
                <strong>Descrição:</strong> {resumo.descricao}
              </p>
              <p className="flex items-center gap-2">
                <MdEvent size={18} />
                <strong>Início:</strong> {new Date(resumo.dataInicio).toLocaleString('pt-BR')}
              </p>
              <p className="flex items-center gap-2">
                <MdEvent size={18} />
                <strong>Fim:</strong> {new Date(resumo.dataFinal).toLocaleString('pt-BR')}
              </p>
              <p className="flex items-center gap-2">
                <MdLocationOn size={18} />
                <strong>Local:</strong> {resumo.local}
              </p>
              <p className="flex items-center gap-2">
                <MdPerson size={18} />
                <strong>Responsável:</strong> {resumo.responsavel}
              </p>
            </div>
          </section>

          {/* Participação & Custos */}
          <section className="flex-1 min-w-[280px]">
            <h2 className="text-xl font-semibold text-[#264F57] mb-4 flex items-center gap-2">
              <MdAttachMoney size={20} className="text-[#55C6B1]" />
              Participação & Custos
            </h2>
            <div className="space-y-2 text-base text-[#264F57]">
              <p className="flex items-center gap-2">
                <MdPerson size={18} />
                <strong>Participantes:</strong> {resumo.quantidadeParticipantes}
              </p>
              <p className="flex items-center gap-2">
                <MdCheckCircle size={18} className="text-[#55C6B1]" />
                <strong>Confirmados:</strong> {resumo.quantidadeConfirmados}
              </p>
              <p className="flex items-center gap-2">
                <MdList size={18} />
                <strong>Listas de Custo:</strong> {resumo.quantidadeListasCusto}
              </p>
              <p className="flex items-center gap-2">
                <MdAttachMoney size={18} className="text-[#55C6B1]" />
                <strong>Total:</strong> R$ {resumo.custoTotal.toFixed(2)}
              </p>
              <p className="flex items-center gap-2">
                <IoMdCloseCircle size={18} className="text-red-600" />
                <strong>Menor Custo:</strong> R$ {resumo.menorCusto.toFixed(2)}
              </p>
              <p className="flex items-center gap-2">
                <MdAttachMoney size={18} className="text-green-700" />
                <strong>Maior Custo:</strong> R$ {resumo.maiorCusto.toFixed(2)}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EventoResumo;
