import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { colors, spacing, radius } from '@/theme';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import type { Goal, Trigger } from '@/types';

type Duration = 'less_than_month' | 'one_to_six_months' | 'six_to_two_years' | 'over_two_years';

const DURATIONS: { value: Duration; label: string }[] = [
  { value: 'less_than_month', label: 'Less than a month' },
  { value: 'one_to_six_months', label: '1–6 months' },
  { value: 'six_to_two_years', label: '6 months–2 years' },
  { value: 'over_two_years', label: 'Over 2 years' },
];

const GOALS: { value: Goal; label: string }[] = [
  { value: 'quit_entirely', label: 'Quit entirely' },
  { value: 'reduce', label: 'Reduce significantly' },
  { value: 'not_sure', label: 'Not sure yet' },
];

const TRIGGERS: { value: Trigger; label: string; description: string }[] = [
  { value: 'boredom', label: 'Boredom', description: 'Idle time, nothing to do' },
  { value: 'stress', label: 'Stress', description: 'Work, life pressure' },
  { value: 'loneliness', label: 'Loneliness', description: 'Isolation, disconnection' },
  { value: 'late_night', label: 'Late night', description: 'After 10pm, in bed' },
  { value: 'anxiety', label: 'Anxiety', description: 'Worry, overwhelm' },
];

function OptionChip({
  label, selected, onPress, description,
}: { label: string; selected: boolean; onPress: () => void; description?: string }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text variant="label" color={selected ? colors.bg : colors.textPrimary}>{label}</Text>
      {description && (
        <Text variant="caption" color={selected ? `${colors.bg}BB` : colors.textMuted}>{description}</Text>
      )}
    </Pressable>
  );
}

export function SetupQuestionsScreen() {
  const navigation = useNavigation<any>();
  const [duration, setDuration] = useState<Duration | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [triggers, setTriggers] = useState<Trigger[]>([]);

  function toggleTrigger(t: Trigger) {
    setTriggers((prev) => {
      if (prev.includes(t)) return prev.filter((x) => x !== t);
      if (prev.length >= 2) return [prev[1], t]; // drop oldest, add new
      return [...prev, t];
    });
  }

  const canContinue = duration !== null && goal !== null && triggers.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Q1 */}
        <View style={styles.section}>
          <Text variant="labelSm" color={colors.textMuted} style={styles.sectionLabel}>QUESTION 1 OF 3</Text>
          <Text variant="h2" style={styles.question}>How long have you been trying to quit?</Text>
          <View style={styles.chipRow}>
            {DURATIONS.map((d) => (
              <OptionChip
                key={d.value}
                label={d.label}
                selected={duration === d.value}
                onPress={() => setDuration(d.value)}
              />
            ))}
          </View>
        </View>

        {/* Q2 */}
        <View style={styles.section}>
          <Text variant="labelSm" color={colors.textMuted} style={styles.sectionLabel}>QUESTION 2 OF 3</Text>
          <Text variant="h2" style={styles.question}>What's your main goal?</Text>
          <View style={styles.chipRow}>
            {GOALS.map((g) => (
              <OptionChip
                key={g.value}
                label={g.label}
                selected={goal === g.value}
                onPress={() => setGoal(g.value)}
              />
            ))}
          </View>
        </View>

        {/* Q3 */}
        <View style={styles.section}>
          <Text variant="labelSm" color={colors.textMuted} style={styles.sectionLabel}>QUESTION 3 OF 3</Text>
          <Text variant="h2" style={styles.question}>What are your biggest triggers?</Text>
          <Text variant="caption" color={colors.textMuted} style={styles.triggerNote}>
            Pick up to 2. Be specific — this personalizes your urge tools.
          </Text>
          <View style={styles.triggerGrid}>
            {TRIGGERS.map((t) => (
              <OptionChip
                key={t.value}
                label={t.label}
                description={t.description}
                selected={triggers.includes(t.value)}
                onPress={() => toggleTrigger(t.value)}
              />
            ))}
          </View>
        </View>

        <Button
          label="Continue"
          onPress={() => navigation.navigate('WhyAnchor')}
          fullWidth
          size="lg"
          disabled={!canContinue}
          style={styles.continueBtn}
        />

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionLabel: {
    letterSpacing: 3,
  },
  question: {
    lineHeight: 30,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  triggerNote: {
    marginTop: -spacing.sm,
  },
  triggerGrid: {
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 2,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  continueBtn: {
    marginTop: spacing.md,
  },
});
