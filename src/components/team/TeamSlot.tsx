import React from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import { AppText } from '../ui/AppText';
import { Pokemon } from '../../data/pokemon';
import { typeColors, palette } from '../../styles/colors';
import { theme } from '../../styles/theme';

interface TeamSlotProps {
  index: number;
  pokemon: Pokemon | null;
  onPress: () => void;
  onRemove?: () => void;
}

export function TeamSlot({ index, pokemon, onPress, onRemove }: TeamSlotProps) {
  const glow = pokemon ? typeColors[pokemon.primaryType].glow : palette.border;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.slot,
        { borderColor: glow, shadowColor: glow },
        pressed && styles.pressed,
      ]}
    >
      <AppText variant="small" muted style={styles.index}>
        {index + 1}
      </AppText>
      {pokemon ? (
        <>
          <Image source={{ uri: pokemon.image }} style={styles.image} resizeMode="contain" />
          <AppText variant="small" numberOfLines={1} style={styles.name}>
            {pokemon.name}
          </AppText>
          {onRemove && (
            <Pressable onPress={onRemove} style={styles.remove} hitSlop={8}>
              <AppText variant="small" color={palette.danger}>
                ✕
              </AppText>
            </Pressable>
          )}
        </>
      ) : (
        <AppText variant="hero" color={palette.textMuted} style={styles.plus}>
          +
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    flex: 1,
    aspectRatio: 0.85,
    backgroundColor: palette.backgroundCard,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 100,
  },
  pressed: { opacity: 0.9 },
  index: { position: 'absolute', top: 6, left: 8 },
  image: { width: 56, height: 56 },
  name: { marginTop: 4, textAlign: 'center' },
  plus: { opacity: 0.4 },
  remove: { position: 'absolute', top: 4, right: 6 },
});
