import { requisitar } from '../util/requisicaoApi';

// Buscar todos os eventos
export const todosEventos = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await requisitar('/eventos');
    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      let errorMessage = 'Erro ao recuperar os eventos.';
      if (Array.isArray(result.erros) && result.erros.length > 0) {
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

// Criar novo evento
export const criarEvento = async ({
  nome,
  descricao,
  dataInicio,
  dataFim, 
  status,
  localId,
  contatosParticipantes = []
}) => {
  try {
    const evento = {
      nome,
      descricao,
      dataInicio,
      dataFinal: dataFim, 
      status,
      localId,
      contatosParticipantes
    };

    const response = await requisitar('/eventos', {
      method: 'POST',
      body: JSON.stringify(evento),
    });

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      let errorMessage = 'Erro ao criar o evento.';
      if (Array.isArray(result.erros) && result.erros.length > 0) {
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


export const editarEvento = async ({
  id,
  nome,
  descricao,
  dataInicio,
  dataFim,
  status,
  localId,
  contatosParticipantes = []
}) => {
  try {
    const eventoAtualizado = {
      id,
      nome,
      descricao,
      dataInicio,
      dataFinal: dataFim, 
      status,
      localId,
      contatosParticipantes
    };

    const response = await requisitar(`/eventos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventoAtualizado),
    });

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      let errorMessage = 'Erro ao editar o evento.';
      if (Array.isArray(result.erros) && result.erros.length > 0) {
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
