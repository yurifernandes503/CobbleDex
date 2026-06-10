import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from './AppText';
import { palette } from '../../styles/colors';
import { theme } from '../../styles/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, onBack, right }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + theme.spacing.sm }]}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.back} hitSlop={12}>
            <AppText variant="h3" color={palette.accent}>
              ←
            </AppText>
          </Pressable>
        ) : (
          <View style={styles.back} />
        )}
        <View style={styles.titles}>
          <AppText variant="h2">{title}</AppText>
          {subtitle && (
            <AppText variant="caption" muted>
              {subtitle}
            </AppText>
          )}
        </View>
        <View style={styles.right}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  back: { width: 40 },
  titles: { flex: 1 },
  right: { minWidth: 40, alignItems: 'flex-end' },
});
