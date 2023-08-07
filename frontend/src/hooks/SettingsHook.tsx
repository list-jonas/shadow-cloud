import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './ToastHook';
import themesData from '../data/themeData';

// Adding a setting requires the addition of that setting inside the type as well as the default setting const

type SettingsState = {
  theme: string;
  email?: string;
  userId?: number;
  admin?: boolean;
  si: boolean;
};

const defaultSettings: SettingsState = {
  theme: Object.keys(themesData)[0],
  si: true,
};

type SettingsContextProps = {
  settings: SettingsState;
  updateSettings: (update: Partial<SettingsState>) => void;
}

// Create a Context object.
const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

// Create a Provider component.
export const SettingsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const { showError } = useToast();

  const loadSettings = (): SettingsState => {
    try {
      const item = window.localStorage.getItem('settings');
      return item ? JSON.parse(item) : defaultSettings;
    } catch (error) {
      showError("Error", "Failed to load settings" + error);
      console.error("Failed to load settings", error);
      return defaultSettings;
    }
  };

  const saveSettings = (settings: SettingsState) => {
    try {
      window.localStorage.setItem('settings', JSON.stringify(settings));
    } catch (error) {
      showError("Error", "Failed to save settings" + error);
      console.error("Failed to save settings", error);
    }
  };

  const [settings, setSettings] = useState<SettingsState>(loadSettings);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateSettings = (update: Partial<SettingsState>) => {
    setSettings((currentSettings: SettingsState) => {
      let changeMessages: string[] = [];
      let updatedSettings = { ...currentSettings };
  
      for (let key in update) {
        // @ts-ignore
        if (update[key] !== undefined && currentSettings[key] !== update[key]) {
          // @ts-ignore
          updatedSettings[key] = update[key];
          // @ts-ignore
          changeMessages.push(`${key} was changed from ${currentSettings[key]} to ${update[key]}`);
        }
      }
  
      saveSettings(updatedSettings);
      return updatedSettings;
    });
  };  
  

  
  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Create a hook to use the context
export const useSettingsContext = (): SettingsContextProps => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
}