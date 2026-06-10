import { PokemonType } from '../data/pokemon';

export const palette = {
  background: '#0a0e17',
  backgroundElevated: '#12182a',
  backgroundCard: '#161f35',
  surface: '#1c2744',
  border: '#2a3a5c',
  borderGlow: '#3d5a9a',
  text: '#e8edf7',
  textSecondary: '#8b9dc3',
  textMuted: '#5c6d8f',
  accent: '#00e5ff',
  accentSecondary: '#7c4dff',
  success: '#00e676',
  warning: '#ffab00',
  danger: '#ff5252',
  white: '#ffffff',
  black: '#000000',
};

export const typeColors: Record<PokemonType, { primary: string; glow: string; dark: string }> = {
  normal: { primary: '#A8A878', glow: '#C6C6A7', dark: '#6D6D4E' },
  fire: { primary: '#F08030', glow: '#FF9C5B', dark: '#9C531F' },
  water: { primary: '#6890F0', glow: '#8BA8FF', dark: '#44578E' },
  grass: { primary: '#78C850', glow: '#9AE66B', dark: '#4E8234' },
  electric: { primary: '#F8D030', glow: '#FFE566', dark: '#A1871F' },
  ice: { primary: '#98D8D8', glow: '#B8F0F0', dark: '#638D8D' },
  fighting: { primary: '#C03028', glow: '#E85A52', dark: '#7D1F1A' },
  poison: { primary: '#A040A0', glow: '#C85AC8', dark: '#692A69' },
  ground: { primary: '#E0C068', glow: '#F5DA8A', dark: '#927D44' },
  flying: { primary: '#A890F0', glow: '#C8B4FF', dark: '#6D5E9E' },
  psychic: { primary: '#F85888', glow: '#FF8AB0', dark: '#A13959' },
  bug: { primary: '#A8B820', glow: '#C8DC40', dark: '#6D7815' },
  rock: { primary: '#B8A038', glow: '#D8C058', dark: '#786820' },
  ghost: { primary: '#705898', glow: '#9478C0', dark: '#493963' },
  dragon: { primary: '#7038F8', glow: '#9B6FFF', dark: '#4924A1' },
  dark: { primary: '#705848', glow: '#947868', dark: '#49392F' },
  steel: { primary: '#B8B8D0', glow: '#D8D8F0', dark: '#787887' },
  fairy: { primary: '#EE99AC', glow: '#FFB8CC', dark: '#9B636F' },
};

export const biomeLabels: Record<string, string> = {
  forest: 'Forest',
  plains: 'Plains',
  mountain: 'Mountain',
  cave: 'Cave',
  ocean: 'Ocean',
  river: 'River',
  desert: 'Desert',
  swamp: 'Swamp',
  tundra: 'Tundra',
  volcanic: 'Volcanic',
  jungle: 'Jungle',
  meadow: 'Meadow',
};

export const rarityColors: Record<string, string> = {
  common: '#8b9dc3',
  uncommon: '#00e676',
  rare: '#00e5ff',
  epic: '#7c4dff',
  legendary: '#ffab00',
};
