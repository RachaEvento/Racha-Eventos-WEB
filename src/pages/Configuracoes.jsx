import React, { useState } from 'react';

function Configuracoes() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    chavePix: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvar = () => {
    console.log('Dados salvos:', form);
    // Lógica de envio para API
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-16 px-6 lg:px-8">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-12">
        <h2 className="text-4xl font-semibold text-gray-800 text-center mb-6">
          Atualize suas Informações
        </h2>
        <p className="text-lg text-gray-600 text-center mb-10">
          Gerencie suas credenciais de forma segura. Atualize seu nome, e-mail, senha ou chave Pix a qualquer momento.
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
              className="mt-2 block w-full px-5 py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#3F9184] focus:border-[#3F9184] placeholder-gray-500"
            />
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Nova Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              value={form.senha}
              onChange={handleChange}
              placeholder="Insira uma nova senha"
              className="mt-2 block w-full px-5 py-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#3F9184] focus:border-[#3F9184] placeholder-gray-500"
            />
          </div>

          {/* Chave Pix */}
          <div>
            <label htmlFor="chavePix" className="block text-sm font-medium text-gray-700">Chave Pix</label>
            <input
              id="chavePix"
              name="chavePix"
              type="text"
              value={form.chavePix}
              onChange={handleChange}
              placeholder="Insira sua chave Pix"
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
