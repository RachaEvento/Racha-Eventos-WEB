import React, { useState } from 'react';
import { useSnackbar } from '../../util/SnackbarProvider';
import { adicionarCusto } from '../../services/custosService';

const AdicionarCustoListaCustoPopup = ({ listaCustoId, eventoId, onClose }) => {
  const [valorNovoCusto, setValorNovoCusto] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [nomeNovoCusto, setNomeNovoCusto] = useState('');
  const { showSnackbar } = useSnackbar();

  const handleAdicionarCusto = async () => {
    if (!listaCustoId || !nomeNovoCusto) return;

    try {
      setCarregando(true);
      await adicionarCusto(listaCustoId, {
        nome: nomeNovoCusto,
        valor: parseFloat(valorNovoCusto)
      });
      setNomeNovoCusto('');
      setValorNovoCusto(0);
      showSnackbar('Custo adicionado com sucesso!');
      onClose(true);
    } catch (e) {
      setErro(e.message || 'Erro ao adicionar custo.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative">
        {/* Botão de fechar */}
        <button
          className="absolute top-2 right-3 text-gray-700 hover:text-red-500 text-2xl font-bold"
          onClick={() => onClose(false)}
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Adicionar Custo</h2>

        {carregando ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : (
          <>
            <div className="space-y-4 mb-4">
              <input
                type="text"
                placeholder="Nome do custo"
                value={nomeNovoCusto}
                onChange={(e) => setNomeNovoCusto(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#264F57]"
              />

              <input
                type="number"
                placeholder="Valor"
                value={valorNovoCusto}
                onChange={(e) => setValorNovoCusto(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#264F57]"
              />
            </div>

            {erro && (
              <p className="text-red-600 text-sm mb-4 text-center">{erro}</p>
            )}

            <button
              className="w-full bg-[#264F57] hover:bg-[#3e8682] text-white font-medium py-2 rounded-lg transition duration-200"
              onClick={handleAdicionarCusto}
            >
              Adicionar Custo
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdicionarCustoListaCustoPopup;
