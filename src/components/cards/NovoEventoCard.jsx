import React from "react";
import { MdEvent } from "react-icons/md";

function NovoEventoCard({ nome, local, data, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex flex-col items-center justify-center bg-white border border-[#3e8682] rounded-2xl w-full shadow-md hover:shadow-lg transition duration-200 p-4"
    >
      <div className="w-20 h-20 rounded-full bg-[#55c6b1] flex items-center justify-center mb-3">
        <MdEvent size={40} className="text-white" />
      </div>
      <div className="text-center">
        <h3 className="text-[#264f57] font-semibold text-lg">{nome}</h3>
        {local && (
          <p className="text-[#264f57] text-sm mt-1">{local}</p>
        )}
        {data && (
          <p className="text-[#264f57] text-sm">{data}</p>
        )}
      </div>
    </div>
  );
}

export default NovoEventoCard;
