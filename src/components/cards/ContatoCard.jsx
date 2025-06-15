import React from "react";
import { MdPerson } from "react-icons/md";
import { isValidEmail } from "../../util/validadores";

function ContatoCard({ nome, email, telefone, fotoBase64, onClick, mostrarErro }) {
  const emailValido = isValidEmail(email);

  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex flex-col items-center justify-center bg-white border border-[#3e8682] rounded-lg w-full aspect-square shadow hover:shadow-md p-4"
    >
      <div className="w-20 h-20 rounded-full bg-[#55c6b1] flex items-center justify-center mb-4 overflow-hidden">
      {fotoBase64 && fotoBase64.startsWith('data:image') ? (
        <img
          src={fotoBase64}
          alt="Foto do contato"
          className="w-full h-full object-cover"
        />
      ) : (
        <MdPerson size={48} className="text-white" />
      )}
      </div>

      <span className="text-[#264f57] font-semibold mb-1 text-center truncate w-full">{nome}</span>

      {mostrarErro && !emailValido && (
        <span className="text-red-500 text-sm text-center">E-mail inválido</span>
      )}
    </div>
  );
}

export default ContatoCard;
