import React from 'react';
import TabelaParticipantes from './TabelaParticipantes';

const EventoParticipantes = ({ evento }) => {
  
  return (
    <div className="">
      <div className="">
        <TabelaParticipantes eventoId={evento.id} />
      </div>
    </div>
  );
};

export default EventoParticipantes;
