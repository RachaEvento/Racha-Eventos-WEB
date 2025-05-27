import { requisitar } from '../util/requisicaoApi';

/**
 * Listar participantes de um evento
 */
export const listarParticipantes = async (eventoId) => {
  try {
    const response = await requisitar(`/evento/${eventoId}`, {
      method: 'GET',
    });

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      throw new Error(result.erros?.join(', ') || 'Erro ao listar participantes.');
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Adicionar participantes ao evento
 * @param {string} eventoId 
 * @param {Array<string>} contatoIds Lista de IDs dos contatos
 */
export const adicionarParticipantes = async (eventoId, contatoIds) => {
  try {
    const body = {
      contatoIds: contatoIds, // <-- alinhado com AdicionarParticipanteDTO
    };

    const response = await requisitar(`/evento/${eventoId}/adicionar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (result.sucesso) {
      return result.mensagem || 'Participantes adicionados com sucesso.';
    } else {
      throw new Error(result.erros?.join(', ') || 'Erro ao adicionar participantes.');
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Remover participantes do evento
 * @param {string} eventoId 
 * @param {Array<string>} participantesIds Lista de IDs dos participantes
 */
export const removerParticipantes = async (eventoId, participantesIds) => {
  try {
    const body = {
      participantesIds: participantesIds, // <-- alinhado com RemoverParticipanteDTO
    };

    const response = await requisitar(`/evento/${eventoId}/remover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (result.sucesso) {
      return result.mensagem || 'Participantes removidos com sucesso.';
    } else {
      throw new Error(result.erros?.join(', ') || 'Erro ao remover participantes.');
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
