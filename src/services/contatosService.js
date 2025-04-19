import { requisitar } from '../util/requisicaoApi';

export const todosContatos = async () => {
  try {
    
    // Fake delay of 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await requisitar('/contatos');

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      throw new Error(result.mensagem || 'Erro ao carregar contatos.');
    }
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    return [];
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

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      throw new Error(result.mensagem || 'Erro ao criar contato.');
    }
  } catch (error) {
    console.error('Erro ao criar contato:', error);
    return null;
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

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      throw new Error(result.mensagem || 'Erro ao editar contato.');
    }
  } catch (error) {
    console.error('Erro ao editar contato:', error);
    return null;
  }
};