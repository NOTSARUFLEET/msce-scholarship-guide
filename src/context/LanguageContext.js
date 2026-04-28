import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = useCallback(() => {
    setLanguage((current) => (current === 'en' ? 'mr' : 'en'));
  }, []);

  const value = useMemo(
    () => ({
      language,
      isMarathi: language === 'mr',
      setLanguage,
      toggleLanguage,
      t: (copy) => copy?.[language] ?? copy?.en ?? '',
    }),
    [language, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
}
