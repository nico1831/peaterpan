import React from 'react';
import { View, ViewStyle, StyleSheet, Pressable } from 'react-native';
import { colors, radius, spacing } from '@/theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: keyof typeof spacing;
}

export function Card({ children, style, onPress, padding = 'md' }: Props) {
  const inner = (
    <View style={[styles.card, { padding: spacing[padding] }, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
        {inner}
      </Pressable>
    );
  }

  return inner;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
});
