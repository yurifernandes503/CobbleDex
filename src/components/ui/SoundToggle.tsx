import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { useSettings } from '../../context/SettingsContext';
import { palette } from '../../styles/colors';
import { theme } from '../../styles/theme';

export function SoundToggle() {
  const { soundEnabled, toggleSound } = useSettings();

  return (
    <Pressable
      onPress={toggleSound}
      style={[styles.btn, soundEnabled && styles.btnOn]}
      hitSlop={8}
    >
      <AppText variant="caption" color={soundEnabled ? palette.accent : palette.textMuted}>
        {soundEnabled ? '🔊 SFX' : '🔇 SFX'}
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
  },
  btnOn: {
    borderColor: palette.accent,
    backgroundColor: palette.backgroundCard,
  },
});
