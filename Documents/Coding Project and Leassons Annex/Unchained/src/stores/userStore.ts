import { create } from 'zustand';
import type { User, Mode, Denomination, Goal, TriggerWeights } from '@/types';

interface UserStore {
  user: User | null;
  hasCompletedOnboarding: boolean;
  setUser: (user: User) => void;
  updateUser: (partial: Partial<User>) => void;
  setOnboardingComplete: () => void;
  getCurrentStreak: () => number;
  getLongestStreak: () => number;
}

const DEFAULT_TRIGGER_WEIGHTS: TriggerWeights = {
  boredom: 0,
  stress: 0,
  loneliness: 0,
  late_night: 0,
  anxiety: 0,
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  hasCompletedOnboarding: false,

  setUser: (user) => set({ user }),

  updateUser: (partial) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : null,
    })),

  setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),

  getCurrentStreak: () => {
    const { user } = get();
    if (!user?.streak_start_date) return 0;
    const start = new Date(user.streak_start_date);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  },

  getLongestStreak: () => {
    const { user } = get();
    return user?.longest_streak ?? 0;
  },
}));
