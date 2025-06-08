import { requisitar } from '../util/requisicaoApi';

export const todosContatos = async () => {
  try {
    
    // Fake delay of 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await requisitar('/contatos');

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      let errorMessage = 'Erro ao recuperar os contatos.';
      if (result.erros && Array.isArray(result.erros) && result.erros.length > 0) {
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

export const todosContatosDisponveisEvento = async (eventoId) => {
  try {
    
    // Fake delay of 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await requisitar(`/contatos/disponiveis/${eventoId}`);

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      let errorMessage = 'Erro ao recuperar os contatos.';
      if (result.erros && Array.isArray(result.erros) && result.erros.length > 0) {
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

export const criarContato = async (nome, email, telefone, ativo = true) => {
  try {
    const contato = {
      nome,
      email,
      telefone,
      ativo
    };

    const response = await requisitar('/contatos', {
      method: 'POST',
      body: JSON.stringify(contato),
    });

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      let errorMessage = 'Erro ao criar o contato.';
      if (result.erros && Array.isArray(result.erros) && result.erros.length > 0) {
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

export const editarContato = async (id, nome, email, telefone, ativo = true) => {
  try {
    // Corpo da requisição com os dados atualizados do contato
    const contatoAtualizado = {
      id,
      nome,
      email,
      telefone,
      ativo,
    };

    const response = await requisitar(`/contatos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contatoAtualizado),
    });
    
    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      let errorMessage = 'Erro ao editar o contato.';
      if (result.erros && Array.isArray(result.erros) && result.erros.length > 0) {
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