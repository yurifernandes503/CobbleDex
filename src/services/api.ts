import axios from 'axios';

const API_BASE = 'https://pokeapi.co/api/v2';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { Accept: 'application/json' },
});

/** Optional online enrichment — app works fully offline via local DB */
export async function fetchPokemonSummary(id: number) {
  const { data } = await api.get(`/pokemon/${id}`);
  return data;
}
