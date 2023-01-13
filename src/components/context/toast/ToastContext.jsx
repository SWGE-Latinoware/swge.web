import React, {
  createContext, useCallback, useContext, useState,
} from 'react';
import ToastContainer from './ToastContainer';

const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState({
    id: null,
    title: null,
    body: null,
    type: null,
  });

  const addToast = useCallback(({ title, body, type }) => {
    setMessage({
      id: Math.random(),
      title,
      body,
      type, // info, success, error, warning
    });
  }, []);

  return (
    <ToastContext.Provider
      value={{ addToast }}
    >
      {message.body && <ToastContainer key={message.id} title={message.title} message={message.body} type={message.type} />}
      {children}
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

export { ToastProvider, useToast };
