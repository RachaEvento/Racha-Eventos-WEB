import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { informacoesPagamento, enviarPagamento } from '../services/pagamentoService';
import { PropagateLoader } from 'react-spinners';
import { format, isSameDay } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { MdPlace } from 'react-icons/md';

// Enums
const StatusEvento = { Aberto: 0, Fechado: 1, Cancelado: 2, Finalizado: 3 };
const StatusPagamento = { Pendente: 0, Enviado: 1, Recusado: 2, Pago: 3 };

const statusEventoLabel = {
  0: 'Aberto', 1: 'Fechado', 2: 'Cancelado', 3: 'Finalizado'
};

const statusPagamentoLabel = {
  0: 'Pendente', 1: 'Enviado', 2: 'Recusado', 3: 'Pago'
};

const tipoChaveLabel = {
  1: 'CNPJ', 2: 'CPF', 3: 'E-mail', 4: 'Telefone', 5: 'Chave Aleatória'
};

const Cobrar = () => {
  const { id } = useParams();
  const [pagamento, setPagamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchCobranca = async () => {
      try {
        setLoading(true);
        const data = await informacoesPagamento(id);
        setPagamento(data);
      } catch (error) {
        console.error('Erro ao buscar pagamento:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCobranca();
  }, [id]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleEnviarPagamento = async () => {
    if (!file) return;
    try {
      setProcessing(true);
      await enviarPagamento(id, file);
      const data = await informacoesPagamento(id);
      setPagamento(data);
      setFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Erro ao enviar pagamento:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-radial">
        <PropagateLoader color="#fff" size={60} />
      </div>
    );
  }

  if (!pagamento) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-radial">
        <p className="text-2xl text-white">Cobrança não encontrada.</p>
      </div>
    );
  }

  const { contatoParticipante, evento, valor, stringPix, tipoChavePix, chavePix, statusPagamento } = pagamento;

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const formatSimpleDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const isFullDay = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startIsStartOfDay = startDate.getHours() === 0 && startDate.getMinutes() === 0;
    const endIsEndOfDay = endDate.getHours() === 23 && endDate.getMinutes() === 59;
    return isSameDay(startDate, endDate) && startIsStartOfDay && endIsEndOfDay;
  };

  const eventoFechado = evento.status === StatusEvento.Fechado;
  const pagamentoPendente = statusPagamento === StatusPagamento.Pendente;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(circle,_rgba(85,198,177,1)_0%,_rgba(38,79,87,1)_100%)] p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border-4 border-white">
        {/* Header */}
        <div className="p-4 flex justify-center">
          <img src="/logo-bar.png" alt="Logo" className="h-20 object-contain" />
        </div>

        <div className="p-6">
          <h1 className="text-2xl text-center font-bold text-[#264F57]">
            Olá <span className='text-[#55C6B1]'>{contatoParticipante.nome}</span>, aqui estão os detalhes do evento:
          </h1>
          <h2 className="text-3xl text-center text-[#55C6B1] font-semibold mt-2">
            {evento.nome}
          </h2>
          <h4 className="text-xs text-center text-gray-500 mt-1">
            {isFullDay(evento.dataInicio, evento.dataFinal) ? (
              <>Em <strong>{formatSimpleDate(evento.dataInicio)}</strong></>
            ) : (
              <>
                De <strong>{formatDate(evento.dataInicio)}</strong> até <strong>{formatDate(evento.dataFinal)}</strong>
              </>
            )}
          </h4>

          <div className="mt-6 space-y-4">
            {/* Descrição do Evento */}
            <div className="border border-[#55C6B1] rounded-xl p-4 bg-[#f9f9f9]">
              <h3 className="text-xl font-semibold text-[#55C6B1] mb-2">Detalhes do Evento</h3>
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

            {/* Pagamento */}
            <div className="border border-[#264F57] rounded-xl p-4 bg-[#f9f9f9]">
              <h3 className="text-xl font-semibold text-[#264F57] mb-2">Pagamento</h3>
              <p><strong>Valor:</strong> R$ {valor.toFixed(2)}</p>
              <img
                src={`https://dyn-qrcode.vercel.app/api?url=${stringPix}`}
                alt="QR Code PIX"
                className="w-48 h-48 mx-auto"
              />
              <p><strong>Chave PIX:</strong> {chavePix} ({tipoChaveLabel[tipoChavePix]})</p>
              <div className="mt-2">
                <p className="text-xs text-gray-500">Copia e cola PIX:</p>
                <div className="bg-gray-100 p-2 rounded text-sm break-words">
                  {stringPix}
                </div>
              </div>
            </div>
          </div>

          {/* Upload e Ações */}
          {eventoFechado ? (
            pagamentoPendente ? (
              <div className="flex flex-col gap-4 justify-center mt-8">
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-xl file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#55C6B1] file:text-white
                  hover:file:bg-[#48b09e]
                  transition"
                />

                {/* Preview */}
                {file && (
                  <div className="text-center">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-48 mx-auto rounded-xl border" />
                    ) : (
                      <p className="text-sm text-gray-600">Arquivo selecionado: <strong>{file.name}</strong></p>
                    )}
                  </div>
                )}

                <button
                  onClick={handleEnviarPagamento}
                  disabled={!file || processing}
                  className={`px-6 py-3 rounded-xl text-white font-semibold ${
                    processing ? 'bg-[#55C6B1]/50' : 'bg-[#55C6B1] hover:bg-[#48b09e]'
                  } transition`}
                >
                  {processing ? 'Enviando...' : 'Enviar Comprovante'}
                </button>
              </div>
            ) : (
              <div className="mt-6 text-center">
                <p className="text-lg text-[#264F57] font-semibold">
                  <strong>{statusPagamentoLabel[statusPagamento]}</strong>
                </p>
              </div>
            )
          ) : (
            <div className="mt-6 text-center">
              <p className="text-lg text-[#264F57] font-semibold">
                Este evento está <strong>{statusEventoLabel[evento.status]}</strong> no momento e não aceitando pagamentos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cobrar;
