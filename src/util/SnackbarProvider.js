import React, { createContext, useState, useContext, useCallback } from 'react';

// Create a Snackbar context
const SnackbarContext = createContext();

// Create a custom hook to access the Snackbar service
export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({ message: '', open: false });

  const showSnackbar = useCallback((message) => {
    setSnackbar({ message, open: true });
    setTimeout(() => {
      setSnackbar({ message: '', open: false });
    }, 3000); // Snackbar disappears after 3 seconds
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbar.open && (
        <div style={styles.snackbar}>
          {snackbar.message}
        </div>
      )}
    </SnackbarContext.Provider>
  );
};

const styles = {
  snackbar: {
    position: 'fixed',
    top: 20,
    right: 20,
    backgroundColor: '#323232',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: 5,
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
  },
};
