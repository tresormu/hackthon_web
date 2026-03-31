import { useContext } from 'react';
import { MamaCareContext } from './MamaCareContext';
import type { ContextType } from './MamaCareContext';

export const useMamaCare = (): ContextType => {
  const context = useContext(MamaCareContext);
  if (!context) throw new Error('useMamaCare must be used within Provider');
  return context;
};
