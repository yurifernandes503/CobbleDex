import { Pokemon, PokemonType } from '../data/pokemon';
import { getEffectiveness, getWeaknesses } from '../data/typeChart';

export interface TeamAnalysis {
  types: PokemonType[];
  duplicateTypes: PokemonType[];
  /** Types that appear on 3+ typings (high stacking risk) */
  heavyStackedTypes: PokemonType[];
  /** Human-readable warning when team is overloaded on one type */
  sameTypeHeavyWarning: string | null;
  weaknesses: { type: PokemonType; count: number }[];
  strengths: PokemonType[];
  coverage: PokemonType[];
  suggestions: string[];
  score: number;
}

export function analyzeTeam(members: (Pokemon | null)[]): TeamAnalysis {
  const team = members.filter((p): p is Pokemon => p !== null);
  const allTypes: PokemonType[] = team.flatMap((p) =>
    [p.primaryType, p.secondaryType].filter(Boolean) as PokemonType[]
  );

  const typeCount = new Map<PokemonType, number>();
  allTypes.forEach((t) => typeCount.set(t, (typeCount.get(t) ?? 0) + 1));
  const duplicateTypes = [...typeCount.entries()]
    .filter(([, c]) => c > 1)
    .map(([t]) => t);

  const heavyStackedTypes = [...typeCount.entries()]
    .filter(([, c]) => c >= 3)
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t);

  let sameTypeHeavyWarning: string | null = null;
  if (heavyStackedTypes.length > 0) {
    const [t] = heavyStackedTypes;
    const n = typeCount.get(t) ?? 0;
    sameTypeHeavyWarning = `Your squad stacks ${t} on ${n} typings — one super-effective sweep can chain through multiple slots.`;
  }

  const weaknessMap = new Map<PokemonType, number>();
  team.forEach((p) => {
    const types = [p.primaryType, p.secondaryType].filter(Boolean) as PokemonType[];
    getWeaknesses(types).forEach((w) => {
      weaknessMap.set(w, (weaknessMap.get(w) ?? 0) + 1);
    });
  });

  const weaknesses = [...weaknessMap.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  const attackTypes = [...new Set(allTypes)];
  const coverage = attackTypes.filter((atk) =>
    team.some((def) => {
      const defTypes = [def.primaryType, def.secondaryType].filter(Boolean) as PokemonType[];
      return getEffectiveness(atk, defTypes) >= 2;
    })
  );

  const suggestions: string[] = [];
  if (team.length < 6) {
    suggestions.push(`Add ${6 - team.length} more Cobblemon to complete your squad.`);
  }
  if (duplicateTypes.length > 0) {
    suggestions.push(
      `Consider diversifying: overlapping ${duplicateTypes.join(', ')} typings reduce defensive spread.`
    );
  }
  if (heavyStackedTypes.length > 0) {
    suggestions.push(
      `Swap at least one ${heavyStackedTypes[0]} slot for a resist partner (steel, water, or fairy often help).`
    );
  }
  if (weaknesses[0] && weaknesses[0].count >= 3) {
    suggestions.push(
      `Three or more members are weak to ${weaknesses[0].type.toUpperCase()} — add a dedicated check or dual-type wall.`
    );
  } else if (weaknesses[0] && weaknesses[0].count === 2) {
    suggestions.push(
      `Watch ${weaknesses[0].type.toUpperCase()} coverage — two members are weak; pivot leads with resist typings.`
    );
  }
  if (!allTypes.includes('water') && !allTypes.includes('grass')) {
    suggestions.push('Water or Grass types improve biome coverage for early-game routes.');
  }
  if (team.length >= 4 && attackTypes.length < 4) {
    suggestions.push('Broaden move type coverage for balanced offense.');
  }
  if (suggestions.length === 0 && team.length === 6) {
    suggestions.push('Solid lineup! Fine-tune movesets for raid-style encounters.');
  }

  const score = Math.min(
    100,
    Math.round(
      team.length * 12 +
        attackTypes.length * 5 -
        duplicateTypes.length * 8 -
        heavyStackedTypes.length * 10 -
        (weaknesses[0]?.count ?? 0) * 5
    )
  );

  return {
    types: attackTypes,
    duplicateTypes,
    heavyStackedTypes,
    sameTypeHeavyWarning,
    weaknesses,
    strengths: attackTypes.slice(0, 4),
    coverage,
    suggestions,
    score: Math.max(0, score),
  };
}
