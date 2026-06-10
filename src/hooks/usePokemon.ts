import { useMemo } from 'react';
import { PokemonFilters, filterPokemon, getPokemonById } from '../services/pokemonService';

export function usePokemonList(filters: PokemonFilters) {
  return useMemo(() => filterPokemon(filters), [filters.search, filters.type, filters.biome, filters.rarity]);
}

export function usePokemon(id: number | undefined) {
  return useMemo(() => (id ? getPokemonById(id) : undefined), [id]);
}
