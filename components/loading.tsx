import React, { createContext, useState, useContext } from "react";

interface LoadingContextProps {
  isLoading: boolean;
  toggleLoading: () => void;
}

/*
  Interface ve methods kısımları Ibrahim Arda ya aittir. Geri kalan kısımlar Ahmad Alhomsi ye aittir. 


*/

const LoadingContext = createContext<LoadingContextProps>({
  isLoading: false,
  toggleLoading: () => {},
});

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  const toggleLoading = () => setIsLoading(!isLoading);

  return (
    <LoadingContext.Provider value={{ isLoading, toggleLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
