const API_URL = process.env.REACT_APP_API_URL;

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.log(response);
    throw new Error(data.message || 'Erro ao realizar login');
  }

  localStorage.setItem('token', data.dados);
  return data;
};

export const registrar = async (nome, email, numero, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, numero, password }),
  });

  const data = await response.json();
  console.log(data);
  if (!response.ok) throw new Error(data.mensagem || 'Erro ao realizar cadastro');

  return data;
};
