import { createContext, useContext } from 'react';
import * as api from '../utils/useApiMovies';

export const ApiContext = createContext();

export function ApiProvider({ children }) {
  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  return useContext(ApiContext);
}
