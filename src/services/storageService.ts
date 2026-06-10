import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  FAVORITES: '@cobbledex/favorites',
  RECENT: '@cobbledex/recent',
  TEAMS: '@cobbledex/teams',
} as const;

export async function getStoredJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function setStoredJson<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // offline / quota — fail silently
  }
}

export async function getFavorites(): Promise<number[]> {
  return getStoredJson(KEYS.FAVORITES, []);
}

export async function setFavorites(ids: number[]): Promise<void> {
  return setStoredJson(KEYS.FAVORITES, ids);
}

export async function getRecent(): Promise<number[]> {
  return getStoredJson(KEYS.RECENT, []);
}

export async function setRecent(ids: number[]): Promise<void> {
  return setStoredJson(KEYS.RECENT, ids);
}

export async function getTeamSlots(): Promise<(number | null)[]> {
  const team = await getStoredJson<(number | null)[]>(KEYS.TEAMS, []);
  if (team.length === 6) return team;
  return Array(6).fill(null) as (number | null)[];
}

export async function setTeamSlots(slots: (number | null)[]): Promise<void> {
  return setStoredJson(KEYS.TEAMS, slots);
}
