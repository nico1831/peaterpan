import React from 'react';
import { Pressable, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, { bg: string; textColor: string; border?: string }> = {
  primary: { bg: colors.primary, textColor: colors.bg },
  secondary: { bg: colors.card, textColor: colors.textPrimary, border: colors.border },
  ghost: { bg: 'transparent', textColor: colors.textSecondary },
  danger: { bg: colors.dangerMuted, textColor: colors.danger, border: colors.danger },
};

const sizeStyles: Record<Size, { paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
  sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 13 },
  md: { paddingVertical: 13, paddingHorizontal: 24, fontSize: 15 },
  lg: { paddingVertical: 17, paddingHorizontal: 32, fontSize: 17 },
};

export function Button({
  label, onPress, variant = 'primary', size = 'md',
  loading = false, disabled = false, style, fullWidth = false,
}: Props) {
  const vs = variantStyles[variant];
  const ss = sizeStyles[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: vs.bg,
          borderColor: vs.border ?? 'transparent',
          borderWidth: vs.border ? 1 : 0,
          paddingVertical: ss.paddingVertical,
          paddingHorizontal: ss.paddingHorizontal,
          opacity: pressed ? 0.8 : disabled ? 0.4 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={vs.textColor} />
      ) : (
        <Text
          style={{
            ...typography.body,
            fontSize: ss.fontSize,
            fontWeight: '600',
            color: vs.textColor,
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
