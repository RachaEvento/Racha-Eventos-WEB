import { requisitar } from '../util/requisicaoApi';

export const listarCustos = async (listaCustoId) => {
  try {
    const response = await requisitar(`/custo/listacusto/${listaCustoId}`);

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      let errorMessage = 'Erro ao listar os custos.';
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

export const adicionarCusto = async (listaCustoId, custo) => {
  try {
    const response = await requisitar(`/custo/listacusto/${listaCustoId}/adicionar`, {
      method: 'POST',
      body: JSON.stringify(custo),
    });

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      let errorMessage = 'Erro ao adicionar o custo.';
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

export const removerCusto = async (listaCustoId, custoId) => {
  try {
    const payload = { custoId: custoId };

    const response = await requisitar(`/custo/listacusto/${listaCustoId}/remover`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.sucesso) {
      return result.dados;
    } else {
      let errorMessage = 'Erro ao remover o custo.';
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
