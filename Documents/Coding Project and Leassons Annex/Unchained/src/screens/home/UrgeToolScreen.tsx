import React, { useState, useEffect, useRef } from 'react';
import {
  View, StyleSheet, Pressable, ScrollView, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';

import { colors, spacing, radius, typography } from '@/theme';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type Step = 'breathing' | 'surfing' | 'distractions' | 'anchor' | 'done';

// Breathing animation — 4-7-8 pattern
function BreathingGuide() {
  const scale = useRef(new Animated.Value(0.6)).current;
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    const sequence = [
      // Inhale 4s
      { phase: 'inhale' as const, duration: 4000, toScale: 1 },
      // Hold 7s
      { phase: 'hold' as const, duration: 7000, toScale: 1 },
      // Exhale 8s
      { phase: 'exhale' as const, duration: 8000, toScale: 0.6 },
    ];

    let idx = 0;
    let timer: ReturnType<typeof setTimeout>;
    let countTimer: ReturnType<typeof setInterval>;

    function runPhase() {
      const current = sequence[idx % sequence.length];
      setPhase(current.phase);
      const totalSecs = current.duration / 1000;
      setSeconds(totalSecs);

      Animated.timing(scale, {
        toValue: current.toScale,
        duration: current.duration,
        useNativeDriver: true,
      }).start();

      let elapsed = 0;
      countTimer = setInterval(() => {
        elapsed++;
        setSeconds(Math.max(totalSecs - elapsed, 0));
      }, 1000);

      timer = setTimeout(() => {
        clearInterval(countTimer);
        idx++;
        runPhase();
      }, current.duration);
    }

    runPhase();
    return () => { clearTimeout(timer); clearInterval(countTimer); };
  }, []);

  const PHASE_LABELS = { inhale: 'Breathe in', hold: 'Hold', exhale: 'Breathe out' };

  return (
    <View style={styles.breathingGuide}>
      <Animated.View style={[styles.breathCircleOuter, { transform: [{ scale }] }]}>
        <View style={styles.breathCircleInner}>
          <Text variant="label" color={colors.primary}>{PHASE_LABELS[phase]}</Text>
          <Text variant="h2" color={colors.textPrimary}>{seconds}</Text>
        </View>
      </Animated.View>
      <Text variant="body" color={colors.textSecondary} style={styles.breathInstruction}>
        4-7-8 breathing. Follow the circle.
      </Text>
    </View>
  );
}

// Urge surfing step — 20 minute countdown
function UrgeSurfing() {
  const [elapsed, setElapsed] = useState(0);
  const TOTAL = 20 * 60;
  const progress = Math.min(elapsed / TOTAL, 1);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const remaining = TOTAL - elapsed;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <View style={styles.surfingContainer}>
      <Text variant="bodyMd" color={colors.textPrimary} style={styles.surfingQuote}>
        "This urge will peak and pass within 20 minutes. You don't have to act on it. Just observe it."
      </Text>
      <View style={styles.timerRow}>
        <Text variant="display" color={colors.primary} style={styles.timerText}>
          {mins}:{String(secs).padStart(2, '0')}
        </Text>
      </View>
      <View style={styles.surfingTrack}>
        <View style={[styles.surfingFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text variant="caption" color={colors.textMuted}>Observe the sensation. It will pass.</Text>
    </View>
  );
}

const DISTRACTIONS = [
  'Do 20 push-ups',
  'Text someone you trust',
  'Go outside for 5 minutes',
  'List 5 things you\'re grateful for',
  'Drink a glass of water',
  'Take a cold shower',
  'Call a friend or family member',
  'Write in your journal',
];

function Distractions() {
  return (
    <View style={styles.distractionsContainer}>
      <Text variant="body" color={colors.textSecondary} style={styles.distractionsIntro}>
        Break the loop. Pick one and do it now.
      </Text>
      {DISTRACTIONS.map((task, i) => (
        <Pressable key={i} style={({ pressed }) => [styles.distraction, pressed && { opacity: 0.7 }]}>
          <Text variant="label" color={colors.textPrimary}>→ {task}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const STEP_ORDER: Step[] = ['breathing', 'surfing', 'distractions', 'anchor', 'done'];
const STEP_TITLES: Record<Step, string> = {
  breathing: 'Breathe through it',
  surfing: 'Ride the wave',
  distractions: 'Break the loop',
  anchor: 'Your why',
  done: 'You made it.',
};

export function UrgeToolScreen() {
  const navigation = useNavigation<any>();
  const [stepIdx, setStepIdx] = useState(0);
  const currentStep = STEP_ORDER[stepIdx];
  const isLast = stepIdx === STEP_ORDER.length - 1;

  function next() {
    if (isLast) {
      navigation.goBack();
    } else {
      setStepIdx((i) => i + 1);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text variant="label" color={colors.textMuted}>✕ Exit</Text>
        </Pressable>
        <View style={styles.stepDots}>
          {STEP_ORDER.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === stepIdx && styles.dotActive, i < stepIdx && styles.dotDone]}
            />
          ))}
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text variant="h2" style={styles.stepTitle}>{STEP_TITLES[currentStep]}</Text>

        {currentStep === 'breathing' && <BreathingGuide />}
        {currentStep === 'surfing' && <UrgeSurfing />}
        {currentStep === 'distractions' && <Distractions />}
        {currentStep === 'anchor' && (
          <Card style={styles.anchorCard}>
            <Text variant="label" color={colors.textMuted} style={styles.anchorLabel}>YOUR ANCHOR</Text>
            <Text variant="bodyMd" style={styles.anchorText}>
              "I'm doing this for my family and my peace of mind."
            </Text>
            <Text variant="caption" color={colors.textMuted} style={styles.anchorEdit}>
              Edit from Profile → Why anchor
            </Text>
          </Card>
        )}
        {currentStep === 'done' && (
          <View style={styles.doneContainer}>
            <Text variant="h1" color={colors.primary} style={styles.doneEmoji}>✓</Text>
            <Text variant="bodyMd" color={colors.textSecondary} style={styles.doneBody}>
              You held on. That's what recovery looks like. Your streak is intact.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={isLast ? 'Close' : 'Next step'}
          onPress={next}
          fullWidth
          size="lg"
        />
        {!isLast && (
          <Button
            label="Skip this step"
            onPress={next}
            fullWidth
            size="md"
            variant="ghost"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  closeBtn: {
    padding: spacing.sm,
  },
  stepDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 16,
  },
  dotDone: {
    backgroundColor: colors.primaryDim,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
    flexGrow: 1,
  },
  stepTitle: {
    marginBottom: spacing.sm,
  },
  breathingGuide: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.xl,
  },
  breathCircleOuter: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.primaryMuted,
    borderWidth: 2,
    borderColor: colors.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathCircleInner: {
    alignItems: 'center',
    gap: 4,
  },
  breathInstruction: {
    textAlign: 'center',
  },
  surfingContainer: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.md,
  },
  surfingQuote: {
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 26,
  },
  timerRow: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 64,
    lineHeight: 72,
  },
  surfingTrack: {
    width: '80%',
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  surfingFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  distractionsContainer: {
    gap: spacing.sm,
  },
  distractionsIntro: {
    marginBottom: spacing.sm,
  },
  distraction: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  anchorCard: {
    gap: spacing.sm,
  },
  anchorLabel: {
    letterSpacing: 2,
  },
  anchorText: {
    fontStyle: 'italic',
    lineHeight: 28,
  },
  anchorEdit: {
    marginTop: spacing.sm,
  },
  doneContainer: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.xl,
  },
  doneEmoji: {
    fontSize: 72,
  },
  doneBody: {
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 26,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
});
