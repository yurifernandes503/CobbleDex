import { PokemonType } from '../data/pokemon';
import { getEffectiveness, getResistances, getWeaknesses } from '../data/typeChart';

export { getEffectiveness, getResistances, getWeaknesses };

export function getEffectivenessLabel(multiplier: number): string {
  if (multiplier === 0) return 'No effect';
  if (multiplier >= 4) return '4× Super effective';
  if (multiplier >= 2) return '2× Super effective';
  if (multiplier <= 0.25) return '¼× Not very effective';
  if (multiplier < 1) return '½× Not very effective';
  return '1× Normal';
}

export function getTypeMatchups(types: PokemonType[]) {
  return {
    weaknesses: getWeaknesses(types),
    resistances: getResistances(types),
  };
}
