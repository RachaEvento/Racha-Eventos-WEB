import { useEffect } from 'react';
import 'github-markdown-css'; 

const DocumentacaoPage = () => {
  useEffect(() => {
    window.location.href = `${window.location.origin}/documentacao.html`;
  }, []);

  return null;
};

export default DocumentacaoPage;
