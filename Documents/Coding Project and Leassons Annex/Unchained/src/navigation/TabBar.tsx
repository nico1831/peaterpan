import React from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { colors, spacing, typography } from '@/theme';
import { Text } from '@/components/ui/Text';

// Inline SVG icons — no icon lib dependency
function HomeIcon({ filled, color }: { filled: boolean; color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={filled ? 0 : 1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CommunityIcon({ filled, color }: { filled: boolean; color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx={9} cy={8} r={3.2} fill={filled ? color : 'none'} stroke={color} strokeWidth={filled ? 0 : 1.8} />
      <Circle cx={16} cy={9} r={2.5} fill={filled ? color : 'none'} stroke={color} strokeWidth={filled ? 0 : 1.8} />
      <Path
        d="M2 19C2 16.24 5.13 14 9 14C12.87 14 16 16.24 16 19"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none"
      />
      <Path
        d="M16 14.5C18.5 14.5 21 16 21 18.5"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none"
      />
    </Svg>
  );
}

function ProgressIcon({ filled, color }: { filled: boolean; color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 18L8 12L12 15L17 9L21 11"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <Path d="M3 21H21" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      {filled && <Path d="M3 18L8 12L12 15L17 9L21 11L21 21H3Z" fill={color} opacity={0.2} />}
    </Svg>
  );
}

function JournalIcon({ filled, color }: { filled: boolean; color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect
        x={4} y={3} width={14} height={18} rx={2}
        fill={filled ? color : 'none'}
        stroke={color} strokeWidth={filled ? 0 : 1.8}
      />
      <Path d="M8 8H14" stroke={filled ? colors.bg : color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M8 12H14" stroke={filled ? colors.bg : color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M8 16H11" stroke={filled ? colors.bg : color} strokeWidth={1.6} strokeLinecap="round" />
      {/* Pen detail */}
      <Path d="M16 20L19 17L21 19L18 22L16 20Z" fill={color} />
      <Path d="M19 17L20.5 15.5" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  );
}

const TAB_ICONS: Record<string, (filled: boolean, color: string) => React.ReactNode> = {
  Home: (f, c) => <HomeIcon filled={f} color={c} />,
  Community: (f, c) => <CommunityIcon filled={f} color={c} />,
  Progress: (f, c) => <ProgressIcon filled={f} color={c} />,
  Journal: (f, c) => <JournalIcon filled={f} color={c} />,
};

const TAB_LABELS: Record<string, string> = {
  Home: 'Home',
  Community: 'Community',
  Progress: 'Progress',
  Journal: 'Journal',
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const color = focused ? colors.primary : colors.textMuted;
          const IconFn = TAB_ICONS[route.name];

          return (
            <Pressable
              key={route.key}
              onPress={() => {
                if (!focused) navigation.navigate(route.name);
              }}
              style={({ pressed }) => [styles.tab, pressed && { opacity: 0.7 }]}
              accessibilityRole="button"
              accessibilityLabel={TAB_LABELS[route.name]}
            >
              {IconFn?.(focused, color)}
              <Text
                variant="labelSm"
                color={color}
                style={[styles.label, focused && styles.labelActive]}
              >
                {TAB_LABELS[route.name]}
              </Text>
              {focused && <View style={styles.activeDot} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: Platform.OS === 'android' ? 8 : 0,
  },
  bar: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingHorizontal: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingBottom: 6,
  },
  label: {
    textTransform: 'uppercase',
  },
  labelActive: {
    color: colors.primary,
  },
  activeDot: {
    position: 'absolute',
    top: -8,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.primary,
  },
});
