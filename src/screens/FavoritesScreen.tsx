import React, { useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../components/ui/AppText';
import { PokemonCard } from '../components/pokemon/PokemonCard';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useFavoritesContext } from '../context/FavoritesContext';
import { getPokemonById } from '../services/pokemonService';
import { palette } from '../styles/colors';
import { theme } from '../styles/theme';
import { MainTabScreenProps } from '../routes/types';

export function FavoritesScreen({ navigation }: MainTabScreenProps<'Favorites'>) {
  const { favorites, loading, toggleFavorite, isFavorite } = useFavoritesContext();

  const pokemonList = useMemo(
    () => favorites.map((id) => getPokemonById(id)).filter(Boolean),
    [favorites]
  );

  if (loading) {
    return (
      <LinearGradient colors={[palette.background, '#0d1220']} style={styles.center}>
        <LoadingSpinner />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[palette.background, '#0d1220']} style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <AppText variant="h1" style={styles.header}>
          Favorites
        </AppText>
        <AppText variant="caption" muted style={styles.sub}>
          Saved locally · works offline
        </AppText>

        <FlatList
          data={pokemonList}
          keyExtractor={(p) => String(p!.id)}
          contentContainerStyle={pokemonList.length === 0 ? styles.emptyList : styles.list}
          ListEmptyComponent={
            <EmptyState
              title="No favorites yet"
              message="Save Cobblemon you want to track — tap the star on any card in the Pokédex or here after you browse. Favorites stay on your device (AsyncStorage), even offline."
              icon="☆"
              actionLabel="Open Pokédex"
              onAction={() => navigation.navigate('Pokedex')}
            />
          }
          renderItem={({ item }) =>
            item ? (
              <PokemonCard
                pokemon={item}
                onPress={() => navigation.navigate('PokemonDetail', { id: item.id })}
                onFavorite={() => toggleFavorite(item.id)}
                isFavorite={isFavorite(item.id)}
              />
            ) : null
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.md },
  sub: { paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.md },
  list: { padding: theme.spacing.md, paddingBottom: theme.spacing.xxl, gap: theme.spacing.md },
  emptyList: { flexGrow: 1 },
});
