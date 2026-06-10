import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { palette } from '../../styles/colors';
import { theme } from '../../styles/theme';

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color: string;
}

export function StatBar({ label, value, max = 255, color }: StatBarProps) {
  const pct = Math.min(100, (value / max) * 100);

  return (
    <View style={styles.row}>
      <AppText variant="caption" style={styles.label}>
        {label}
      </AppText>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <AppText variant="caption" color={color} style={styles.value}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  label: { width: 52, color: palette.textSecondary },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: palette.background,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: theme.radius.full,
    minWidth: 4,
  },
  value: { width: 36, textAlign: 'right' },
});
