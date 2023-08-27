import ReactDOM from 'react-dom/client'

import "primereact/resources/primereact.min.css"; 

import App from './App.tsx'
import { ToastProvider } from './hooks/ToastHook.tsx';
import { SettingsProvider } from './hooks/SettingsHook.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ToastProvider>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </ToastProvider>
)