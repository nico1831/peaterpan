import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';

import { colors, spacing, radius, typography } from '@/theme';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';

function ChainBreakIcon() {
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
      <Circle cx={22} cy={22} r={12} stroke={colors.primary} strokeWidth={4} fill="none" />
      <Circle cx={42} cy={42} r={12} stroke={colors.primary} strokeWidth={4} fill="none" />
      <Path d="M30 22H34C38.4 22 42 25.6 42 30V34" stroke={colors.primary} strokeWidth={4} strokeLinecap="round" fill="none" />
      <Path d="M28 36L36 28" stroke={colors.danger} strokeWidth={3.5} strokeLinecap="round" />
    </Svg>
  );
}

export function WelcomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      <View style={styles.container}>
        <View style={styles.labelRow}>
          <Text variant="labelSm" color={colors.textMuted} style={styles.sectionLabel}>WELCOME</Text>
        </View>

        <View style={styles.iconContainer}>
          <ChainBreakIcon />
        </View>

        <View style={styles.heroText}>
          <Text variant="h1">
            Recovery shouldn't{' '}
            <Text variant="h1" style={styles.italic}>cost money.</Text>
          </Text>
        </View>

        <Text variant="bodyMd" color={colors.textSecondary} style={styles.body}>
          Every tool here is permanently free. No paywalls. No countdown timers. No pressure.
        </Text>

        <View style={styles.trustBadge}>
          <Text variant="caption" color={colors.textMuted}>
            Your data stays on your device unless you choose to share it.{' '}
            <Text variant="caption" color={colors.primary}>Open source. Auditable.</Text>
          </Text>
        </View>

        <View style={styles.spacer} />

        <View style={styles.footer}>
          <Button
            label="Get started"
            onPress={() => navigation.navigate('ModeSelect')}
            fullWidth
            size="lg"
          />
          <Text variant="caption" color={colors.textMuted} style={styles.disclaimer}>
            This app is not a substitute for professional mental health treatment.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  labelRow: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    letterSpacing: 3,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  heroText: {
    marginBottom: spacing.md,
  },
  italic: {
    fontStyle: 'italic',
  },
  body: {
    marginBottom: spacing.lg,
  },
  trustBadge: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  spacer: {
    flex: 1,
  },
  footer: {
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  disclaimer: {
    textAlign: 'center',
    lineHeight: 18,
  },
});
