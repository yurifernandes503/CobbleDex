import React, { useState, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SearchBar } from '../components/ui/SearchBar';
import { PokemonCard } from '../components/pokemon/PokemonCard';
import { usePokemonList } from '../hooks/usePokemon';
import { useTeamContext } from '../context/TeamContext';
import { palette } from '../styles/colors';
import { theme } from '../styles/theme';
import { RootStackScreenProps } from '../routes/types';
import { playSound, isSoundEnabled } from '../services/soundService';

export function TeamPickerScreen({
  navigation,
  route,
}: RootStackScreenProps<'TeamPicker'>) {
  const { slotIndex } = route.params;
  const { setSlot, slots } = useTeamContext();
  const [search, setSearch] = useState('');

  const list = usePokemonList({ search, type: 'all', biome: 'all', rarity: 'all' });

  const alreadyInTeam = useMemo(() => new Set(slots.filter(Boolean) as number[]), [slots]);

  return (
    <View style={styles.flex}>
      <ScreenHeader
        title="Add to Team"
        subtitle={`Slot ${slotIndex + 1}`}
        onBack={() => navigation.goBack()}
      />
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <View style={styles.search}>
          <SearchBar value={search} onChangeText={setSearch} />
        </View>
        <FlatList
          data={list}
          keyExtractor={(p) => String(p.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const inTeam = alreadyInTeam.has(item.id);
            return (
              <View style={inTeam ? styles.dimmed : undefined}>
                <PokemonCard
                  pokemon={item}
                  compact
                  onPress={() => {
                    if (!inTeam) {
                      setSlot(slotIndex, item.id);
                      if (isSoundEnabled()) playSound('success');
                      navigation.goBack();
                    }
                  }}
                />
              </View>
            );
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: palette.background },
  search: { padding: theme.spacing.md },
  list: { padding: theme.spacing.md, paddingBottom: theme.spacing.xxl, gap: theme.spacing.sm },
  dimmed: { opacity: 0.45 },
});
