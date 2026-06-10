import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as storage from '../services/storageService';
import { playSound, isSoundEnabled } from '../services/soundService';

interface FavoritesContextValue {
  favorites: number[];
  recent: number[];
  loading: boolean;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
  addRecent: (id: number) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [recent, setRecent] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [fav, rec] = await Promise.all([
        storage.getFavorites(),
        storage.getRecent(),
      ]);
      setFavorites(fav);
      setRecent(rec);
      setLoading(false);
    })();
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const adding = !prev.includes(id);
      const next = adding ? [...prev, id] : prev.filter((x) => x !== id);
      storage.setFavorites(next);
      if (isSoundEnabled()) playSound(adding ? 'favorite' : 'tap');
      return next;
    });
  }, []);

  const addRecent = useCallback((id: number) => {
    setRecent((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 12);
      storage.setRecent(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites]
  );

  const value = useMemo(
    () => ({
      favorites,
      recent,
      loading,
      isFavorite,
      toggleFavorite,
      addRecent,
    }),
    [favorites, recent, loading, isFavorite, toggleFavorite, addRecent]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavoritesContext must be used within FavoritesProvider');
  return ctx;
}
