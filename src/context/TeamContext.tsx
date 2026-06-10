import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getPokemonById } from '../services/pokemonService';
import * as storage from '../services/storageService';
import { Pokemon } from '../data/pokemon';
import { analyzeTeam, TeamAnalysis } from '../utils/teamAnalysis';

interface TeamContextValue {
  slots: (number | null)[];
  members: (Pokemon | null)[];
  analysis: TeamAnalysis;
  loading: boolean;
  setSlot: (index: number, pokemonId: number | null) => void;
  clearTeam: () => void;
}

const TeamContext = createContext<TeamContextValue | null>(null);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [slots, setSlots] = useState<(number | null)[]>(Array(6).fill(null));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storage.getTeamSlots().then((t) => {
      setSlots(t);
      setLoading(false);
    });
  }, []);

  const setSlot = useCallback((index: number, pokemonId: number | null) => {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = pokemonId;
      storage.setTeamSlots(next);
      return next;
    });
  }, []);

  const clearTeam = useCallback(() => {
    const empty = Array(6).fill(null) as (number | null)[];
    setSlots(empty);
    storage.setTeamSlots(empty);
  }, []);

  const members = useMemo(
    () => slots.map((id) => (id ? getPokemonById(id) ?? null : null)),
    [slots]
  );

  const analysis = useMemo(() => analyzeTeam(members), [members]);

  const value = useMemo(
    () => ({
      slots,
      members,
      analysis,
      loading,
      setSlot,
      clearTeam,
    }),
    [slots, members, analysis, loading, setSlot, clearTeam]
  );

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeamContext() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error('useTeamContext must be used within TeamProvider');
  return ctx;
}
