import React, { useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, FlatList, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../components/ui/AppText';
import { SearchBar } from '../components/ui/SearchBar';
import { PokemonCard } from '../components/pokemon/PokemonCard';
import { FilterChips } from '../components/pokemon/FilterChips';
import { EmptyState } from '../components/ui/EmptyState';
import { useFavoritesContext } from '../context/FavoritesContext';
import { usePokemonList } from '../hooks/usePokemon';
import { getAllTypes } from '../services/pokemonService';
import { Biome, PokemonType, Rarity } from '../data/pokemon';
import { biomeLabels, palette } from '../styles/colors';
import { theme } from '../styles/theme';
import { MainTabScreenProps } from '../routes/types';

const BIOME_OPTIONS: { label: string; value: Biome | 'all' }[] = [
  { label: 'All Biomes', value: 'all' },
  ...Object.entries(biomeLabels).map(([value, label]) => ({
    label,
    value: value as Biome,
  })),
];

const RARITY_OPTIONS: { label: string; value: Rarity | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Common', value: 'common' },
  { label: 'Uncommon', value: 'uncommon' },
  { label: 'Rare', value: 'rare' },
  { label: 'Epic', value: 'epic' },
  { label: 'Legendary', value: 'legendary' },
];

export function PokedexScreen({ navigation, route }: MainTabScreenProps<'Pokedex'>) {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<PokemonType | 'all'>('all');
  const [biome, setBiome] = useState<Biome | 'all'>('all');
  const [rarity, setRarity] = useState<Rarity | 'all'>('all');
  const { isFavorite, toggleFavorite } = useFavoritesContext();

  useFocusEffect(
    useCallback(() => {
      const params = route.params;
      if (params?.search !== undefined) setSearch(params.search);
      if (params?.type) setType(params.type);
      if (params?.biome !== undefined) setBiome(params.biome);
    }, [route.params?.search, route.params?.type, route.params?.biome])
  );

  const typeOptions = useMemo(
    () => [
      { label: 'All Types', value: 'all' as const },
      ...getAllTypes().map((t) => ({ label: t, value: t })),
    ],
    []
  );

  const list = usePokemonList({ search, type, biome, rarity });

  return (
    <LinearGradient colors={[palette.background, '#0d1220']} style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <View style={styles.header}>
          <AppText variant="h1">Pokédex</AppText>
          <AppText variant="caption" muted>
            {list.length} Cobblemon registered
          </AppText>
        </View>

        <View style={styles.searchWrap}>
          <SearchBar value={search} onChangeText={setSearch} />
        </View>

        <FilterChips options={typeOptions} selected={type} onSelect={setType} />
        <FilterChips options={BIOME_OPTIONS} selected={biome} onSelect={setBiome} />
        <FilterChips options={RARITY_OPTIONS} selected={rarity} onSelect={setRarity} />

        <FlatList
          data={list}
          keyExtractor={(p) => String(p.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              title="No matches"
              message="Try adjusting your filters or search term."
              icon="◇"
            />
          }
          renderItem={({ item }) => (
            <View style={styles.cardWrap}>
              <PokemonCard
                pokemon={item}
                onPress={() => navigation.navigate('PokemonDetail', { id: item.id })}
                onFavorite={() => toggleFavorite(item.id)}
                isFavorite={isFavorite(item.id)}
              />
            </View>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    gap: 4,
  },
  searchWrap: { paddingHorizontal: theme.spacing.md, marginTop: theme.spacing.md },
  list: { padding: theme.spacing.md, paddingBottom: theme.spacing.xxl },
  cardWrap: { marginBottom: 0 },
});
