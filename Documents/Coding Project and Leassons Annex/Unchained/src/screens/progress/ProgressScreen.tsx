import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Line } from 'react-native-svg';

import { colors, spacing, radius } from '@/theme';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';

// Mock weekly data — 6 weeks
const WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];

const DIMENSIONS = [
  { key: 'energy', label: 'Energy', data: [2, 2.5, 3, 3.5, 3.8, 4.2], color: colors.primary },
  { key: 'sleep', label: 'Sleep', data: [1.5, 2, 2.5, 3.2, 3.8, 4.5], color: colors.gold },
  { key: 'confidence', label: 'Confidence', data: [2, 2.2, 2.8, 3, 3.5, 3.9], color: '#7B8FD8' },
  { key: 'focus', label: 'Focus', data: [2.5, 3, 3.2, 3.5, 4, 4.3], color: '#D88B7B' },
  { key: 'social_anxiety', label: 'Social ease', data: [1.8, 2, 2.5, 2.8, 3.2, 3.7], color: '#8FD8B4' },
  { key: 'mood', label: 'Mood', data: [2, 2.3, 3, 3.3, 3.8, 4.1], color: '#D8C07B' },
];

function sparkImprovment(data: number[]): string {
  const first = data[0];
  const last = data[data.length - 1];
  if (first === 0) return '—';
  const pct = Math.round(((last - first) / first) * 100);
  return pct >= 0 ? `+${pct}%` : `${pct}%`;
}

function MiniSparkline({ data, color, width = 80, height = 32 }: { data: number[]; color: string; width?: number; height?: number }) {
  const max = 5;
  const min = 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / (max - min)) * height;
    return `${x},${y}`;
  });

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Path
        d={`M ${pts.join(' L ')}`}
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function WeeklyLogModal({ onClose }: { onClose: () => void }) {
  const [scores, setScores] = useState<Record<string, number>>({});

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modal}>
        <Text variant="h3" style={styles.modalTitle}>Weekly check-in</Text>
        <Text variant="body" color={colors.textSecondary} style={styles.modalSub}>
          Rate each area 1–5 for this week.
        </Text>
        {DIMENSIONS.slice(0, 6).map((dim) => (
          <View key={dim.key} style={styles.modalRow}>
            <Text variant="label" style={styles.modalDimLabel}>{dim.label}</Text>
            <View style={styles.modalScoreRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Pressable
                  key={n}
                  onPress={() => setScores((s) => ({ ...s, [dim.key]: n }))}
                  style={[
                    styles.scoreDot,
                    scores[dim.key] === n && { backgroundColor: dim.color },
                    (scores[dim.key] ?? 0) >= n && scores[dim.key] !== n && {
                      backgroundColor: `${dim.color}55`,
                    },
                  ]}
                >
                  <Text variant="caption" color={colors.textMuted}>{n}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
        <View style={styles.modalActions}>
          <Pressable onPress={onClose} style={styles.modalSkip}>
            <Text variant="label" color={colors.textMuted}>Skip this week</Text>
          </Pressable>
          <Pressable onPress={onClose} style={styles.modalSave}>
            <Text variant="label" color={colors.bg}>Save check-in</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function ProgressScreen() {
  const [showModal, setShowModal] = useState(false);
  const topGains = DIMENSIONS.slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text variant="h2">Progress</Text>
        <Pressable
          onPress={() => setShowModal(true)}
          style={styles.logBtn}
        >
          <Text variant="label" color={colors.bg}>Log this week</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top gains card */}
        <Card style={styles.gainsCard}>
          <Text variant="label" color={colors.textMuted} style={styles.gainsLabel}>SINCE WEEK 1</Text>
          <View style={styles.gainsRow}>
            {topGains.map((dim) => (
              <View key={dim.key} style={styles.gainItem}>
                <Text variant="h2" color={dim.color}>{sparkImprovment(dim.data)}</Text>
                <Text variant="caption" color={colors.textMuted}>{dim.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Dimension charts */}
        <Text variant="h3" style={styles.sectionTitle}>Weekly trends</Text>
        {DIMENSIONS.map((dim) => (
          <Card key={dim.key} style={styles.dimCard} padding="md">
            <View style={styles.dimHeader}>
              <View>
                <Text variant="label">{dim.label}</Text>
                <Text variant="caption" color={colors.textMuted}>
                  {dim.data[dim.data.length - 1].toFixed(1)} / 5 this week
                </Text>
              </View>
              <View style={styles.dimRight}>
                <Text variant="h3" color={dim.color}>{sparkImprovment(dim.data)}</Text>
                <MiniSparkline data={dim.data} color={dim.color} />
              </View>
            </View>

            {/* Full bar chart */}
            <View style={styles.barChart}>
              {dim.data.map((val, i) => (
                <View key={i} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${(val / 5) * 100}%`,
                          backgroundColor: i === dim.data.length - 1 ? dim.color : `${dim.color}55`,
                        },
                      ]}
                    />
                  </View>
                  <Text variant="caption" color={colors.textMuted}>{WEEKS[i]}</Text>
                </View>
              ))}
            </View>
          </Card>
        ))}

        <View style={{ height: spacing.xl }} />
      </ScrollView>

      {showModal && <WeeklyLogModal onClose={() => setShowModal(false)} />}
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  logBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  gainsCard: {
    gap: spacing.md,
  },
  gainsLabel: {
    letterSpacing: 2,
  },
  gainsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  gainItem: {
    alignItems: 'center',
    gap: 4,
  },
  sectionTitle: {
    marginTop: spacing.sm,
  },
  dimCard: {
    gap: spacing.md,
  },
  dimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dimRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  barChart: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  barTrack: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 3,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  modal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    marginBottom: spacing.xs,
  },
  modalSub: {
    marginBottom: spacing.sm,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalDimLabel: {
    width: 90,
  },
  modalScoreRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  scoreDot: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  modalSkip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalSave: {
    flex: 2,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
});
