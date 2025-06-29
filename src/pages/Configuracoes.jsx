import React, { useState, useEffect } from 'react';
import Cleave from 'cleave.js/react';
import { useSnackbar } from '../util/SnackbarProvider';
import { atualizarUsuario, obterUsuarioLogado } from '../services/autenticacaoService';
import { getCleavePixOptions, telefoneOptions } from '../util/cleaveOptionsPix';
import { isValidEmail } from '../util/validadores';
import { TipoChavePix } from '../enum/TipoChavePix';

function Configuracoes() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    chavePix: '',
    numero: '',
    tipoChavePix: TipoChavePix.CPF,
  });

  const { showSnackbar } = useSnackbar();
  const pixOptions = getCleavePixOptions(form.tipoChavePix);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      if (name === 'tipoChavePix') {
        return { ...prev, tipoChavePix: Number(value), chavePix: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const limparChavePix = (tipo, valor) => {
    if ([TipoChavePix.CPF, TipoChavePix.CNPJ, TipoChavePix.Telefone].includes(tipo)) {
      return valor.replace(/\D/g, '');
    }
    return valor.trim();
  };

  const limparNumero = (text) => {
    return text ? text.replace(/\D/g, '') : '';
  };

  const handleSalvar = async () => {
    if (!isValidEmail(form.email)) {
      showSnackbar('Por favor, insira um e-mail válido.', 'error');
      return;
    }

    const chavePixLimpa = limparChavePix(form.tipoChavePix, form.chavePix);

    switch (form.tipoChavePix) {
      case TipoChavePix.CPF:
        if (chavePixLimpa.length !== 11) {
          showSnackbar('Por favor, insira um CPF válido.', 'error');
          return;
        }
        break;
      case TipoChavePix.CNPJ:
        if (chavePixLimpa.length !== 14) {
          showSnackbar('Por favor, insira um CNPJ válido.', 'error');
          return;
        }
        break;
      case TipoChavePix.Telefone:
        if (chavePixLimpa.length < 10 || chavePixLimpa.length > 11) {
          showSnackbar('Por favor, insira um número de telefone válido.', 'error');
          return;
        }
        break;
      default:
        break;
    }

    try {
      const numeroLimpo = limparNumero(form.numero);

      await atualizarUsuario({
        nome: form.nome,
        email: form.email,
        numero: numeroLimpo,
        chavePix: chavePixLimpa,
        tipoChavePix: form.tipoChavePix,
      });

      showSnackbar('Alterações salvas com sucesso!');
    } catch (error) {
      const mensagens = error.erros || [error.message || 'Erro ao salvar alterações'];
      mensagens.forEach((msg) => showSnackbar(msg, 'error'));
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
          tipoChavePix: usuario.tipoChavePix || TipoChavePix.CPF,
        });
      } catch (error) {
        showSnackbar(error.message || 'Erro ao carregar dados do usuário', 'error');
      }
    };

    fetchUsuario();
  }, [showSnackbar]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-10 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-black mb-2">Atualize suas informações</h2>
          <p className="text-lg text-gray-600 text-black">
            Gerencie suas credenciais de forma segura. Atualize seu nome, e-mail ou chave Pix a qualquer momento.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-black">Nome Completo</label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={form.nome}
              onChange={handleChange}
              placeholder="Seu nome completo"
              className="mt-1 block w-full px-4 py-3 text-black rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-[#3F9184] focus:border-[#3F9184]"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Seu e-mail"
              className="mt-1 block w-full px-4 py-3 text-black rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-[#3F9184] focus:border-[#3F9184]"
            />
          </div>

          {/* Tipo de Chave Pix */}
          <div>
            <label htmlFor="tipoChavePix" className="block text-sm font-medium text-black">Tipo de Chave Pix</label>
            <select
              id="tipoChavePix"
              name="tipoChavePix"
              value={form.tipoChavePix}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 text-black rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-[#3F9184] focus:border-[#3F9184]"
            >
              <option value={TipoChavePix.CPF}>CPF</option>
              <option value={TipoChavePix.CNPJ}>CNPJ</option>
              <option value={TipoChavePix.Telefone}>Telefone</option>
              <option value={TipoChavePix.Email}>E-mail</option>
              <option value={TipoChavePix.Aleatoria}>Aleatória</option>
            </select>
          </div>

          {/* Chave Pix */}
          <div>
            <label htmlFor="chavePix" className="block text-sm font-medium text-black">Chave Pix</label>
            {pixOptions ? (
              <Cleave
                key={form.tipoChavePix}
                id="chavePix"
                name="chavePix"
                value={form.chavePix}
                options={pixOptions}
                onChange={handleChange}
                placeholder="Sua chave Pix"
                className="mt-1 block w-full px-4 py-3 text-black rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-[#3F9184] focus:border-[#3F9184]"
              />
            ) : (
              <input
                key={form.tipoChavePix}
                id="chavePix"
                name="chavePix"
                type="text"
                value={form.chavePix}
                onChange={handleChange}
                placeholder="Sua chave Pix"
                className="mt-1 block w-full px-4 py-3 text-black rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-[#3F9184] focus:border-[#3F9184]"
              />
            )}
          </div>

          {/* Número */}
          <div>
            <label htmlFor="numero" className="block text-sm font-medium text-black">Número de Telefone</label>
            <Cleave
              id="numero"
              name="numero"
              value={form.numero}
              options={telefoneOptions}
              onChange={handleChange}
              placeholder="(99) 99999-9999"
              className="mt-1 block w-full px-4 py-3 text-black rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-[#3F9184] focus:border-[#3F9184]"
            />
          </div>
        </div>

        {/* Botão */}
        <div className="pt-6">
          <button
            onClick={handleSalvar}
            className="w-full py-4 px-6 bg-[#3F9184] hover:bg-[#34766b] text-white text-lg font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3F9184] transition"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}

export default Configuracoes;
