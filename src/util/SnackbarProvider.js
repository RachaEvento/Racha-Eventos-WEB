import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const SnackbarContext = createContext();

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({ message: '', open: false });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const showSnackbar = useCallback((message) => {
    setSnackbar({ message, open: true });
    setTimeout(() => {
      setSnackbar({ message: '', open: false });
    }, 3000);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const snackbarStyle = {
    position: 'fixed',
    ...(isMobile ? { bottom: 20, top: 'auto' } : { top: 20, bottom: 'auto' }),
    right: 20,
    backgroundColor: '#323232',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: 5,
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbar.open && (
        <div data-testid="mensagem-snackbar" style={snackbarStyle}>
          {snackbar.message}
        </div>
      )}
    </SnackbarContext.Provider>
  );
};
