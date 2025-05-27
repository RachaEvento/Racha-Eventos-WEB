import { requisitar } from '../util/requisicaoApi';

/**
 * Listar listas de custo de um evento, incluindo custos e participantes.
 */
export const listarListasCustoPorEvento = async (eventoId) => {
  try {
    const response = await requisitar(`/evento/${eventoId}`);

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      let errorMessage = 'Erro ao listar listas de custo do evento.';
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

/**
 * Criar uma nova lista de custo para um evento.
 */
export const criarListaCusto = async (eventoId, lista) => {
  try {
    const response = await requisitar(`/evento/${eventoId}/criar`, {
      method: 'POST',
      body: JSON.stringify(lista),
    });

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      let errorMessage = 'Erro ao criar a lista de custo.';
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

/**
 * Adicionar participantes a uma lista de custo.
 */
export const adicionarParticipantes = async (listaCustoId, participantes) => {
  try {
    const response = await requisitar(`/${listaCustoId}/participantes/adicionar`, {
      method: 'POST',
      body: JSON.stringify(participantes),
    });

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      let errorMessage = 'Erro ao adicionar participantes.';
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

/**
 * Remover participantes de uma lista de custo.
 */
export const removerParticipantes = async (listaCustoId, participantes) => {
  try {
    const response = await requisitar(`/${listaCustoId}/participantes/remover`, {
      method: 'POST',
      body: JSON.stringify(participantes),
    });

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      let errorMessage = 'Erro ao remover participantes.';
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
