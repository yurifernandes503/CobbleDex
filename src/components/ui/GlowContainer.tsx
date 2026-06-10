import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../styles/theme';

interface GlowContainerProps {
  children: React.ReactNode;
  colors: [string, string];
  style?: ViewStyle;
}

export function GlowContainer({ children, colors, style }: GlowContainerProps) {
  return (
    <View style={[styles.outer, theme.shadows.glow(colors[0]), style]}>
      <LinearGradient colors={colors} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.inner}>{children}</View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { borderRadius: theme.radius.xl, overflow: 'hidden' },
  gradient: { padding: 2, borderRadius: theme.radius.xl },
  inner: {
    backgroundColor: '#0a0e17',
    borderRadius: theme.radius.xl - 2,
    overflow: 'hidden',
  },
});
