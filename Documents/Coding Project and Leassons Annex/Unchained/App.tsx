import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import { AppNavigator } from '@/navigation';
import { useUserStore } from '@/stores/userStore';

export default function App() {
  const hasCompletedOnboarding = useUserStore((s) => s.hasCompletedOnboarding);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AppNavigator isOnboarded={hasCompletedOnboarding} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
