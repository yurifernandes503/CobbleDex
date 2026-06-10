import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../components/ui/AppText';
import { SearchBar } from '../components/ui/SearchBar';
import { AppCard } from '../components/ui/AppCard';
import { TypeBadge } from '../components/ui/TypeBadge';
import { PokemonCard } from '../components/pokemon/PokemonCard';
import { useFavoritesContext } from '../context/FavoritesContext';
import {
  getFeaturedPokemon,
  getPokemonById,
  getAllTypes,
  getRareCobblemon,
  getSpotlightByBiome,
} from '../services/pokemonService';
import { palette, typeColors, biomeLabels } from '../styles/colors';
import { Biome, PokemonType } from '../data/pokemon';
import { theme } from '../styles/theme';
import { type MainTabParamList, MainTabScreenProps } from '../routes/types';
import { useSettings } from '../context/SettingsContext';
import { useLocale } from '../context/LocaleContext';
import { SoundToggle } from '../components/ui/SoundToggle';
import { LanguageToggle } from '../components/ui/LanguageToggle';

const HOME_BIOMES: Biome[] = ['forest', 'ocean', 'cave', 'mountain', 'desert', 'tundra'];

export function HomeScreen({ navigation }: MainTabScreenProps<'Home'>) {
  const [search, setSearch] = useState('');
  const { play } = useSettings();
  const { t, locale } = useLocale();
  const { recent, isFavorite, toggleFavorite } = useFavoritesContext();
  const featured = useMemo(() => getFeaturedPokemon(6), []);
  const rareList = useMemo(() => getRareCobblemon(10), []);
  const types = useMemo(() => getAllTypes().slice(0, 9), []);
  const recentPokemon = useMemo(
    () => recent.map((id) => getPokemonById(id)).filter(Boolean),
    [recent]
  );

  const openPokedex = (params?: {
    search?: string;
    type?: PokemonType;
    biome?: Biome;
  }) => {
    play('select');
    navigation.navigate('Pokedex', params);
  };

  const goToDetail = (id: number) => {
    play('select');
    navigation.navigate('PokemonDetail', { id });
  };

  const submitSearch = () => {
    const q = search.trim();
    if (q) openPokedex({ search: q });
  };

  const shortcuts = useMemo(
    () =>
      [
        {
          key: 'dex',
          label: t('home.short.dex.label'),
          sub: t('home.short.dex.sub'),
          tab: 'Pokedex' as const,
          icon: '◈',
          accent: palette.accent,
          params: undefined,
        },
        {
          key: 'team',
          label: t('home.short.team.label'),
          sub: t('home.short.team.sub'),
          tab: 'TeamBuilder' as const,
          icon: '⚔',
          accent: palette.accentSecondary,
        },
        {
          key: 'fav',
          label: t('home.short.fav.label'),
          sub: t('home.short.fav.sub'),
          tab: 'Favorites' as const,
          icon: '★',
          accent: palette.warning,
        },
        {
          key: 'spawn',
          label: t('home.short.spawn.label'),
          sub: t('home.short.spawn.sub'),
          tab: 'Pokedex' as const,
          icon: '⌖',
          accent: '#5de6ff',
          params: undefined,
        },
      ] satisfies {
        key: string;
        label: string;
        sub: string;
        tab: keyof MainTabParamList;
        icon: string;
        accent: string;
        params?: { search?: string; type?: PokemonType; biome?: Biome };
      }[],
    [t, locale]
  );

  const todayTip = t(`home.tip.${new Date().getDay()}`);

  return (
    <LinearGradient colors={[palette.background, '#0d1220']} style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <View style={styles.hero}>
            <View style={styles.heroTop}>
              <View style={styles.titleRow}>
                <AppText variant="hero" style={styles.title}>
                  Cobble
                </AppText>
                <AppText variant="hero" color={palette.accent} style={styles.title}>
                  Dex
                </AppText>
              </View>
              <View style={styles.heroActions}>
                <LanguageToggle />
                <SoundToggle />
              </View>
            </View>
            <AppText variant="body" muted>
              {t('home.tagline')}
            </AppText>
          </View>

          <Section title={t('home.section.todayTip')}>
            <AppCard accent glowColor={palette.accent}>
              <AppText variant="body" muted style={styles.tipBody}>
                {todayTip}
              </AppText>
            </AppCard>
          </Section>

          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder={t('home.searchPlaceholder')}
            onSubmit={submitSearch}
          />
          {search.length > 0 && (
            <Pressable style={styles.searchGo} onPress={submitSearch}>
              <AppText variant="caption" color={palette.accent}>
                {t('home.searchCta')} "{search}" →
              </AppText>
            </Pressable>
          )}

          <Section title={t('home.section.shortcuts')}>
            <View style={styles.shortcutGrid}>
              {shortcuts.map((item) => (
                <AppCard
                  key={item.key}
                  onPress={() => {
                    play('tap');
                    if (item.tab === 'Pokedex') {
                      navigation.navigate('Pokedex', item.params);
                    } else {
                      navigation.navigate(item.tab);
                    }
                  }}
                  style={styles.shortcutCard}
                  accent
                  glowColor={item.accent}
                >
                  <AppText variant="h2" color={item.accent}>
                    {item.icon}
                  </AppText>
                  <AppText variant="label" style={styles.shortcutTitle}>
                    {item.label}
                  </AppText>
                  <AppText variant="small" muted numberOfLines={2}>
                    {item.sub}
                  </AppText>
                </AppCard>
              ))}
            </View>
          </Section>

          <Section title={t('home.section.featured')}>
            <FlatList
              horizontal
              nestedScrollEnabled
              data={featured}
              keyExtractor={(p) => String(p.id)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hList}
              renderItem={({ item }) => (
                <Pressable onPress={() => goToDetail(item.id)} style={styles.featuredItem}>
                  <LinearGradient
                    colors={[typeColors[item.primaryType].dark, palette.backgroundCard]}
                    style={styles.featuredCard}
                  >
                    <Image source={{ uri: item.image }} style={styles.featuredImg} />
                    <AppText variant="label">{item.name}</AppText>
                    <TypeBadge type={item.primaryType} />
                  </LinearGradient>
                </Pressable>
              )}
            />
          </Section>

          <Section title={t('home.section.biomes')}>
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.biomeRow}
            >
              {HOME_BIOMES.map((b) => {
                const sample = getSpotlightByBiome(b);
                return (
                  <Pressable key={b} onPress={() => openPokedex({ biome: b })} style={styles.biomePress}>
                    <LinearGradient
                      colors={[palette.surface, palette.backgroundCard]}
                      style={[styles.biomeCard, { borderColor: palette.border }]}
                    >
                      <AppText variant="label" color={palette.accent}>
                        {biomeLabels[b]}
                      </AppText>
                      <AppText variant="small" muted numberOfLines={2} style={styles.biomeHint}>
                        {t('home.biomeHint')}
                      </AppText>
                      {sample && (
                        <Image
                          source={{ uri: sample.image }}
                          style={styles.biomeThumb}
                          resizeMode="contain"
                        />
                      )}
                    </LinearGradient>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Section>

          <Section title={t('home.section.rare')}>
            <FlatList
              horizontal
              nestedScrollEnabled
              data={rareList}
              keyExtractor={(p) => String(p.id)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hList}
              renderItem={({ item }) => (
                <Pressable onPress={() => goToDetail(item.id)} style={styles.rareItem}>
                  <LinearGradient
                    colors={[typeColors[item.primaryType].dark, palette.backgroundCard]}
                    style={styles.rareCard}
                  >
                    <Image source={{ uri: item.image }} style={styles.rareImg} resizeMode="contain" />
                    <AppText variant="caption" numberOfLines={1}>
                      {item.name}
                    </AppText>
                    <AppText variant="small" color={palette.accentSecondary} numberOfLines={1}>
                      {item.rarity.toUpperCase()}
                    </AppText>
                  </LinearGradient>
                </Pressable>
              )}
            />
          </Section>

          <Section title={t('home.section.types')}>
            <View style={styles.typeGrid}>
              {types.map((t) => (
                <Pressable
                  key={t}
                  onPress={() => openPokedex({ type: t })}
                  style={[styles.typeCell, { borderColor: typeColors[t].primary }]}
                >
                  <TypeBadge type={t} size="md" />
                </Pressable>
              ))}
            </View>
          </Section>

          {recentPokemon.length > 0 && (
            <Section title={t('home.section.recent')}>
              {recentPokemon.map((p) =>
                p ? (
                  <PokemonCard
                    key={p.id}
                    pokemon={p}
                    compact
                    onPress={() => goToDetail(p.id)}
                    onFavorite={() => toggleFavorite(p.id)}
                    isFavorite={isFavorite(p.id)}
                  />
                ) : null
              )}
            </Section>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="h3" style={styles.sectionTitle}>
        {title}
      </AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: theme.spacing.md, paddingBottom: theme.spacing.xxl },
  hero: { marginBottom: theme.spacing.lg },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tipBody: { lineHeight: 22 },
  titleRow: { flexDirection: 'row' },
  title: { letterSpacing: 1 },
  searchGo: { marginTop: theme.spacing.sm },
  section: { marginTop: theme.spacing.lg },
  sectionTitle: { marginBottom: theme.spacing.md },
  shortcutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  shortcutCard: {
    width: '47%',
    flexGrow: 1,
    minWidth: 148,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  shortcutTitle: { marginTop: 6, marginBottom: 4 },
  biomeRow: { gap: theme.spacing.md, paddingVertical: 4 },
  biomePress: { marginRight: theme.spacing.sm },
  biomeCard: {
    width: 148,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    minHeight: 168,
    justifyContent: 'space-between',
  },
  biomeHint: { marginTop: 4, marginBottom: theme.spacing.sm },
  biomeThumb: { width: 88, height: 88, alignSelf: 'center' },
  rareItem: { marginRight: theme.spacing.md },
  rareCard: {
    width: 120,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    gap: 4,
  },
  rareImg: { width: 72, height: 72 },
  hList: { gap: theme.spacing.md },
  featuredItem: { marginRight: theme.spacing.md },
  featuredCard: {
    width: 140,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    gap: 6,
  },
  featuredImg: { width: 80, height: 80 },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  typeCell: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    backgroundColor: palette.backgroundCard,
  },
});
