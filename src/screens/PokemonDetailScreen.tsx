import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { AppText } from '../components/ui/AppText';
import { TypeBadge } from '../components/ui/TypeBadge';
import { StatBar } from '../components/ui/StatBar';
import { AppCard } from '../components/ui/AppCard';
import { usePokemon } from '../hooks/usePokemon';
import { useFavoritesContext } from '../context/FavoritesContext';
import { typeColors, rarityColors, palette } from '../styles/colors';
import { theme } from '../styles/theme';
import { formatPokemonId, capitalize } from '../utils/formatters';
import { getTypeMatchups } from '../utils/typeEffectiveness';
import { PokemonType } from '../data/pokemon';
import { RootStackScreenProps } from '../routes/types';
import { getPokemonById } from '../services/pokemonService';
import { buildCobblemonWorldInfo, formatSpawnBiomeLabel } from '../utils/cobblemonSpawn';
import { getDetailSpriteMetrics } from '../utils/detailLayout';
import { useLocale } from '../context/LocaleContext';
import { getApproxSpawnChance, getSpawnDifficultyTone } from '../utils/spawnRarity';

type Tab = 'info' | 'spawn' | 'moves' | 'evolutions';

export function PokemonDetailScreen({
  navigation,
  route,
}: RootStackScreenProps<'PokemonDetail'>) {
  const { locale, t } = useLocale();
  const { id } = route.params;
  const pokemon = usePokemon(id);
  const { isFavorite, toggleFavorite, addRecent } = useFavoritesContext();
  const [tab, setTab] = useState<Tab>('info');
  const imageScale = useSharedValue(0.88);
  const { width: windowWidth } = useWindowDimensions();
  const sprite = useMemo(() => getDetailSpriteMetrics(windowWidth), [windowWidth]);
  const worldInfo = useMemo(
    () => (pokemon ? buildCobblemonWorldInfo(pokemon, locale) : null),
    [pokemon, locale]
  );

  const tabList = useMemo(
    () =>
      [
        { key: 'info' as const, label: t('detail.tab.info') },
        { key: 'spawn' as const, label: t('detail.tab.spawn') },
        { key: 'moves' as const, label: t('detail.tab.moves') },
        { key: 'evolutions' as const, label: t('detail.tab.evolutions') },
      ] satisfies { key: Tab; label: string }[],
    [t, locale]
  );

  useEffect(() => {
    if (pokemon) {
      addRecent(pokemon.id);
      imageScale.value = withSpring(1, { damping: 14, stiffness: 180 });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [pokemon?.id]);

  const imageAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  if (!pokemon) {
    return (
      <View style={styles.error}>
        <AppText variant="h2">{t('detail.notFound')}</AppText>
        <Pressable onPress={() => navigation.goBack()}>
          <AppText color={palette.accent}>{t('detail.goBack')}</AppText>
        </Pressable>
      </View>
    );
  }

  const types = [pokemon.primaryType, pokemon.secondaryType].filter(Boolean) as PokemonType[];
  const typeColor = typeColors[pokemon.primaryType];
  const matchups = getTypeMatchups(types);
  const fav = isFavorite(pokemon.id);

  const goEvolution = (evoId: number) => {
    navigation.push('PokemonDetail', { id: evoId });
  };

  return (
    <View style={styles.flex}>
      <LinearGradient
        colors={[typeColor.dark + 'AA', palette.background, palette.background]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeTop} edges={['top']}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={12}
          >
            <AppText variant="h3" color={palette.accent}>
              ←
            </AppText>
            <AppText variant="caption" muted>
              {t('detail.back')}
            </AppText>
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.heroCard}>
          <LinearGradient
            colors={[`${typeColor.dark}CC`, palette.backgroundCard]}
            style={styles.heroGradient}
          >
            <View style={styles.heroTop}>
              <View style={styles.heroTitles}>
                <AppText variant="caption" muted style={styles.dexNum}>
                  {formatPokemonId(pokemon.id)}
                </AppText>
                <AppText variant="h1" numberOfLines={2} style={styles.monName}>
                  {pokemon.name}
                </AppText>
                <View style={styles.typeRow}>
                  <TypeBadge type={pokemon.primaryType} size="md" />
                  {pokemon.secondaryType && (
                    <TypeBadge type={pokemon.secondaryType} size="md" />
                  )}
                </View>
                <View style={styles.metaRow}>
                  <View
                    style={[
                      styles.rarityPill,
                      { borderColor: rarityColors[pokemon.rarity] + '88' },
                    ]}
                  >
                    <AppText variant="small" color={rarityColors[pokemon.rarity]}>
                      {pokemon.rarity.toUpperCase()}
                    </AppText>
                  </View>
                  <AppText variant="caption" muted>
                    {formatSpawnBiomeLabel(pokemon.spawnBiome, locale)} · {capitalize(pokemon.spawnTime)}
                  </AppText>
                </View>
              </View>
              <Pressable
                onPress={() => {
                  toggleFavorite(pokemon.id);
                  Haptics.selectionAsync();
                }}
                style={[styles.favBtn, fav && styles.favBtnOn]}
                hitSlop={8}
              >
                <AppText variant="h2" color={fav ? palette.warning : palette.textSecondary}>
                  {fav ? '★' : '☆'}
                </AppText>
                <AppText variant="small" color={fav ? palette.warning : palette.textMuted}>
                  {fav ? t('detail.saved') : t('detail.save')}
                </AppText>
              </Pressable>
            </View>

            <Animated.View
              entering={FadeInUp.duration(480)}
              style={[
                styles.imageWrap,
                { minHeight: sprite.wrapMinHeight },
                imageAnimStyle,
              ]}
            >
              <View
                style={[
                  styles.imageGlow,
                  {
                    width: sprite.glowDiameter,
                    height: sprite.glowDiameter,
                    borderRadius: sprite.glowDiameter / 2,
                    backgroundColor: typeColor.primary + '2A',
                  },
                ]}
              />
              <Image
                source={{ uri: pokemon.image }}
                style={{
                  width: sprite.imageWidth,
                  height: sprite.imageHeight,
                }}
                resizeMode="contain"
              />
            </Animated.View>
          </LinearGradient>
        </View>

        <View style={styles.tabs}>
          {tabList.map((tb) => (
            <Pressable
              key={tb.key}
              onPress={() => setTab(tb.key)}
              style={[styles.tab, tab === tb.key && { borderBottomColor: typeColor.primary }]}
            >
              <AppText
                variant="label"
                color={tab === tb.key ? typeColor.glow : palette.textMuted}
              >
                {tb.label}
              </AppText>
            </Pressable>
          ))}
        </View>

        {tab === 'info' && (
          <Animated.View entering={FadeInDown}>
            <AppCard glowColor={typeColor.glow} style={styles.block}>
              <AppText variant="body" muted style={styles.desc}>
                {pokemon.description}
              </AppText>
            </AppCard>
            <AppCard style={styles.block}>
              <AppText variant="h3" style={styles.blockTitle}>
                {t('detail.statsTitle')}
              </AppText>
              <StatBar label="HP" value={pokemon.hp} color={typeColor.primary} />
              <StatBar label="ATK" value={pokemon.attack} color={palette.danger} />
              <StatBar label="DEF" value={pokemon.defense} color={palette.accentSecondary} />
              <StatBar label="SPD" value={pokemon.speed} color={palette.accent} />
            </AppCard>
            <AppCard style={styles.block}>
              <AppText variant="h3" style={styles.blockTitle}>
                {t('detail.matchupsTitle')}
              </AppText>
              <MatchupRow label={t('detail.weakTo')} types={matchups.weaknesses} t={t} />
              <MatchupRow label={t('detail.resists')} types={matchups.resistances} t={t} />
            </AppCard>
          </Animated.View>
        )}

        {tab === 'spawn' && worldInfo && (
          <Animated.View entering={FadeInDown}>
            <AppCard glowColor={typeColor.glow} style={styles.block}>
              <AppText variant="h3" style={styles.blockTitle}>
                {t('detail.spawnProfile')}
              </AppText>
              <InfoRow
                label={t('detail.biome')}
                value={formatSpawnBiomeLabel(pokemon.spawnBiome, locale)}
              />
              <InfoRow
                label={t('detail.dimension')}
                value={t(`dimension.${worldInfo.dimension}`)}
              />
              <InfoRow label={t('detail.spawnTime')} value={capitalize(pokemon.spawnTime)} />
              <InfoRow label={t('detail.rarity')} value={capitalize(pokemon.rarity)} />
              <InfoRow label={t('detail.preferredWeather')} value={worldInfo.preferredWeather} />
              <InfoRow
                label={t('detail.spawnChanceLabel')}
                value={getApproxSpawnChance(pokemon.rarity)}
              />
              <View style={styles.difficultyBox}>
                <AppText variant="caption" muted>
                  {t('detail.spawnDifficultyLabel')}
                </AppText>
                <AppText variant="body" muted style={styles.difficultyText}>
                  {t(`detail.spawnDifficulty.${getSpawnDifficultyTone(pokemon.rarity)}`)}
                </AppText>
              </View>
            </AppCard>
            <AppCard style={styles.block}>
              <AppText variant="h3" style={styles.blockTitle}>
                {t('detail.blocksTitle')}
              </AppText>
              <AppText variant="body" muted style={styles.paragraph}>
                {worldInfo.spawnEnvironment}
              </AppText>
            </AppCard>
            <AppCard style={styles.block}>
              <AppText variant="h3" style={styles.blockTitle}>
                {t('detail.dropsTitle')}
              </AppText>
              <View style={styles.dropGrid}>
                {worldInfo.possibleDrops.map((d) => (
                  <View key={d} style={styles.dropChip}>
                    <AppText variant="small" color={palette.text}>
                      {d}
                    </AppText>
                  </View>
                ))}
              </View>
            </AppCard>
            <View style={[styles.captureCard, { borderColor: palette.accent + '55' }]}>
              <AppText variant="label" color={palette.accent}>
                {t('detail.captureTrainerNote')}
              </AppText>
              <AppText variant="small" muted style={styles.captureSub}>
                {t('detail.captureSurvivalTip')}
              </AppText>
              <AppText variant="body" muted style={styles.captureBody}>
                {worldInfo.captureTip}
              </AppText>
            </View>
          </Animated.View>
        )}

        {tab === 'moves' && (
          <Animated.View entering={FadeInDown} style={styles.moveGrid}>
            {pokemon.moves.map((move, i) => {
              const stab =
                move.type === pokemon.primaryType ||
                (pokemon.secondaryType && move.type === pokemon.secondaryType);
              return (
                <View key={move.name + i} style={styles.moveCell}>
                  <View style={styles.moveCellTop}>
                    <AppText variant="caption" numberOfLines={2} style={styles.moveName}>
                      {move.name}
                    </AppText>
                    {stab && (
                      <View style={styles.stabPill}>
                        <AppText variant="small" color={palette.accent}>
                          {t('detail.stab')}
                        </AppText>
                      </View>
                    )}
                  </View>
                  <TypeBadge type={move.type} />
                  <AppText variant="small" muted style={styles.moveMeta}>
                    {t('detail.movePow')} {move.power ?? '—'} · {t('detail.moveAcc')}{' '}
                    {move.accuracy ?? '—'}%
                    {move.level ? ` · Lv ${move.level}` : ''}
                  </AppText>
                </View>
              );
            })}
          </Animated.View>
        )}

        {tab === 'evolutions' && (
          <Animated.View entering={FadeInDown}>
            {pokemon.evolutions.length === 0 ? (
              <AppCard style={styles.block}>
                <AppText variant="body" muted>
                  {t('detail.evoFinal')}
                </AppText>
              </AppCard>
            ) : (
              <AppCard style={styles.block} glowColor={typeColor.glow}>
                <AppText variant="h3" style={styles.blockTitle}>
                  {t('detail.evoNext')}
                </AppText>
                <AppText variant="caption" muted style={styles.evoHint}>
                  {t('detail.evoTap')}
                </AppText>
                {pokemon.evolutions.map((evo) => {
                  const evoData = getPokemonById(evo.id);
                  return (
                    <Pressable
                      key={evo.id}
                      onPress={() => goEvolution(evo.id)}
                      style={styles.evoLine}
                    >
                      <AppText variant="bodyBold" numberOfLines={1} style={styles.evoLineName}>
                        {pokemon.name}
                      </AppText>
                      <AppText variant="body" color={palette.accent}>
                        →
                      </AppText>
                      <AppText variant="bodyBold" numberOfLines={1} style={styles.evoLineName}>
                        {evo.name}
                      </AppText>
                      {evoData && (
                        <Image source={{ uri: evoData.image }} style={styles.evoLineImg} />
                      )}
                    </Pressable>
                  );
                })}
              </AppCard>
            )}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <AppText variant="caption" muted>
        {label}
      </AppText>
      <AppText variant="bodyBold" style={styles.infoValue}>
        {value}
      </AppText>
    </View>
  );
}

function MatchupRow({ label, types, t }: { label: string; types: PokemonType[]; t: (k: string) => string }) {
  return (
    <View style={styles.matchup}>
      <AppText variant="caption" muted>
        {label}
      </AppText>
      <View style={styles.matchupTypes}>
        {types.length === 0 ? (
          <AppText variant="caption" muted>
            {t('detail.none')}
          </AppText>
        ) : (
          types.slice(0, 8).map((ty) => <TypeBadge key={ty} type={ty} />)
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: palette.background },
  safeTop: { paddingHorizontal: theme.spacing.md },
  topBar: { paddingBottom: theme.spacing.sm },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  error: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  scroll: { paddingBottom: theme.spacing.xxl },
  heroCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.border,
    ...theme.shadows.glow(palette.accent),
  },
  heroGradient: { paddingBottom: theme.spacing.md },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  heroTitles: { flex: 1, minWidth: 0 },
  dexNum: { letterSpacing: 2, marginBottom: 4 },
  monName: { marginBottom: theme.spacing.sm },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: theme.spacing.sm },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 },
  rarityPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    backgroundColor: palette.background + '99',
  },
  favBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface + 'CC',
    minWidth: 72,
  },
  favBtnOn: {
    borderColor: palette.warning + '99',
    backgroundColor: palette.backgroundCard,
  },
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  imageGlow: {
    position: 'absolute',
    alignSelf: 'center',
    top: '6%',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  block: { marginHorizontal: theme.spacing.md, marginBottom: theme.spacing.md },
  blockTitle: { marginBottom: theme.spacing.md },
  desc: { lineHeight: 22 },
  paragraph: { lineHeight: 22 },
  difficultyBox: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  difficultyText: { marginTop: 6, lineHeight: 20 },
  dropGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  dropChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: theme.radius.sm,
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.borderGlow,
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  captureCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: palette.backgroundCard,
    borderWidth: 1,
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  captureSub: { marginTop: 4, marginBottom: theme.spacing.sm },
  captureBody: { lineHeight: 22 },
  moveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  moveCell: {
    width: '48%',
    flexGrow: 1,
    minWidth: 148,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    gap: 6,
  },
  moveCellTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 6,
  },
  moveName: { flex: 1 },
  stabPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: palette.accent + '88',
    backgroundColor: 'rgba(0,229,255,0.1)',
  },
  moveMeta: { marginTop: 2 },
  evoHint: { marginBottom: theme.spacing.md },
  evoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  evoLineName: { flex: 1 },
  evoLineImg: { width: 40, height: 40 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    gap: theme.spacing.md,
  },
  infoValue: { flex: 1, textAlign: 'right' },
  matchup: { marginBottom: theme.spacing.md },
  matchupTypes: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
});
