import React, { useState } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { colors, spacing, radius, typography } from '@/theme';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';

export function WhyAnchorScreen() {
  const navigation = useNavigation<any>();
  const [why, setWhy] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text variant="labelSm" color={colors.textMuted} style={styles.sectionLabel}>YOUR WHY</Text>

        <Text variant="h1" style={styles.headline}>Set your anchor.</Text>

        <Text variant="body" color={colors.textSecondary} style={styles.body}>
          This is what you'll see during urge moments. Be honest with yourself.
        </Text>

        <View style={styles.inputContainer}>
          <Text variant="body" color={colors.textSecondary} style={styles.prefix}>
            I'm doing this for —
          </Text>
          <TextInput
            style={styles.input}
            value={why}
            onChangeText={setWhy}
            placeholder="my family, my peace of mind, myself…"
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={200}
            autoFocus
          />
          <Text variant="caption" color={colors.textMuted} style={styles.charCount}>
            {why.length}/200
          </Text>
        </View>

        <View style={styles.spacer} />

        <View style={styles.footer}>
          <Button
            label="Set my anchor"
            onPress={() => navigation.navigate('AgeConfirm')}
            fullWidth
            size="lg"
            disabled={why.trim().length < 3}
          />
          <Button
            label="Skip for now"
            onPress={() => navigation.navigate('AgeConfirm')}
            fullWidth
            size="md"
            variant="ghost"
          />
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
  inputContainer: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  prefix: {
    fontStyle: 'italic',
  },
  input: {
    ...typography.bodyMd,
    color: colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
  },
  spacer: {
    flex: 1,
  },
  footer: {
    gap: spacing.sm,
  },
});
