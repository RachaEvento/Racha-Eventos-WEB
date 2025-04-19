const API_URL = process.env.REACT_APP_API_URL;

export const requisitar = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token'); // or sessionStorage, or from a context

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config = {
    ...options,
    headers,
  };

  return fetch(`${API_URL}${endpoint}`, config);
};
