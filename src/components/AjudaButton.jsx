import { FiHelpCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AjudaButton = () => {
  const navigate = useNavigate();

  const abrirDocumentacao = () => {
    navigate('/documentacao');
  };

  return (
    <button
      onClick={abrirDocumentacao}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        backgroundColor: '#1976d2',
        color: '#fff',
        borderRadius: '50%',
        width: '48px',
        height: '48px',
        border: 'none',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        fontSize: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label="Ajuda"
      title="Ajuda"
    >
      <FiHelpCircle />
    </button>
  );
};

export default AjudaButton;
