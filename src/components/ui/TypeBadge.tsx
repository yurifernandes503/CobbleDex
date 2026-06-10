import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { PokemonType } from '../../data/pokemon';
import { typeColors } from '../../styles/colors';
import { capitalize } from '../../utils/formatters';
import { theme } from '../../styles/theme';

interface TypeBadgeProps {
  type: PokemonType;
  size?: 'sm' | 'md';
}

export function TypeBadge({ type, size = 'sm' }: TypeBadgeProps) {
  const colors = typeColors[type];
  return (
    <View
      style={[
        styles.badge,
        size === 'md' && styles.badgeMd,
        {
          backgroundColor: colors.dark,
          borderColor: colors.primary,
          shadowColor: colors.glow,
        },
      ]}
    >
      <AppText
        variant={size === 'md' ? 'caption' : 'small'}
        color={colors.glow}
        style={styles.text}
      >
        {capitalize(type)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  badgeMd: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  text: { textTransform: 'uppercase', letterSpacing: 0.8 },
});
