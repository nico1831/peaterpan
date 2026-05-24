import React, { useState } from 'react';
import {
  View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { colors, spacing, radius, typography } from '@/theme';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';

export function RelapseLogScreen() {
  const navigation = useNavigation<any>();
  const [note, setNote] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  function handleLog() {
    // TODO: reset streak, log relapse to store + Supabase, create relapse reflection journal prompt
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Text variant="label" color={colors.textMuted}>Cancel</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text variant="h2" style={styles.headline}>Log a relapse</Text>
          <Text variant="body" color={colors.textSecondary} style={styles.body}>
            Relapse is part of recovery. Logging it honestly is an act of courage, not failure.
          </Text>

          <Text variant="label" color={colors.textMuted} style={styles.inputLabel}>
            What triggered this? (optional)
          </Text>
          <TextInput
            style={styles.input}
            value={note}
            onChangeText={setNote}
            placeholder="What was happening? How were you feeling?"
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={500}
          />

          <View style={styles.confirmRow}>
            <Pressable
              onPress={() => setConfirmed((v) => !v)}
              style={[styles.checkbox, confirmed && styles.checkboxChecked]}
            >
              {confirmed && <Text variant="caption" color={colors.bg}>✓</Text>}
            </Pressable>
            <Text variant="body" style={styles.confirmLabel}>
              Reset my streak and start fresh.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            label="Log relapse and reset"
            onPress={handleLog}
            fullWidth
            size="lg"
            variant="danger"
            disabled={!confirmed}
          />
          <Text variant="caption" color={colors.textMuted} style={styles.footerNote}>
            Your streak will reset to Day 0. Your history and data are preserved.
          </Text>
        </View>
      </KeyboardAvoidingView>
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
    paddingBottom: spacing.lg,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  closeBtn: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  headline: {
    marginBottom: spacing.xs,
  },
  body: {
    lineHeight: 24,
  },
  inputLabel: {
    letterSpacing: 0.5,
    marginTop: spacing.sm,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.8,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  confirmLabel: {
    flex: 1,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  footerNote: {
    textAlign: 'center',
  },
});
