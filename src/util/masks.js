export function getMaskPix(tipo) {
  switch (tipo.toString()) {
    case '1': // CPF
      return '999.999.999-99';
    case '2': // CNPJ
      return '99.999.999/9999-99';
    case '3': // Telefone
      return '(99) 99999-9999';
    case '4': // E-mail (sem máscara)
      return null;
    case '5': // Aleatória (sem máscara)
      return null;
    default:
      return null;
  }
}
