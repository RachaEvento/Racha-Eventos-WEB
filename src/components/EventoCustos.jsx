import React, { useEffect, useState, useCallback } from 'react';
import { adicionarCusto, removerCusto } from '../services/custosService';
import {
  listarListasCustoPorEvento,
  criarListaCusto,
  removerParticipantes
} from '../services/listaCustoService';
import AdicionarParticipanteListaCustoPopup from './popups/AdicionarParticipanteListaCustoPopup';
import { useSnackbar } from '../util/SnackbarProvider';
import { MdClose } from 'react-icons/md';

const EventoCustos = ({ evento }) => {
  const [listasCusto, setListasCusto] = useState([]);
  const [erro, setErro] = useState('');
  const [nomeNovaLista, setNomeNovaLista] = useState('');
  const [nomeNovoCusto, setNomeNovoCusto] = useState('');
  const [valorNovoCusto, setValorNovoCusto] = useState(0);
  const [listaSelecionadaId, setListaSelecionadaId] = useState('');
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [listaParaAdicionarParticipante, setListaParaAdicionarParticipante] =
    useState(null);

  const { showSnackbar } = useSnackbar();

  const carregarListas = useCallback(async () => {
    try {
      const listas = await listarListasCustoPorEvento(evento.id);
      setListasCusto(listas);
    } catch (e) {
      setErro(e.message);
    }
  }, [evento.id]);

  useEffect(() => {
    carregarListas();
  }, [carregarListas]);

  const handleCriarLista = async () => {
    if (!nomeNovaLista) return;

    try {
      await criarListaCusto(evento.id, { nome: nomeNovaLista });
      setNomeNovaLista('');
      await carregarListas();
      showSnackbar('Lista criada com sucesso!');
    } catch (e) {
      setErro(e.message);
    }
  };

  const handleAdicionarCusto = async () => {
    if (!listaSelecionadaId || !nomeNovoCusto) return;

    try {
      await adicionarCusto(listaSelecionadaId, {
        nome: nomeNovoCusto,
        valor: parseFloat(valorNovoCusto)
      });
      setNomeNovoCusto('');
      setValorNovoCusto(0);
      await carregarListas();
      showSnackbar('Custo adicionado com sucesso!');
    } catch (e) {
      setErro(e.message);
    }
  };

  const handleRemoverCusto = async (listaId, custoId) => {
    try {
      await removerCusto(listaId, custoId);
      await carregarListas();
      showSnackbar('Custo removido!');
    } catch (e) {
      setErro(e.message);
    }
  };

  const handleRemoverParticipante = async (listaId, participanteId) => {
    try {
      var listaParticipantesRemover = {
        participantesIds: [participanteId]
      };
      await removerParticipantes(listaId, listaParticipantesRemover);
      await carregarListas();
      showSnackbar('Participante removido!');
    } catch (e) {
      setErro(e.message);
    }
  };

  const abrirPopupAdicionarParticipante = (listaId) => {
    setListaParaAdicionarParticipante(listaId);
    setMostrarPopup(true);
  };

  const fecharPopupAdicionarParticipante = async (adicionou) => {
    setMostrarPopup(false);
    setListaParaAdicionarParticipante(null);
    if (adicionou) {
      await carregarListas();
    }
  };

  return (
    <div className="p-2 bg-white min-h-screen">
      {erro && <p className="text-red-600">{erro}</p>}


      
      {evento.status === 0 && (
      <>
        {/* Criar nova lista */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#264F57] mb-4">
            Criar nova lista de custos
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Nome da lista"
              value={nomeNovaLista}
              onChange={(e) => setNomeNovaLista(e.target.value)}
              className="border rounded px-3 py-2 flex-1"
            />
            <button
              className="bg-[#264F57] hover:bg-[#3e8682] text-white px-4 py-2 rounded"
              onClick={handleCriarLista}
            >
              Criar Lista
            </button>
          </div>
        </div>

        {/* Adicionar custo */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#264F57] mb-4">
            Adicionar custo em uma lista
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={listaSelecionadaId}
              onChange={(e) => setListaSelecionadaId(e.target.value)}
              className="border rounded px-3 py-2 flex-1"
            >
              <option value="">Selecione a lista</option>
              {listasCusto.map((lista) => (
                <option key={lista.id} value={lista.id}>
                  {lista.nome}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Nome do custo"
              value={nomeNovoCusto}
              onChange={(e) => setNomeNovoCusto(e.target.value)}
              className="border rounded px-3 py-2 flex-1"
            />
            <input
              type="number"
              placeholder="Valor"
              value={valorNovoCusto}
              onChange={(e) => setValorNovoCusto(e.target.value)}
              className="border rounded px-3 py-2 w-32"
            />
            <button
              className="bg-[#264F57] hover:bg-[#3e8682] text-white px-4 py-2 rounded"
              onClick={handleAdicionarCusto}
            >
              Adicionar Custo
            </button>
          </div>
        </div>
      </>
      )}

      {listasCusto.length === 0 ? (
        <p className="text-gray-600">Nenhuma lista de custo cadastrada.</p>
      ) : (
        <div className="grid gap-6">
          {listasCusto.map((lista) => (
            <div
              key={lista.id}
              className="border border-gray-300 rounded-lg p-5 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h3 className="text-lg font-semibold text-[#264F57] mb-2 sm:mb-0">
                  {lista.nome} -{' '}
                  <span className="text-[#55C6B1]">
                    R${' '}
                    {(
                      lista.custos?.reduce(
                        (acc, custo) => acc + (custo.valor || 0),
                        0
                      )
                    ).toFixed(2)}
                  </span>
                </h3>
                {evento.status === 0 && (
                  <button
                    className="bg-[#55C6B1] hover:bg-[#3e8682] text-white px-4 py-2 rounded"
                    onClick={() => abrirPopupAdicionarParticipante(lista.id)}
                  >
                    Adicionar Participante
                  </button>
                )}
              </div>

              {/* Custos */}
              <div className="mt-4">
                <strong className="text-[#264F57]">Custos:</strong>
                {lista.custos.length === 0 ? (
                  <p className="text-gray-600">Sem custos nesta lista.</p>
                ) : (
                  <ul className="list-disc ml-6 mt-1 space-y-1">
                    {lista.custos.map((custo) => (
                      <li key={custo.id} className="flex items-center">
                        {custo.nome} - R$ {custo.valor.toFixed(2)}
                        {evento.status === 0 && (
                          <button
                            className="text-red-500 ml-2"
                            onClick={() => handleRemoverCusto(lista.id, custo.id)}
                          >
                            <MdClose />
                          </button>
                        )}                        
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Participantes */}
              <div className="mt-4">
                <strong className="text-[#264F57]">Participantes:</strong>
                {lista.participantes.length === 0 ? (
                  <p className="text-gray-600">
                    Sem participantes nesta lista.
                  </p>
                ) : (
                  <ul className="list-disc ml-6 mt-1 space-y-1">
                    {lista.participantes.map((p) => (
                      <li key={p.id} className="flex items-center">
                        {p.nome}
                        {evento.status === 0 && (
                          <button
                            className="text-red-500 ml-2"
                            onClick={() =>
                              handleRemoverParticipante(lista.id, p.id)
                            }
                          >
                            <MdClose />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup adicionar participante */}
      {mostrarPopup && (
        <AdicionarParticipanteListaCustoPopup
          listaCustoId={listaParaAdicionarParticipante}
          eventoId={evento.id}
          onClose={fecharPopupAdicionarParticipante}
        />
      )}
    </div>
  );
};

export default EventoCustos;
