import React, { useCallback, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Pressable,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from '../ui/AppText';
import { TypeBadge } from '../ui/TypeBadge';
import { Pokemon } from '../../data/pokemon';
import { typeColors, rarityColors, palette } from '../../styles/colors';
import { formatPokemonId } from '../../utils/formatters';
import { theme } from '../../styles/theme';
import { isWeb } from '../../utils/platformLayout';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PokemonCardProps {
  pokemon: Pokemon;
  onPress: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  compact?: boolean;
}

export function PokemonCard({
  pokemon,
  onPress,
  onFavorite,
  isFavorite,
  compact,
}: PokemonCardProps) {
  const typeColor = typeColors[pokemon.primaryType];
  const scale = useSharedValue(1);
  const [hovered, setHovered] = useState(false);
  const web = isWeb();

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 18, stiffness: 320 });
  }, [scale]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 14, stiffness: 260 });
  }, [scale]);

  const glowShadow: ViewStyle = {
    shadowColor: typeColor.glow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: hovered && web ? 0.75 : 0.45,
    shadowRadius: hovered && web ? 18 : 12,
    elevation: hovered && web ? 14 : 8,
  };

  return (
    <Animated.View style={[animStyle, styles.root, compact && styles.rootCompact, glowShadow]}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[
          styles.card,
          compact && styles.cardCompact,
          web && hovered && { borderColor: typeColor.primary },
        ]}
        {...(web
          ? {
              onHoverIn: () => setHovered(true),
              onHoverOut: () => setHovered(false),
            }
          : {})}
      >
        <LinearGradient
          colors={[palette.backgroundCard, palette.surface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.accentBar, { backgroundColor: typeColor.primary }]} />
        <View style={styles.header}>
          <AppText variant="caption" muted>
            {formatPokemonId(pokemon.id)}
          </AppText>
        </View>
        <View style={styles.body}>
          <View style={[styles.imageRing, { borderColor: typeColor.primary + '55' }]}>
            <Image
              source={{ uri: pokemon.image }}
              style={compact ? styles.imageSm : styles.image}
              resizeMode="contain"
            />
          </View>
          <View style={styles.info}>
            <AppText variant="h3" numberOfLines={1}>
              {pokemon.name}
            </AppText>
            <View style={styles.types}>
              <TypeBadge type={pokemon.primaryType} />
              {pokemon.secondaryType && <TypeBadge type={pokemon.secondaryType} />}
            </View>
            <AppText variant="small" color={rarityColors[pokemon.rarity]}>
              {pokemon.rarity.toUpperCase()}
            </AppText>
          </View>
        </View>
      </AnimatedPressable>
      {onFavorite && (
        <Pressable
          onPress={onFavorite}
          style={styles.favHit}
          hitSlop={14}
          accessibilityLabel="Toggle favorite"
        >
          <View style={styles.favBubble}>
            <AppText variant="body" color={isFavorite ? palette.warning : palette.textMuted}>
              {isFavorite ? '★' : '☆'}
            </AppText>
          </View>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: theme.radius.lg,
    backgroundColor: 'transparent',
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  rootCompact: {
    marginBottom: theme.spacing.sm,
  },
  card: {
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.md + 2,
    paddingHorizontal: theme.spacing.md + 2,
    paddingRight: 44,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: 'hidden',
    position: 'relative',
  },
  cardCompact: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    opacity: 0.95,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.sm,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md + 2,
    paddingLeft: theme.spacing.sm,
  },
  imageRing: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    padding: 4,
    backgroundColor: palette.background + '99',
  },
  image: { width: 76, height: 76 },
  imageSm: { width: 58, height: 58 },
  info: { flex: 1, gap: 6 },
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  favHit: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 4,
  },
  favBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface + 'EE',
    borderWidth: 1,
    borderColor: palette.border,
  },
});
