import { requisitar } from '../util/requisicaoApi';

/**
 * Convidar todos os participantes de um evento
 */
export const convidarTodosParticipantes = async (eventoId) => {
  try {
    const response = await requisitar(`/convite/evento/${eventoId}/convidar/todos`, {
      method: 'POST',
    });

    const result = await response.json();

    if (result.sucesso) {
      return result.mensagem || 'Convites enviados.';
    } else {
      throw new Error(result.erros?.join(', ') || result.mensagem || 'Erro ao convidar participantes.');
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Convidar um participante específico do evento
 */
export const convidarParticipante = async (eventoId, participanteId) => {
  try {
    const response = await requisitar(`/convite/evento/${eventoId}/convidar/${participanteId}`, {
      method: 'POST',
    });

    const result = await response.json();

    if (result.sucesso) {
      return result.mensagem || 'Convite enviado.';
    } else {
      throw new Error(result.erros?.join(', ') || result.mensagem || 'Erro ao convidar participante.');
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Confirmar participação de um participante
 */
export const confirmarParticipacao = async (participanteId) => {
  try {
    const response = await requisitar(`/convite/${participanteId}/confirmar`, {
      method: 'POST',
    });

    const result = await response.json();

    if (result.sucesso) {
      return result.mensagem || 'Participação confirmada.';
    } else {
      throw new Error(result.erros?.join(', ') || result.mensagem || 'Erro ao confirmar participação.');
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Recusar participação de um participante
 */
export const recusarParticipacao = async (participanteId) => {
  try {
    const response = await requisitar(`/convite/${participanteId}/recusar`, {
      method: 'POST',
    });

    const result = await response.json();

    if (result.sucesso) {
      return result.mensagem || 'Participação recusada.';
    } else {
      throw new Error(result.erros?.join(', ') || result.mensagem || 'Erro ao recusar participação.');
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Buscar informações do convite de um participante
 */
export const buscarConvite = async (participanteId) => {
  try {
    const response = await requisitar(`/convite/${participanteId}/convite`);

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      throw new Error(result.erros?.join(', ') || result.mensagem || 'Erro ao buscar convite.');
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
