import React, { useState, useCallback } from 'react';
import { login } from '../services/autenticacaoService';
import { useNavigate } from 'react-router-dom';
import { MdEmail, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import IconInputWrapper from '../util/IconInputWrapper';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = useCallback((e) => setEmail(e.target.value), []);
  const handlePasswordChange = useCallback((e) => setPassword(e.target.value), []);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'E-mail inválido';
    
    if (!password) newErrors.password = 'Senha é obrigatória';
    else if (password.length < 6) newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/eventos');
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          E-mail
        </label>        
        <IconInputWrapper Icon={MdEmail}>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="seu@email.com"
          />
        </IconInputWrapper>
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Senha
        </label>
        <IconInputWrapper Icon={showPassword ? MdVisibility : MdVisibilityOff} onIconClick={() => { setShowPassword(prevState => !prevState)}}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="******"
          />
        </IconInputWrapper>
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>
      
      <div className="flex items-center justify-between">        
        <div className="text-sm">
          <a href="/" className="font-medium text-blue-600 hover:text-blue-500">
            Esqueceu sua senha?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>

      {errors.form && <p className="text-center text-red-600">{errors.form}</p>}
    </form>
  );
};

export default Login;
