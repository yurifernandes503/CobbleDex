import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { palette } from '../../styles/colors';
import { typography } from '../../styles/typography';

type Variant = keyof typeof typography;

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
  muted?: boolean;
}

export function AppText({
  variant = 'body',
  color,
  muted,
  style,
  children,
  ...rest
}: AppTextProps) {
  return (
    <Text
      style={[
        typography[variant],
        { color: color ?? (muted ? palette.textMuted : palette.text) },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}
