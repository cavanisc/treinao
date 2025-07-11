import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Settings {
  weeklyGoal: number;
  restTimerSound: boolean;
  autoNextExercise: boolean;
  darkMode: boolean;
}

interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const defaultSettings: Settings = {
  weeklyGoal: 4,
  restTimerSound: true,
  autoNextExercise: false,
  darkMode: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Carrega as configurações do localStorage quando o Provider é montado
  useEffect(() => {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  // Salva no localStorage sempre que settings mudar
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  // Aplica ou remove classe dark conforme settings.darkMode
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Hook customizado para usar as configurações com facilidade
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings deve ser usado dentro do SettingsProvider');
  }
  return context;
};
