import React, { useEffect, useState } from 'react';
import { todosContatosDisponveisEvento } from '../../services/contatosService';
import { adicionarParticipantes } from '../../services/participanteService';
import { useSnackbar } from '../../util/SnackbarProvider';

const ConvidarContatoPopup = ({ evento, onClose }) => {
  const [contatos, setContatos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [selecionados, setSelecionados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);  
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const carregarContatos = async () => {
      setCarregando(true);
      try {
        const dados = await todosContatosDisponveisEvento(evento.id);
        setContatos(dados);
      } catch (error) {
        alert(error.message);
      } finally {
        setCarregando(false);
      }
    };

    carregarContatos();
  }, [evento]);

  const handleSelecionar = (id) => {
    if (selecionados.includes(id)) {
      setSelecionados(selecionados.filter((item) => item !== id));
    } else {
      setSelecionados([...selecionados, id]);
    }
  };

  const handleConvidar = async () => {
    if (selecionados.length === 0) {
      showSnackbar('Selecione ao menos um contato.');
      return;
    }
    setEnviando(true);
    try {
      const mensagem = await adicionarParticipantes(evento.id, selecionados);
      showSnackbar(mensagem);
      onClose(true);
    } catch (error) {
      showSnackbar(error.message);
    } finally {
      setEnviando(false);
    }
  };

  const contatosFiltrados = contatos.filter(
    (c) => c.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
        {/* Botão fechar */}
        <button
          className="absolute top-2 right-2 text-[#264F57] hover:text-[#3e8682] text-2xl font-bold"
          onClick={() => { onClose(false) }}
        >
          &times;
        </button>

        <h2 className="text-2xl mb-4 text-[#264F57] font-semibold">Convidar Contatos</h2>

        {/* Filtro */}
        <input
          type="text"
          placeholder="Filtrar por nome..."
          className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#55C6B1]"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        {/* Tabela */}
        <div className="overflow-auto max-h-96">
          <table className="w-full table-auto border border-gray-200">
            <thead>
              <tr className="bg-[#55C6B1] text-white">
                <th className="p-2"></th>
                <th className="p-2 text-left">Nome</th>
                <th className="p-2 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {carregando ? (
                <tr>
                  <td colSpan="3" className="p-4 text-center">
                    Carregando...
                  </td>
                </tr>
              ) : contatosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-4 text-center">
                    Nenhum contato encontrado.
                  </td>
                </tr>
              ) : (
                contatosFiltrados.map((contato) => (
                  <tr key={contato.id} className="hover:bg-[#f0fdfa]">
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selecionados.includes(contato.id)}
                        onChange={() => handleSelecionar(contato.id)}
                        className="accent-[#55C6B1]"
                      />
                    </td>
                    <td className="p-2">{contato.nome}</td>
                    <td className="p-2">{contato.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-4 mt-6">          
          <button
            className="bg-[#264F57] hover:bg-[#3db29d] text-white font-semibold py-2 px-4 rounded"
            onClick={handleConvidar}
            disabled={enviando}
          >
            {enviando ? 'Convidando...' : 'Convidar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConvidarContatoPopup;
