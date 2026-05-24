export type Mode = 'secular' | 'faith';
export type Denomination = 'christian' | 'muslim' | 'jewish' | 'buddhist' | 'hindu' | 'other_faith' | null;
export type Goal = 'quit_entirely' | 'reduce' | 'not_sure';
export type Trigger = 'boredom' | 'stress' | 'loneliness' | 'late_night' | 'anxiety';
export type JournalEntryType = 'reflection' | 'temptation' | 'gratitude' | 'relapse_reflection' | 'scripture';

export interface TriggerWeights {
  boredom: number;
  stress: number;
  loneliness: number;
  late_night: number;
  anxiety: number;
}

export interface NotificationPreferences {
  checkin_time: string; // HH:MM
  checkin_enabled: boolean;
  milestones_enabled: boolean;
  pod_activity_enabled: boolean;
  quiet_start: string | null;
  quiet_end: string | null;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  created_at: string;
  mode: Mode;
  faith_denomination: Denomination;
  streak_start_date: string | null;
  longest_streak: number;
  timezone: string;
  goal: Goal;
  notification_preferences: NotificationPreferences;
  is_anonymous: boolean;
  show_on_leaderboard: boolean;
  trigger_weights: TriggerWeights;
  why_anchor: string;
  personal_verses: string[];
}

export interface CheckIn {
  id: string;
  user_id: string;
  date: string;
  mood_score: 1 | 2 | 3 | 4 | 5;
  notes: string | null;
  crisis_flagged: boolean;
}

export interface SideEffectLog {
  id: string;
  user_id: string;
  week_start_date: string;
  energy: number | null;
  sleep: number | null;
  confidence: number | null;
  social_anxiety: number | null;
  focus: number | null;
  mood: number | null;
  skipped: boolean;
}

export interface Relapse {
  id: string;
  user_id: string;
  date: string;
  trigger_note: string | null;
}

export interface JournalEntry {
  id: string;
  date: string;
  streak_day_at_time: number;
  type: JournalEntryType;
  content: Record<string, string>;
  linked_mood_score: 1 | 2 | 3 | 4 | 5 | null;
  linked_relapse_id: string | null;
  created_at: string;
  updated_at: string;
}

// Navigation param list types
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  ModeSelect: undefined;
  DenominationSelect: undefined;
  SetupQuestions: undefined;
  WhyAnchor: undefined;
  AgeConfirm: undefined;
  StreakStart: undefined;
  ContentBlockerSetup: undefined;
  PodInvite: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Community: undefined;
  Progress: undefined;
  Journal: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  Profile: undefined;
  UrgeToolFlow: undefined;
  RelapseLog: undefined;
  StreakHistory: undefined;
};
