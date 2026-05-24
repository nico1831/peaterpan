import React, { useState } from 'react';
import {
  View, StyleSheet, FlatList, Pressable, TextInput,
  KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';

import { colors, spacing, radius, typography } from '@/theme';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { JournalEntryType } from '@/types';

interface Entry {
  id: string;
  date: string;
  type: JournalEntryType;
  preview: string;
  streakDay: number;
}

const SAMPLE_ENTRIES: Entry[] = [
  { id: '1', date: 'Today', type: 'reflection', preview: 'Rough morning but got through it. The breathing exercise actually helped more than...', streakDay: 14 },
  { id: '2', date: 'Yesterday', type: 'gratitude', preview: 'My daughter\'s laugh. The fact I slept 8 hours. My morning coffee.', streakDay: 13 },
  { id: '3', date: 'May 21', type: 'temptation', preview: 'Boredom after work. What I did: called a friend, went for a walk. Feel...', streakDay: 11 },
];

const TYPE_COLORS: Record<JournalEntryType, string> = {
  reflection: colors.textSecondary,
  temptation: colors.primary,
  gratitude: colors.gold,
  relapse_reflection: colors.danger,
  scripture: '#7B8FD8',
};

const TYPE_LABELS: Record<JournalEntryType, string> = {
  reflection: 'Reflection',
  temptation: 'Temptation overcome',
  gratitude: 'Gratitude',
  relapse_reflection: 'Relapse reflection',
  scripture: 'Scripture',
};

type FilterChip = 'all' | JournalEntryType;

const ENTRY_TYPES: { type: JournalEntryType; label: string; description: string }[] = [
  { type: 'reflection', label: 'Daily reflection', description: 'Open freeform — how was today?' },
  { type: 'temptation', label: 'Temptation overcome', description: 'What happened, what you did instead' },
  { type: 'gratitude', label: 'Gratitude', description: 'Three things, however small' },
];

function NewEntrySheet({
  visible, onClose,
}: { visible: boolean; onClose: () => void }) {
  const [step, setStep] = useState<'type' | 'write'>('type');
  const [selectedType, setSelectedType] = useState<JournalEntryType | null>(null);
  const [text, setText] = useState('');

  function handleClose() {
    setStep('type');
    setSelectedType(null);
    setText('');
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <SafeAreaView style={styles.sheetSafeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.sheetHeader}>
            <Pressable onPress={handleClose}>
              <Text variant="label" color={colors.textMuted}>Cancel</Text>
            </Pressable>
            <Text variant="h3">New entry</Text>
            <View style={{ width: 50 }} />
          </View>

          {step === 'type' && (
            <View style={styles.typeList}>
              <Text variant="body" color={colors.textSecondary} style={styles.typePrompt}>
                What kind of entry?
              </Text>
              {ENTRY_TYPES.map((et) => (
                <Pressable
                  key={et.type}
                  onPress={() => { setSelectedType(et.type); setStep('write'); }}
                  style={({ pressed }) => [styles.typeCard, pressed && { opacity: 0.8 }]}
                >
                  <View style={[styles.typeAccent, { backgroundColor: `${TYPE_COLORS[et.type]}22` }]}>
                    <Text variant="h3" color={TYPE_COLORS[et.type]}>+</Text>
                  </View>
                  <View style={styles.typeInfo}>
                    <Text variant="label">{et.label}</Text>
                    <Text variant="caption" color={colors.textMuted}>{et.description}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {step === 'write' && selectedType && (
            <View style={styles.writeContainer}>
              <View style={[styles.typePill, { backgroundColor: `${TYPE_COLORS[selectedType]}22` }]}>
                <Text variant="labelSm" color={TYPE_COLORS[selectedType]}>
                  {TYPE_LABELS[selectedType]}
                </Text>
              </View>
              <TextInput
                style={styles.writeInput}
                value={text}
                onChangeText={setText}
                placeholder={selectedType === 'gratitude'
                  ? "I'm grateful for..."
                  : selectedType === 'temptation'
                  ? 'What happened, and what did you do instead?'
                  : 'How are you feeling today?'
                }
                placeholderTextColor={colors.textMuted}
                multiline
                autoFocus
              />
              <View style={styles.writeFooter}>
                <Button
                  label="Save entry"
                  onPress={handleClose}
                  fullWidth
                  size="lg"
                  disabled={text.trim().length < 3}
                />
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

export function JournalScreen() {
  const [filter, setFilter] = useState<FilterChip>('all');
  const [showNewEntry, setShowNewEntry] = useState(false);

  const chips: FilterChip[] = ['all', 'reflection', 'temptation', 'gratitude'];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text variant="h2">Journal</Text>
        <Pressable onPress={() => setShowNewEntry(true)} style={styles.addBtn}>
          <Text variant="label" color={colors.bg}>+ Write</Text>
        </Pressable>
      </View>

      {/* Filter chips */}
      <View style={styles.filtersRow}>
        {chips.map((c) => (
          <Pressable
            key={c}
            onPress={() => setFilter(c)}
            style={[styles.filterChip, filter === c && styles.filterChipActive]}
          >
            <Text
              variant="labelSm"
              color={filter === c ? colors.bg : colors.textMuted}
              style={{ textTransform: 'capitalize' }}
            >
              {c === 'all' ? 'All' : TYPE_LABELS[c as JournalEntryType]}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={SAMPLE_ENTRIES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={({ pressed }) => [styles.entryCard, pressed && { opacity: 0.8 }]}>
            <View style={styles.entryTop}>
              <View style={[styles.entryTypePill, { backgroundColor: `${TYPE_COLORS[item.type]}18` }]}>
                <Text variant="labelSm" color={TYPE_COLORS[item.type]}>
                  {TYPE_LABELS[item.type]}
                </Text>
              </View>
              <Text variant="caption" color={colors.textMuted}>{item.date} · Day {item.streakDay}</Text>
            </View>
            <Text variant="body" color={colors.textSecondary} numberOfLines={2} style={styles.entryPreview}>
              {item.preview}
            </Text>
          </Pressable>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="body" color={colors.textMuted} style={styles.emptyText}>
              Your journal entries appear here. Every entry is private and stays on your device.
            </Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: spacing.xl }} />}
      />

      <NewEntrySheet visible={showNewEntry} onClose={() => setShowNewEntry(false)} />
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
  addBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.md,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  list: {
    paddingHorizontal: spacing.md,
  },
  entryCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  entryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  entryTypePill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  entryPreview: {
    lineHeight: 22,
  },
  separator: {
    height: spacing.sm,
  },
  empty: {
    paddingTop: spacing.xxl,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 24,
  },
  // New entry sheet
  sheetSafeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  typeList: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  typePrompt: {
    marginBottom: spacing.sm,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeAccent: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeInfo: {
    flex: 1,
    gap: 4,
  },
  writeContainer: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  typePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  writeInput: {
    ...typography.bodyMd,
    color: colors.textPrimary,
    flex: 1,
    textAlignVertical: 'top',
  },
  writeFooter: {
    paddingBottom: spacing.md,
  },
});
