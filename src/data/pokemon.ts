export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export type Biome =
  | 'forest'
  | 'plains'
  | 'mountain'
  | 'cave'
  | 'ocean'
  | 'river'
  | 'desert'
  | 'swamp'
  | 'tundra'
  | 'volcanic'
  | 'jungle'
  | 'meadow';

export type SpawnTime = 'day' | 'night' | 'dawn' | 'dusk' | 'any';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Evolution {
  id: number;
  name: string;
  level?: number;
  item?: string;
  condition?: string;
}

export interface Move {
  name: string;
  type: PokemonType;
  power: number | null;
  accuracy: number | null;
  level?: number;
}

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  primaryType: PokemonType;
  secondaryType?: PokemonType;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  spawnBiome: Biome;
  spawnTime: SpawnTime;
  rarity: Rarity;
  evolutions: Evolution[];
  moves: Move[];
  description: string;
}

export interface TeamSlot {
  pokemonId: number | null;
}
