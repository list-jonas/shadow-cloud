import { Toast } from "primereact/toast";
import React, { useCallback, useContext, useRef, ReactNode } from "react";

type ToastContextType = {
  showSuccess: (summary: string, detail: string) => void;
  showInfo: (summary: string, detail: string) => void;
  showWarn: (summary: string, detail: string) => void;
  showError: (summary: string, detail: string) => void;
};


export const ToastContext = React.createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(`useToast must be used within a ToastProvider`);
  }

  return context;
}

type ToastProviderProps = {
  children: ReactNode;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const toast = useRef<Toast>(null);

  const showSuccess = useCallback((summary: string, detail: string) => {
    // @ts-ignore
    toast.current.show({ severity: 'success', summary, detail, life: 2000 });
  }, []);

  const showInfo = useCallback((summary: string, detail: string) => {
    // @ts-ignore
    toast.current.show({ severity: 'info', summary, detail, life: 2000 });
  }, []);

  const showWarn = useCallback((summary: string, detail: string) => {
    // @ts-ignore
    toast.current.show({ severity: 'warn', summary, detail, life: 4000 });
  }, []);

  const showError = useCallback((summary: string, detail: string) => {
    // @ts-ignore
    toast.current.show({ severity: 'error', summary, detail, life: 2000 });
  }, []);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo, showWarn }}>
      {children}
      <Toast ref={toast} />
    </ToastContext.Provider>
  );
};