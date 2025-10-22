'use client';
import { createContext, useContext } from 'react';
type Dict = Record<string, string>;
const I18nCtx = createContext<Dict>({});
export function I18nProvider({ messages, children }: { messages: Dict; children: React.ReactNode }) {
  return <I18nCtx.Provider value={messages}>{children}</I18nCtx.Provider>;
}
export function useT() { const dict = useContext(I18nCtx); return (k: string) => dict[k] ?? k; }
