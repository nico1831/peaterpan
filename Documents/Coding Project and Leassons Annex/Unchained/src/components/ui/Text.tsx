import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

type Variant = keyof typeof typography;

interface Props {
  variant?: Variant;
  color?: string;
  style?: TextStyle;
  children: React.ReactNode;
  numberOfLines?: number;
  onPress?: () => void;
}

export function Text({ variant = 'body', color, style, children, numberOfLines, onPress }: Props) {
  return (
    <RNText
      style={[typography[variant], { color: color ?? colors.textPrimary }, style]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </RNText>
  );
}
