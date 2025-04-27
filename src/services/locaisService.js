import { requisitar } from '../util/requisicaoApi';

export const todosLocais = async () => {
  try {
    
    // Fake delay of 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await requisitar('/locais');

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      throw new Error(result.mensagem || 'Erro ao carregar locais.');
    }
  } catch (error) {
    console.error('Erro ao buscar locais:', error);
    return [];
  }
};

export const criarLocal = async (nome, endereco, descricaoLocal, bairro, cidade, estado, ativo = true) => {
  try {
    const local = {
      nome,
      endereco,
      descricaoLocal,
      bairro,
      cidade,
      estado,
      ativo
    };

    const response = await requisitar('/locais', {
      method: 'POST',
      body: JSON.stringify(local),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      throw new Error(result.mensagem || 'Erro ao criar local.');
    }
  } catch (error) {
    console.error('Erro ao criar local:', error);
    return null;
  }
};

export const editarLocal = async (id, nome, endereco, descricaoLocal, bairro, cidade, estado, ativo = true) => {
  try {
    // Corpo da requisição com os dados atualizados do local
    const localAtualizado = {
      id,
      nome,
      endereco,
      descricaoLocal,
      bairro,
      cidade,
      estado,
      ativo
    };

    const response = await requisitar(`/locais/${id}`, {
      method: 'PUT',
      body: JSON.stringify(localAtualizado),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      throw new Error(result.mensagem || 'Erro ao editar local.');
    }
  } catch (error) {
    console.error('Erro ao editar local:', error);
    return null;
  }
};