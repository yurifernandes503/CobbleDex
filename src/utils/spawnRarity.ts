import { Rarity } from '../data/pokemon';

const CHANCE: Record<Rarity, string> = {
  common: '35%',
  uncommon: '18%',
  rare: '7%',
  epic: '3%',
  legendary: '0.5%',
};

export function getApproxSpawnChance(rarity: Rarity): string {
  return CHANCE[rarity] ?? CHANCE.common;
}

export type SpawnDifficultyTone = 'easy' | 'medium' | 'hard' | 'veryHard';

export function getSpawnDifficultyTone(rarity: Rarity): SpawnDifficultyTone {
  if (rarity === 'common') return 'easy';
  if (rarity === 'uncommon') return 'medium';
  if (rarity === 'rare' || rarity === 'epic') return 'hard';
  return 'veryHard';
}
