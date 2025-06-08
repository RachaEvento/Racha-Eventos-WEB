import { TipoChavePix } from '../enum/TipoChavePix';

export function getCleavePixOptions(tipo) {
  switch (tipo) {
    case TipoChavePix.CPF:
      return { delimiters: ['.', '.', '-'], blocks: [3, 3, 3, 2], numericOnly: true };
    case TipoChavePix.CNPJ:
      return { delimiters: ['.', '.', '/', '-'], blocks: [2, 3, 3, 4, 2], numericOnly: true };
    case TipoChavePix.Telefone:
      return { delimiters: ['(', ') ', '-', '-'], blocks: [0, 2, 5, 4], numericOnly: true };
    case TipoChavePix.Email:
    case TipoChavePix.Aleatoria:
    default:
      return null;
  }
}

export const telefoneOptions = {
  delimiters: ['(', ') ', '-', '-'],
  blocks: [0, 2, 5, 4],
  numericOnly: true,
};
