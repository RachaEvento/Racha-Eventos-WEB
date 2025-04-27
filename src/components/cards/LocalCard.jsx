import React from 'react';
import { MdPlace } from 'react-icons/md';
 
 const LocalCard = ({nome, endereco, descricaoLocal, bairro, cidade, estado, onClick}) => { 
   return (
    <div
      onClick={onClick}
      className="cursor-pointer flex flex-col items-center justify-center bg-white border border-[#3e8682] rounded-lg w-full aspect-square shadow hover:shadow-md"
    >
      <div className="w-1/2 h-1/2 rounded-full bg-[#55c6b1] flex items-center justify-center mb-4">
        <MdPlace size={48} className="text-white" />
      </div>
      <span className="text-[#264f57] font-semibold mb-1 text-center">{nome}</span>
    </div>
   );
 };
 
 export default LocalCard;