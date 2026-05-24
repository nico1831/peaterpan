import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';

import { colors, spacing, radius } from '@/theme';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import type { Mode } from '@/types';

function ScienceIcon({ active }: { active: boolean }) {
  const c = active ? colors.primary : colors.textMuted;
  return (
    <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
      <Path d="M9 3H15V9L19 17H5L9 9V3Z" stroke={c} strokeWidth={1.7} fill="none" strokeLinejoin="round" />
      <Path d="M5 17H19" stroke={c} strokeWidth={1.7} strokeLinecap="round" />
      <Circle cx={9} cy={13} r={1.2} fill={c} />
      <Circle cx={13} cy={14.5} r={1} fill={c} />
    </Svg>
  );
}

function FaithIcon({ active }: { active: boolean }) {
  const c = active ? colors.gold : colors.textMuted;
  return (
    <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L13.5 8H20L14.5 12L17 18L12 14L7 18L9.5 12L4 8H10.5L12 2Z" stroke={c} strokeWidth={1.7} fill="none" strokeLinejoin="round" />
    </Svg>
  );
}

interface ModeCardProps {
  mode: Mode;
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  accentColor: string;
}

function ModeCard({ title, subtitle, selected, onPress, icon, accentColor }: ModeCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.modeCard,
        selected && { borderColor: accentColor, backgroundColor: `${accentColor}10` },
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={styles.modeCardRow}>
        <View style={[styles.iconWrap, { backgroundColor: `${accentColor}18` }]}>
          {icon}
        </View>
        <View style={styles.modeCardText}>
          <Text variant="h3">{title}</Text>
          <Text variant="label" color={colors.textMuted}>{subtitle}</Text>
        </View>
        <View style={[styles.radio, selected && { borderColor: accentColor }]}>
          {selected && <View style={[styles.radioDot, { backgroundColor: accentColor }]} />}
        </View>
      </View>
    </Pressable>
  );
}

export function ModeSelectScreen() {
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState<Mode | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text variant="labelSm" color={colors.textMuted} style={styles.sectionLabel}>YOUR PATH</Text>

        <Text variant="h1" style={styles.headline}>
          Would you like to include your faith in your recovery?
        </Text>

        <Text variant="body" color={colors.textSecondary} style={styles.body}>
          Both modes are grounded in neuroscience, CBT and habit science. Faith mode adds scripture and prayer alongside — not instead of — the science.
        </Text>

        <View style={styles.cards}>
          <ModeCard
            mode="secular"
            title="Keep it science-based"
            subtitle="Neuroscience, habits, CBT"
            selected={selected === 'secular'}
            onPress={() => setSelected('secular')}
            icon={<ScienceIcon active={selected === 'secular'} />}
            accentColor={colors.primary}
          />
          <ModeCard
            mode="faith"
            title="Add faith alongside"
            subtitle="Scripture, prayer, spiritual framing"
            selected={selected === 'faith'}
            onPress={() => setSelected('faith')}
            icon={<FaithIcon active={selected === 'faith'} />}
            accentColor={colors.gold}
          />
        </View>

        <View style={styles.spacer} />

        <Button
          label="Continue"
          onPress={() => navigation.navigate('SetupQuestions')}
          fullWidth
          size="lg"
          disabled={!selected}
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
    lineHeight: 24,
  },
  cards: {
    gap: spacing.md,
  },
  modeCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
  },
  modeCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeCardText: {
    flex: 1,
    gap: 4,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  spacer: {
    flex: 1,
  },
});
