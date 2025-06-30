import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import 'github-markdown-css'; 

const DocumentacaoPage = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch('/documentacao.md')
      .then((res) => res.text())
      .then((text) => setMarkdown(text))
      .catch((err) => console.error('Erro ao carregar Markdown:', err));
  }, []);

  return (
    <div className="markdown-body" style={{ padding: '2rem' }}>
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
};


export default DocumentacaoPage;
