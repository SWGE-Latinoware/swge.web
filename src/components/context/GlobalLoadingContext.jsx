import React, { createContext, useContext, useState } from 'react';

const GlobalLoadingContext = createContext();

const GlobalLoadingProvider = ({
  children,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [isBlocking, setBlocking] = useState(false);
  const [isBreaking, setBreaking] = useState(false);

  return (
    <GlobalLoadingContext.Provider
      value={{
        isBlocking,
        setBlocking,
        isLoading,
        setLoading,
        isBreaking,
        setBreaking,
      }}
    >
      {children}
    </GlobalLoadingContext.Provider>
  );
};

const useGlobalLoading = () => {
  const context = useContext(GlobalLoadingContext);

  if (!context) {
    throw new Error('useGlobalLoading must be used within an GlobalLoadingProvider');
  }

  return context;
};

export {
  GlobalLoadingProvider, useGlobalLoading,
};
