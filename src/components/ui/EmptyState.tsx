import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { AppButton } from './AppButton';
import { palette } from '../../styles/colors';
import { theme } from '../../styles/theme';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
}

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  icon = '◌',
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <AppText variant="hero" color={palette.textMuted} style={styles.icon}>
        {icon}
      </AppText>
      <AppText variant="h3" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="body" muted style={styles.message}>
        {message}
      </AppText>
      {actionLabel && onAction && (
        <AppButton label={actionLabel} onPress={onAction} style={styles.button} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  icon: { marginBottom: theme.spacing.md, opacity: 0.5 },
  title: { marginBottom: theme.spacing.sm, textAlign: 'center' },
  message: { textAlign: 'center', marginBottom: theme.spacing.lg },
  button: { minWidth: 160 },
});
