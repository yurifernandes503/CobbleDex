import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { palette } from '../../styles/colors';
import { theme } from '../../styles/theme';

interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  glowColor?: string;
  style?: ViewStyle;
  accent?: boolean;
}

export function AppCard({ children, onPress, glowColor, style, accent }: AppCardProps) {
  const content = (
    <LinearGradient
      colors={
        accent
          ? [palette.backgroundCard, palette.surface]
          : [palette.backgroundCard, palette.backgroundElevated]
      }
      style={[
        styles.card,
        glowColor ? theme.shadows.glow(glowColor) : theme.shadows.card,
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: 'hidden',
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
});
