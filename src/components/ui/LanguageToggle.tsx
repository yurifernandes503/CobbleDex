import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { useLocale } from '../../context/LocaleContext';
import { palette } from '../../styles/colors';
import { theme } from '../../styles/theme';

export function LanguageToggle() {
  const { locale, cycleLocale } = useLocale();

  return (
    <Pressable onPress={cycleLocale} style={styles.btn} hitSlop={8}>
      <AppText variant="caption" color={palette.accentSecondary}>
        {locale === 'en' ? 'EN' : 'PT'}
      </AppText>
      <AppText variant="small" muted>
        {locale === 'en' ? 'Português' : 'English'}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    alignItems: 'center',
  },
});
