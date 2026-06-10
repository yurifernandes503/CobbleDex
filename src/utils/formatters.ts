export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatPokemonId(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}

export function formatStat(value: number): string {
  return String(value);
}
