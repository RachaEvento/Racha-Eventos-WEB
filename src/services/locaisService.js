import { requisitar } from '../util/requisicaoApi';

export const todosLocais = async () => {
  try {    
    
    // Fake delay of 1 second
    //await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await requisitar('/locais');

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      let errorMessage = 'Erro ao recuperar os locais.';
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

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      let errorMessage = 'Erro ao criar o local.';
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
    
    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {      
      let errorMessage = 'Erro ao editar o local.';
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