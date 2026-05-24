import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { colors, spacing } from '@/theme';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { LifeTree } from '@/components/features/LifeTree';
import { useUserStore } from '@/stores/userStore';

export function StreakStartScreen() {
  const navigation = useNavigation<any>();
  const setOnboardingComplete = useUserStore((s) => s.setOnboardingComplete);
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  function handleStart() {
    setOnboardingComplete();
    // Navigation handled by AppNavigator re-render when hasCompletedOnboarding flips
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View
        style={[styles.container, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}
      >
        <LifeTree days={0} size={200} />

        <View style={styles.textBlock}>
          <Text variant="h1" style={styles.headline}>
            Your journey starts now.
          </Text>
          <Text variant="display" color={colors.primary} style={styles.day0}>
            Day 0.
          </Text>
          <Text variant="body" color={colors.textSecondary} style={styles.body}>
            The seed is planted. Every day you hold on, your tree grows deeper roots.
          </Text>
        </View>

        <View style={styles.spacer} />

        <Button
          label="Let's go"
          onPress={handleStart}
          fullWidth
          size="lg"
        />
      </Animated.View>
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
    alignItems: 'center',
  },
  textBlock: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  headline: {
    textAlign: 'center',
  },
  day0: {
    fontSize: 56,
    lineHeight: 64,
    fontStyle: 'italic',
  },
  body: {
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 24,
  },
  spacer: {
    flex: 1,
  },
});
