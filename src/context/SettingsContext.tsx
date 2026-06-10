import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initSoundService, playSound, setSoundEnabled } from '../services/soundService';

const SOUND_KEY = '@cobbledex/soundEnabled';

interface SettingsContextValue {
  soundEnabled: boolean;
  loading: boolean;
  toggleSound: () => void;
  play: (name: 'tap' | 'select' | 'favorite' | 'success') => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await initSoundService();
      try {
        const raw = await AsyncStorage.getItem(SOUND_KEY);
        const enabled = raw === null ? true : raw === 'true';
        setSoundEnabledState(enabled);
        setSoundEnabled(enabled);
      } catch {
        setSoundEnabled(true);
      }
      setLoading(false);
    })();
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabledState((prev) => {
      const next = !prev;
      setSoundEnabled(next);
      AsyncStorage.setItem(SOUND_KEY, String(next));
      if (next) playSound('tap');
      return next;
    });
  }, []);

  const play = useCallback(
    (name: 'tap' | 'select' | 'favorite' | 'success') => {
      if (soundEnabled) playSound(name);
    },
    [soundEnabled]
  );

  const value = useMemo(
    () => ({
      soundEnabled,
      loading,
      toggleSound,
      play,
    }),
    [soundEnabled, loading, toggleSound, play]
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
