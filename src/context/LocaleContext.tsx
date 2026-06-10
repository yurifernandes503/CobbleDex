import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Locale, translate } from '../locales/messages';

const LOCALE_KEY = '@cobbledex/locale';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  cycleLocale: () => void;
  t: (key: string) => string;
  loading: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(LOCALE_KEY);
        if (raw === 'pt-BR' || raw === 'en') setLocaleState(raw);
      } catch {
        /* ignore */
      }
      setLoading(false);
    })();
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    AsyncStorage.setItem(LOCALE_KEY, l).catch(() => {});
  }, []);

  const cycleLocale = useCallback(() => {
    setLocaleState((prev) => {
      const next: Locale = prev === 'en' ? 'pt-BR' : 'en';
      AsyncStorage.setItem(LOCALE_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  const t = useCallback((key: string) => translate(locale, key), [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      cycleLocale,
      t,
      loading,
    }),
    [locale, setLocale, cycleLocale, t, loading]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
