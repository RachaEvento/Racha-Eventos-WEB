import React, { useState, useCallback } from 'react';
import { registrar } from '../services/autenticacaoService';
import Cleave from 'cleave.js/react';
import { MdPerson, MdEmail, MdPhone, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useSnackbar } from '../util/SnackbarProvider';

// Memoize the IconInputWrapper to prevent unnecessary re-renders
const IconInputWrapper = React.memo(({ children, Icon, onIconClick }) => {
  const handleIconClick = () => {
    if (Icon === MdVisibility || Icon === MdVisibilityOff) {
      onIconClick();
    }
  };

  return (
    <div className="relative">
      {children}
      <div
        className="absolute inset-y-0 right-3 flex items-center text-gray-400"
        onClick={handleIconClick}
      >
        <Icon size={20} />
      </div>
    </div>
  );
});


const Registro = ({ setActiveTab }) => {
  const { showSnackbar } = useSnackbar();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);  
  const [showPassword, setShowPassword] = useState(false); 

  // Use useCallback to memoize the handleChange function for each input
  const handleNomeChange = useCallback((e) => setNome(e.target.value), []);
  const handleEmailChange = useCallback((e) => setEmail(e.target.value), []);
  const handleTelefoneChange = useCallback((e) => setTelefone(e.target.value), []);
  const handlePasswordChange = useCallback((e) => setPassword(e.target.value), []);
  const handleConfirmPasswordChange = useCallback((e) => setConfirmPassword(e.target.value), []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!nome) newErrors.nome = 'Nome é obrigatório';
    
    if (!email) newErrors.email = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'E-mail inválido';
    
    if (!password) newErrors.password = 'Senha é obrigatória';
    else if (password.length < 6) newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    
    if (!confirmPassword) newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem';
    
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
      await registrar(nome, email, telefone, password);      
      showSnackbar('Cadastro realizado com sucesso! Faça login para continuar.');
      setActiveTab('login'); 
      setNome('');
      setEmail('');
      setTelefone('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
          Nome
        </label>
        <IconInputWrapper Icon={MdPerson}>
          <input
            type="text"
            id="nome"
            name="nome"
            value={nome}
            onChange={handleNomeChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Seu nome"
          />
        </IconInputWrapper>
        {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
      </div>
      
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
        <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
          Telefone
        </label>
        <IconInputWrapper Icon={MdPhone}>
          <Cleave
            options={{
              delimiters: ['(', ') ', '-', ''],
              blocks: [0, 2, 5, 4],
              numericOnly: true,
            }}
            value={telefone}
            onChange={handleTelefoneChange}
            name="telefone"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="(00) 00000-0000"
          />
        </IconInputWrapper>
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
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirmar Senha
        </label>
        <IconInputWrapper Icon={showPassword ? MdVisibility : MdVisibilityOff} onIconClick={() => { setShowPassword(prevState => !prevState)}}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="******"
          />
        </IconInputWrapper>
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
      </div>
      
      {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}
      
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Processando...' : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
};

export default Registro;
