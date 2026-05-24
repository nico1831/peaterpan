export const colors = {
  // Backgrounds
  bg: '#0F0F13',
  surface: '#171720',
  card: '#1E1E2A',
  cardHover: '#252535',
  border: '#2A2A3A',

  // Primary — forest green
  primary: '#4CAF82',
  primaryDim: '#2E6B50',
  primaryMuted: 'rgba(76, 175, 130, 0.12)',

  // Milestone gold
  gold: '#C9A84C',
  goldMuted: 'rgba(201, 168, 76, 0.15)',

  // Danger / relapse
  danger: '#C05C5C',
  dangerMuted: 'rgba(192, 92, 92, 0.15)',

  // Text
  textPrimary: '#F2F0EB',
  textSecondary: '#8A8A9E',
  textMuted: '#4A4A62',

  // Utility
  white: '#FFFFFF',
  transparent: 'transparent',

  // Streak label tiers (matches milestone stages)
  treeSeed: '#6B8F6B',
  treeSprout: '#5AAF72',
  treeYoung: '#4CAF82',
  treeMature: '#3D9B70',
  treeAncient: '#C9A84C',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  // Display — streak number, hero
  display: { fontSize: 72, fontWeight: '700' as const, letterSpacing: -2, lineHeight: 80 },
  // Headings
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5, lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '600' as const, letterSpacing: -0.3, lineHeight: 28 },
  h3: { fontSize: 17, fontWeight: '600' as const, letterSpacing: -0.1, lineHeight: 22 },
  // Body
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodyMd: { fontSize: 17, fontWeight: '400' as const, lineHeight: 26 },
  // Labels
  label: { fontSize: 13, fontWeight: '500' as const, letterSpacing: 0.3, lineHeight: 18 },
  labelSm: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.8, lineHeight: 15 },
  // Caption
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
} as const;

// Milestone stage labels (PRD §5.1)
export const milestoneLabels: Record<number, string> = {
  0: 'Day one.',
  1: 'First step.',
  3: 'First sprout.',
  7: 'One week clear.',
  14: 'In the clearing.',
  30: 'In bloom.',
  60: 'Deep roots.',
  90: 'Ancient growth.',
};

export function getMilestoneLabel(days: number): string {
  const checkpoints = [90, 60, 30, 14, 7, 3, 1, 0];
  const reached = checkpoints.find((c) => days >= c);
  return milestoneLabels[reached ?? 0];
}
