import React, { useState, useEffect } from 'react';
import { useSnackbar } from '../util/SnackbarProvider';
import { atualizarUsuario, obterUsuarioLogado } from '../services/autenticacaoService'; 
import InputMask from 'react-input-mask';
import { getMaskPix } from '../util/masks';
import { isValidEmail } from '../util/validadores';

function Configuracoes() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    chavePix: '',
    numero: '',
    tipoChavePix: 1,
  });
  const { showSnackbar } = useSnackbar();
  const mask = getMaskPix(form.tipoChavePix);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
    if (name === 'tipoChavePix') {
      return {
        ...prev,
        tipoChavePix: Number(form.tipoChavePix),
        chavePix: '',
      };
    }
    return { ...prev, [name]: value };
  });
  };

  function limparMascara(text) {
  if (!text) return '';
  return text.replace(/[^a-zA-Z0-9]/g, '');
  }

  const handleSalvar = async () => {
  if (!isValidEmail(form.email)) {
    showSnackbar('Por favor, insira um e-mail válido.', 'error');
    return;
  }
  try {
    const chavePixLimpa = limparMascara(form.chavePix);

    await atualizarUsuario({
      nome: form.nome,
      email: form.email,
      numero: form.numero,
      chavePix: chavePixLimpa,
      tipoChavePix: form.tipoChavePix,
    });

    showSnackbar('Alterações salvas com sucesso!');
  } catch (error) {
    if (error.erros && Array.isArray(error.erros) && error.erros.length > 0) {
      error.erros.forEach((msg) => showSnackbar(msg, 'error'));
    } else {
      showSnackbar(error.message || 'Erro ao salvar alterações', 'error');
    }
  }
};

  


  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const usuario = await obterUsuarioLogado();
        setForm({
          nome: usuario.nome || '',
          email: usuario.email || '',
          chavePix: usuario.chavePix || '',
          numero: usuario.numero || '',
          tipoChavePix: usuario.tipoChavePix || 1,
        });
      } catch (error) {
        showSnackbar(error.message || 'Erro ao carregar dados do usuário', 'error');
      }
    };

    fetchUsuario();
  }, [showSnackbar]);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-16 px-6 lg:px-8">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-12">
        <h2 className="text-4xl font-semibold text-gray-800 text-center mb-6">
          Atualize suas Informações
        </h2>
        <p className="text-lg text-gray-600 text-center mb-10">
          Gerencie suas credenciais de forma segura. Atualize seu nome, e-mail ou chave Pix a qualquer momento.
        </p>

        <div className="space-y-8">
          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={form.nome}
              onChange={handleChange}
              placeholder="Insira seu nome completo"
              className="mt-2 block w-full px-5 py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#3F9184] focus:border-[#3F9184] placeholder-gray-500 text-black"
            />
          </div>

          {/* E-mail */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Insira seu e-mail"
              className="mt-2 block w-full px-5 py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#3F9184] focus:border-[#3F9184] placeholder-gray-500 text-black"
            />
          </div>
          
          {/* Tipo de chave Pix */}
          <div>
            <label htmlFor="tipoChavePix" className="block text-sm font-medium text-gray-700">Tipo de Chave Pix</label>
            <select
              id="tipoChavePix"
              name="tipoChavePix"
              value={form.tipoChavePix}
              onChange={handleChange}
              className="mt-2 block w-full px-5 py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#3F9184] focus:border-[#3F9184] placeholder-gray-500 bg-white text-black"
            >
              <option value={1}>CPF</option>
              <option value={2}>CNPJ</option>
              <option value={3}>Telefone</option>
              <option value={4}>E-mail</option>
              <option value={5}>Aleatória</option>
            </select>
          </div>
          
          {/* Chave Pix */}
          <div>
            <label htmlFor="chavePix" className="block text-sm font-medium text-gray-700">Chave Pix</label>
            
            {mask ? (
              <InputMask
                id="chavePix"
                name="chavePix"
                mask={mask}
                value={form.chavePix}
                onChange={handleChange}
                placeholder="Insira sua chave Pix"
                className="mt-2 block w-full px-5 py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#3F9184] focus:border-[#3F9184] placeholder-gray-500 text-black"
              />
            ) : (
              <input
                id="chavePix"
                name="chavePix"
                type="text"
                value={form.chavePix}
                onChange={handleChange}
                placeholder="Insira sua chave Pix"
                className="mt-2 block w-full px-5 py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#3F9184] focus:border-[#3F9184] placeholder-gray-500 text-black"
              />
            )}
          </div>


          {/* Número de telefone */}
          <div>
            <label htmlFor="numero" className="block text-sm font-medium text-gray-700">Número de Telefone</label>
            <InputMask
              id="numero"
              name="numero"
              type="text"
              mask="(99) 99999-9999"
              value={form.numero}
              onChange={handleChange}
              placeholder="Insira seu número"
              className="mt-2 block w-full px-5 py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#3F9184] focus:border-[#3F9184] placeholder-gray-500 text-black"
            />
          </div>

          {/* Botão Salvar */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleSalvar}
              className="w-full py-4 px-6 bg-[#3F9184] text-white font-semibold rounded-lg shadow-md hover:bg-[#34766b] focus:outline-none focus:ring-2 focus:ring-[#34766b] focus:ring-opacity-50 transition-all"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configuracoes;
