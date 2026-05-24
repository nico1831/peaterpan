import React, { useState, useEffect } from 'react';
import {
  View, ScrollView, StyleSheet, Pressable,
  StatusBar, Platform, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';

import { colors, spacing, radius, typography } from '@/theme';
import { getMilestoneLabel } from '@/theme';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { LifeTree } from '@/components/features/LifeTree';

// Demo streak — will come from store in next iteration
const DEMO_DAYS = 14;

function AvatarIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} fill={color} />
      <Path d="M4 20C4 17.24 7.58 15 12 15C16.42 15 20 17.24 20 20" stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function PanicIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill={colors.bg} />
      <Path d="M12 11.5C13.38 11.5 14.5 10.38 14.5 9C14.5 7.62 13.38 6.5 12 6.5C10.62 6.5 9.5 7.62 9.5 9C9.5 10.38 10.62 11.5 12 11.5Z" fill={colors.bg} />
    </Svg>
  );
}

function MoodChip({ score, label, active, onPress }: { score: number; label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.moodChip,
        active && styles.moodChipActive,
        pressed && { opacity: 0.75 },
      ]}
    >
      <Text variant="label" color={active ? colors.bg : colors.textSecondary}>{label}</Text>
    </Pressable>
  );
}

const MOOD_OPTIONS = [
  { score: 1, label: 'Rough' },
  { score: 2, label: 'Low' },
  { score: 3, label: 'Okay' },
  { score: 4, label: 'Good' },
  { score: 5, label: 'Strong' },
];

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  // Pulse the panic button
  useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.06, duration: 1100, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 1100, useNativeDriver: true }),
    ]);
    Animated.loop(pulse).start();
  }, []);

  const days = DEMO_DAYS;
  const milestoneLabel = getMilestoneLabel(days);

  function handleMoodSubmit() {
    if (selectedMood === null) return;
    setCheckedInToday(true);
    // TODO: persist to CheckIn store / Supabase
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text variant="labelSm" color={colors.textMuted} style={styles.appName}>UNCHAINED</Text>
          <Text variant="h3">Good evening</Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Profile')}
          style={styles.avatarButton}
        >
          <AvatarIcon color={colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Streak card */}
        <Card style={styles.streakCard}>
          {/* Life Tree */}
          <View style={styles.treeContainer}>
            <LifeTree days={days} size={180} />
          </View>

          {/* Streak counter */}
          <View style={styles.streakNumbers}>
            <Text variant="display" style={styles.streakCount}>{days}</Text>
            <Text variant="h3" color={colors.textSecondary}>
              {days === 1 ? 'day' : 'days'}
            </Text>
          </View>

          {/* Milestone label */}
          <Text variant="body" color={colors.primary} style={styles.milestoneLabel}>
            {milestoneLabel}
          </Text>

          {/* Longest streak sub-line */}
          <Text variant="caption" color={colors.textMuted} style={styles.longestStreak}>
            Longest streak: {days} days
          </Text>

          {/* Streak progress bar to next milestone */}
          <StreakProgressBar days={days} />
        </Card>

        {/* Panic button */}
        <Animated.View style={[{ transform: [{ scale: pulseAnim }] }]}>
          <Pressable
            onPress={() => navigation.navigate('UrgeToolFlow')}
            style={({ pressed }) => [styles.panicButton, pressed && { opacity: 0.9 }]}
          >
            <View style={styles.panicInner}>
              <PanicIcon />
              <View>
                <Text variant="h3" style={styles.panicLabel}>Urge Tool</Text>
                <Text variant="caption" color={colors.textMuted} style={styles.panicSub}>
                  Tap when you need it
                </Text>
              </View>
            </View>
          </Pressable>
        </Animated.View>

        {/* Daily check-in card */}
        {!checkedInToday && (
          <Card style={styles.checkinCard}>
            <Text variant="h3" style={styles.checkinTitle}>How are you feeling today?</Text>
            <View style={styles.moodRow}>
              {MOOD_OPTIONS.map((opt) => (
                <MoodChip
                  key={opt.score}
                  score={opt.score}
                  label={opt.label}
                  active={selectedMood === opt.score}
                  onPress={() => setSelectedMood(opt.score)}
                />
              ))}
            </View>
            <Pressable
              onPress={handleMoodSubmit}
              style={({ pressed }) => [
                styles.logButton,
                !selectedMood && styles.logButtonDisabled,
                pressed && { opacity: 0.8 },
              ]}
              disabled={!selectedMood}
            >
              <Text variant="label" color={selectedMood ? colors.bg : colors.textMuted}>
                Log it
              </Text>
            </Pressable>
          </Card>
        )}

        {checkedInToday && (
          <Card style={styles.checkinDoneCard}>
            <Text variant="label" color={colors.primary}>✓ Checked in today</Text>
          </Card>
        )}

        {/* Quick actions */}
        <View style={styles.quickActions}>
          <QuickAction
            label="Log relapse"
            sublabel="No shame here"
            color={colors.danger}
            bgColor={colors.dangerMuted}
            onPress={() => navigation.navigate('RelapseLog')}
          />
          <QuickAction
            label="Streak history"
            sublabel="View your calendar"
            color={colors.textSecondary}
            bgColor={colors.card}
            onPress={() => {}}
          />
        </View>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StreakProgressBar({ days }: { days: number }) {
  const milestones = [1, 3, 7, 14, 30, 60, 90];
  const next = milestones.find((m) => m > days);
  const prev = milestones.filter((m) => m <= days).pop() ?? 0;

  if (!next) {
    return (
      <View style={styles.progressContainer}>
        <Text variant="caption" color={colors.gold}>Ancient growth — you made it.</Text>
      </View>
    );
  }

  const progress = (days - prev) / (next - prev);

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
      </View>
      <Text variant="caption" color={colors.textMuted}>
        {next - days} days to Day {next}
      </Text>
    </View>
  );
}

function QuickAction({
  label, sublabel, color, bgColor, onPress,
}: {
  label: string; sublabel: string; color: string; bgColor: string; onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.quickAction, { backgroundColor: bgColor }, pressed && { opacity: 0.75 }]}
    >
      <Text variant="label" color={color}>{label}</Text>
      <Text variant="caption" color={colors.textMuted}>{sublabel}</Text>
    </Pressable>
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  appName: {
    letterSpacing: 2,
    marginBottom: 2,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  streakCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  treeContainer: {
    marginBottom: spacing.sm,
  },
  streakNumbers: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  streakCount: {
    color: colors.textPrimary,
    lineHeight: 80,
  },
  milestoneLabel: {
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  longestStreak: {
    marginTop: 2,
  },
  progressContainer: {
    width: '100%',
    marginTop: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  progressTrack: {
    width: '80%',
    height: 3,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  panicButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  panicInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  panicLabel: {
    color: colors.bg,
  },
  panicSub: {
    color: `${colors.bg}99`,
    marginTop: 2,
  },
  checkinCard: {
    gap: spacing.md,
  },
  checkinTitle: {
    fontSize: 16,
  },
  moodRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  moodChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  moodChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  logButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logButtonDisabled: {
    backgroundColor: colors.card,
  },
  checkinDoneCard: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderColor: colors.primaryDim,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quickAction: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
