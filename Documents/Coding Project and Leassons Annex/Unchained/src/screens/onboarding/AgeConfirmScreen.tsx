import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Rect } from 'react-native-svg';

import { colors, spacing, radius } from '@/theme';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';

function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Rect
        x={1} y={1} width={20} height={20} rx={5}
        fill={checked ? colors.primary : 'transparent'}
        stroke={checked ? colors.primary : colors.border}
        strokeWidth={1.8}
      />
      {checked && (
        <Path
          d="M6 11L9.5 14.5L16 8"
          stroke={colors.bg}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </Svg>
  );
}

export function AgeConfirmScreen() {
  const navigation = useNavigation<any>();
  const [confirmed, setConfirmed] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text variant="labelSm" color={colors.textMuted} style={styles.sectionLabel}>AGE CONFIRMATION</Text>

        <Text variant="h1" style={styles.headline}>One last thing.</Text>

        <Text variant="body" color={colors.textSecondary} style={styles.body}>
          Unchained is for adults only. This is required for legal and safety reasons.
        </Text>

        <Pressable
          onPress={() => setConfirmed((v) => !v)}
          style={({ pressed }) => [styles.checkRow, pressed && { opacity: 0.8 }]}
        >
          <CheckIcon checked={confirmed} />
          <Text variant="body" style={styles.checkLabel}>
            I confirm I am 18 or older.
          </Text>
        </Pressable>

        <View style={styles.spacer} />

        <Button
          label="Begin my recovery"
          onPress={() => navigation.navigate('StreakStart')}
          fullWidth
          size="lg"
          disabled={!confirmed}
        />
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
    paddingBottom: spacing.lg,
  },
  sectionLabel: {
    letterSpacing: 3,
    marginBottom: spacing.lg,
  },
  headline: {
    marginBottom: spacing.md,
  },
  body: {
    marginBottom: spacing.xl,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkLabel: {
    flex: 1,
  },
  spacer: {
    flex: 1,
  },
});
