import { requisitar } from '../util/requisicaoApi';

/**
 * Listar resumo de um evento.
 */
export const resumoEvento = async (eventoId) => {
  try {
    const response = await requisitar(`/Relatorio/${eventoId}/relatorio`);

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      let errorMessage = 'Erro ao listar resumo do evento.';
      if (result.erros?.length) {
        errorMessage = result.erros.join(', ');
      } else if (result.mensagem) {
        errorMessage = result.mensagem;
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};