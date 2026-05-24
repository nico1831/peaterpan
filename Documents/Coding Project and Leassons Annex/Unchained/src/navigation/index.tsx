import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { colors } from '@/theme';
import { TabBar } from './TabBar';

// Screens
import { HomeScreen } from '@/screens/home/HomeScreen';
import { CommunityScreen } from '@/screens/community/CommunityScreen';
import { ProgressScreen } from '@/screens/progress/ProgressScreen';
import { JournalScreen } from '@/screens/journal/JournalScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { UrgeToolScreen } from '@/screens/home/UrgeToolScreen';
import { RelapseLogScreen } from '@/screens/home/RelapseLogScreen';

// Onboarding
import { WelcomeScreen } from '@/screens/onboarding/WelcomeScreen';
import { ModeSelectScreen } from '@/screens/onboarding/ModeSelectScreen';
import { SetupQuestionsScreen } from '@/screens/onboarding/SetupQuestionsScreen';
import { WhyAnchorScreen } from '@/screens/onboarding/WhyAnchorScreen';
import { AgeConfirmScreen } from '@/screens/onboarding/AgeConfirmScreen';
import { StreakStartScreen } from '@/screens/onboarding/StreakStartScreen';

import type { MainTabParamList } from '@/types';

const NAV_THEME = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.primary,
    notification: colors.primary,
  },
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator();
const OnboardingStackNav = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ presentation: 'modal' }}
      />
      <HomeStack.Screen
        name="UrgeToolFlow"
        component={UrgeToolScreen}
        options={{ presentation: 'fullScreenModal' }}
      />
      <HomeStack.Screen
        name="RelapseLog"
        component={RelapseLogScreen}
        options={{ presentation: 'modal' }}
      />
    </HomeStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
    </Tab.Navigator>
  );
}

function OnboardingNavigator() {
  return (
    <OnboardingStackNav.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <OnboardingStackNav.Screen name="Welcome" component={WelcomeScreen} />
      <OnboardingStackNav.Screen name="ModeSelect" component={ModeSelectScreen} />
      <OnboardingStackNav.Screen name="SetupQuestions" component={SetupQuestionsScreen} />
      <OnboardingStackNav.Screen name="WhyAnchor" component={WhyAnchorScreen} />
      <OnboardingStackNav.Screen name="AgeConfirm" component={AgeConfirmScreen} />
      <OnboardingStackNav.Screen name="StreakStart" component={StreakStartScreen} />
    </OnboardingStackNav.Navigator>
  );
}

interface Props {
  isOnboarded: boolean;
}

export function AppNavigator({ isOnboarded }: Props) {
  return (
    <NavigationContainer theme={NAV_THEME}>
      {isOnboarded ? <MainTabs /> : <OnboardingNavigator />}
    </NavigationContainer>
  );
}
