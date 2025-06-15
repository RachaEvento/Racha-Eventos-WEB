import React, { useCallback, useEffect, useState } from 'react';
import {
  listarPagamentosParticipante,
  aprovarPagamento,
  recusarPagamento
} from '../../services/pagamentoService';
import {
  MdClose,
  MdCheckCircle,
  MdCancel,
  MdReceipt
} from 'react-icons/md';

import { ClipLoader } from 'react-spinners';
import { useSnackbar } from '../../util/SnackbarProvider';

const statusMap = {
  0: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  1: { label: 'Enviado', color: 'bg-yellow-100 text-yellow-800' },
  2: { label: 'Recusado', color: 'bg-red-100 text-red-800' },
  3: { label: 'Pago', color: 'bg-green-100 text-green-800' },
};

const PagamentoParticipantePopup = ({ participante, onClose, evento }) => {
  const { showSnackbar } = useSnackbar();
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comprovanteSelecionado, setComprovanteSelecionado] = useState(null);
  const [error, setError] = useState('');

  const carregarPagamentos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const dados = await listarPagamentosParticipante(participante.id);
      setPagamentos(dados.pagamentos || []);
    } catch (err) {
      showSnackbar(err.message);
    }
    setLoading(false);
  }, [showSnackbar, participante.id]);

  useEffect(() => {
    carregarPagamentos();
  }, [carregarPagamentos]);

  const handleAprovar = async (pagamentoId) => {
    try {
      await aprovarPagamento(pagamentoId);
      showSnackbar('Pagamento aprovado com sucesso.');
      await carregarPagamentos();
    } catch (err) {
      showSnackbar(err.message);
    }
  };

  const handleRecusar = async (pagamentoId) => {
    try {
      await recusarPagamento(pagamentoId);
      showSnackbar('Pagamento recusado com sucesso.');
      await carregarPagamentos();
    } catch (err) {
      showSnackbar(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-3xl relative max-h-[90vh] overflow-y-auto">
        {/* Botão fechar */}
        <button
          className="absolute top-2 right-2 text-[#264F57] hover:text-[#3e8682] text-2xl font-bold"
          onClick={() => onClose(false)}
        >
          <MdClose />
        </button>

        <h2 className="text-2xl mb-4 text-[#264F57] font-semibold flex items-center gap-2">
          Pagamentos de {participante.nome}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <ClipLoader size={50} color="#264F57" />
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : pagamentos.length === 0 ? (
          <p>Nenhum pagamento encontrado.</p>
        ) : (
          <div className="space-y-4">
            {pagamentos.map((pagamento) => {
              const status = statusMap[pagamento.statusPagamento] || {
                label: 'Desconhecido',
                color: 'bg-gray-100 text-gray-800',
              };

              return (
                <div
                  key={pagamento.pagamentoId}
                  className="border rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
                >
                  <div>
                    <p><strong>Data:</strong> {new Date(pagamento.dataPagamento).toLocaleDateString()}</p>
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${status.color}`}
                    >
                      {status.label}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {pagamento.comprovante && (
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
                        onClick={() => setComprovanteSelecionado(pagamento.comprovante)}
                      >
                        <MdReceipt /> Ver Comprovante
                      </button>
                    )}
                    
                    {(evento.status === 1) && (  
                    <>
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
                        onClick={() => handleAprovar(pagamento.pagamentoId)}
                      >
                        <MdCheckCircle /> Aprovar
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1"
                        onClick={() => handleRecusar(pagamento.pagamentoId)}
                      >
                        <MdCancel /> Recusar
                      </button>
                    </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de comprovante */}
      {comprovanteSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-60">
          <div className="bg-white p-4 rounded-lg relative w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-[#264F57] hover:text-[#3e8682] text-2xl font-bold"
              onClick={() => setComprovanteSelecionado(null)}
            >
              <MdClose />
            </button>
            <h3 className="text-xl mb-4 text-[#264F57] font-semibold flex items-center gap-2">
              <MdReceipt /> Comprovante
            </h3>
            <img
              src={`data:image/*;base64,${comprovanteSelecionado}`}
              alt="Comprovante"
              className="max-h-[80vh] mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PagamentoParticipantePopup;
