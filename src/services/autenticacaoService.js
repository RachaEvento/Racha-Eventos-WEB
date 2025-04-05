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

  localStorage.setItem('token', data.token);
  return data;
};

export const registrar = async (name, email, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Erro ao realizar cadastro');

  return data;
};
