import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { AppText } from './AppText';
import { palette } from '../../styles/colors';
import { theme } from '../../styles/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onSubmit?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search Cobblemon...',
  onClear,
  onSubmit,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <AppText variant="body" color={palette.accent} style={styles.icon}>
        ⌕
      </AppText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.textMuted}
        style={styles.input}
        selectionColor={palette.accent}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
      {value.length > 0 && (
        <Pressable onPress={() => (onClear ? onClear() : onChangeText(''))} hitSlop={8}>
          <AppText variant="caption" muted>
            ✕
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    gap: theme.spacing.sm,
  },
  icon: { fontSize: 18 },
  input: {
    flex: 1,
    color: palette.text,
    fontSize: 15,
    padding: 0,
  },
});
