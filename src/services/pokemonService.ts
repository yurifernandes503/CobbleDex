import { Biome, Pokemon, PokemonType, Rarity } from '../data/pokemon';
import { POKEMON_DATABASE } from '../data/gen1Database';

export interface PokemonFilters {
  search?: string;
  type?: PokemonType | 'all';
  biome?: Biome | 'all';
  rarity?: Rarity | 'all';
}

let cache: Pokemon[] | null = null;

export function getAllPokemon(): Pokemon[] {
  if (!cache) cache = POKEMON_DATABASE;
  return cache;
}

export function getPokemonById(id: number): Pokemon | undefined {
  return getAllPokemon().find((p) => p.id === id);
}

export function filterPokemon(filters: PokemonFilters): Pokemon[] {
  const { search = '', type = 'all', biome = 'all', rarity = 'all' } = filters;
  const q = search.trim().toLowerCase();

  return getAllPokemon().filter((p) => {
    if (q && !p.name.toLowerCase().includes(q) && !String(p.id).includes(q)) {
      return false;
    }
    if (type !== 'all' && p.primaryType !== type && p.secondaryType !== type) {
      return false;
    }
    if (biome !== 'all' && p.spawnBiome !== biome) return false;
    if (rarity !== 'all' && p.rarity !== rarity) return false;
    return true;
  });
}

export function getFeaturedPokemon(count = 6): Pokemon[] {
  const all = getAllPokemon();
  const legendaries = all.filter((p) => p.rarity === 'legendary' || p.rarity === 'epic');
  const starters = all.filter((p) => [1, 4, 7, 25, 133, 150].includes(p.id));
  const mixed = [...starters, ...legendaries.slice(0, 3)];
  return mixed.slice(0, count);
}

export function getPokemonByType(type: PokemonType): Pokemon[] {
  return getAllPokemon().filter(
    (p) => p.primaryType === type || p.secondaryType === type
  );
}

export function getAllTypes(): PokemonType[] {
  const types = new Set<PokemonType>();
  getAllPokemon().forEach((p) => {
    types.add(p.primaryType);
    if (p.secondaryType) types.add(p.secondaryType);
  });
  return [...types].sort();
}

/** Rare / epic / legendary — for home showcase */
export function getRareCobblemon(limit = 12): Pokemon[] {
  return getAllPokemon()
    .filter((p) => p.rarity === 'rare' || p.rarity === 'epic' || p.rarity === 'legendary')
    .sort((a, b) => {
      const order: Rarity[] = ['legendary', 'epic', 'rare'];
      return order.indexOf(a.rarity) - order.indexOf(b.rarity) || a.id - b.id;
    })
    .slice(0, limit);
}

/** Representative Cobblemon per biome for discovery row */
export function getSpotlightByBiome(biome: Biome): Pokemon | undefined {
  return getAllPokemon().find((p) => p.spawnBiome === biome);
}
