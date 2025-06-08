import { requisitar } from '../util/requisicaoApi';

/**
 * Aprovar o pagamento de um participante
 */
export const aprovarPagamento = async (pagamentoId) => {
  try {
    const response = await requisitar(`/pagamento/${pagamentoId}/aprovar`, {
      method: 'POST',
    });

    const result = await response.json();

    if (result.sucesso) {
      return result.mensagem || 'Pagamento aprovado.';
    } else {
      throw new Error(result.erros?.join(', ') || 'Erro ao aprovar pagamento.');
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Recusar o pagamento de um participante
 */
export const recusarPagamento = async (pagamentoId) => {
  try {
    const response = await requisitar(`/pagamento/${pagamentoId}/recusar`, {
      method: 'POST',
    });

    const result = await response.json();

    if (result.sucesso) {
      return result.mensagem || 'Pagamento recusado.';
    } else {
      throw new Error(result.erros?.join(', ') || 'Erro ao recusar pagamento.');
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Listar pagamentos de um participante (para organizadores)
 */
export const listarPagamentosParticipante = async (participanteId) => {
  try {
    const response = await requisitar(`/pagamento/${participanteId}/listar`);
    console.log(response)

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      throw new Error(result.erros?.join(', ') || 'Erro ao listar pagamentos.');
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Obter informações do pagamento de um participante (público)
 */
export const informacoesPagamento = async (participanteId) => {
  try {
    const response = await requisitar(`/pagamento/${participanteId}`);

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      throw new Error(result.erros?.join(', ') || 'Erro ao obter informações de pagamento.');
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Enviar comprovante de pagamento (upload de arquivo)
 */
export const enviarPagamento = async (participanteId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await requisitar(`/pagamento/${participanteId}`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.sucesso) {
      return result.mensagem || 'Pagamento enviado para avaliação.';
    } else {
      throw new Error(result.erros?.join(', ') || 'Erro ao enviar pagamento.');
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
