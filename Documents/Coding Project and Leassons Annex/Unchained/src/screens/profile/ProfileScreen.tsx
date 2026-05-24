import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, Pressable, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { colors, spacing, radius } from '@/theme';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';

const AVATARS = ['🌱', '🌿', '🌳', '🌲', '🪵', '🌾', '🍃', '🌺'];

type Tab = 'account' | 'settings';

function SettingRow({
  label, value, onToggle, type = 'toggle',
}: { label: string; value?: boolean; onToggle?: (v: boolean) => void; type?: 'toggle' | 'nav' }) {
  return (
    <View style={styles.settingRow}>
      <Text variant="body">{label}</Text>
      {type === 'toggle' && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ true: colors.primary, false: colors.border }}
          thumbColor={colors.textPrimary}
        />
      )}
      {type === 'nav' && (
        <Text variant="body" color={colors.textMuted}>›</Text>
      )}
    </View>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <Text variant="labelSm" color={colors.textMuted} style={styles.sectionHeader}>
      {label}
    </Text>
  );
}

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<Tab>('account');
  const [selectedAvatar, setSelectedAvatar] = useState('🌱');
  const [checkinEnabled, setCheckinEnabled] = useState(true);
  const [milestonesEnabled, setMilestonesEnabled] = useState(true);
  const [podEnabled, setPodEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [anonMode, setAnonMode] = useState(false);
  const [leaderboard, setLeaderboard] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text variant="label" color={colors.textMuted}>Close</Text>
        </Pressable>
        <Text variant="h3">Profile</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Tab switcher */}
      <View style={styles.tabRow}>
        {(['account', 'settings'] as Tab[]).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
          >
            <Text
              variant="label"
              color={activeTab === tab ? colors.textPrimary : colors.textMuted}
              style={{ textTransform: 'capitalize' }}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'account' && (
          <>
            {/* Avatar picker */}
            <Card style={styles.avatarSection}>
              <View style={styles.avatarRow}>
                {AVATARS.map((a) => (
                  <Pressable
                    key={a}
                    onPress={() => setSelectedAvatar(a)}
                    style={[styles.avatarOption, selectedAvatar === a && styles.avatarSelected]}
                  >
                    <Text style={styles.avatarEmoji}>{a}</Text>
                  </Pressable>
                ))}
              </View>
            </Card>

            {/* Identity */}
            <SectionHeader label="IDENTITY" />
            <Card>
              <SettingRow label="Display name" type="nav" />
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text variant="body" color={colors.textSecondary}>Member since</Text>
                <Text variant="body" color={colors.textMuted}>May 24, 2026</Text>
              </View>
            </Card>

            {/* Recovery profile */}
            <SectionHeader label="RECOVERY PROFILE" />
            <Card>
              <SettingRow label="Mode" type="nav" />
              <View style={styles.divider} />
              <SettingRow label="Primary goal" type="nav" />
              <View style={styles.divider} />
              <SettingRow label="Triggers" type="nav" />
              <View style={styles.divider} />
              <SettingRow label="Why anchor" type="nav" />
            </Card>

            {/* Leaderboard */}
            <SectionHeader label="COMMUNITY" />
            <Card>
              <SettingRow
                label="Show my streak on leaderboard"
                value={leaderboard}
                onToggle={setLeaderboard}
              />
            </Card>

            {/* Danger zone */}
            <SectionHeader label="ACCOUNT" />
            <Card>
              <Pressable style={styles.settingRow}>
                <Text variant="body" color={colors.primary}>Export my data</Text>
              </Pressable>
              <View style={styles.divider} />
              <Pressable style={styles.settingRow}>
                <Text variant="body">Log out</Text>
              </Pressable>
            </Card>

            <Card style={styles.dangerCard}>
              <Pressable style={styles.settingRow}>
                <Text variant="body" color={colors.danger}>Delete account</Text>
              </Pressable>
            </Card>
          </>
        )}

        {activeTab === 'settings' && (
          <>
            <SectionHeader label="NOTIFICATIONS" />
            <Card>
              <SettingRow label="Daily check-in reminder" value={checkinEnabled} onToggle={setCheckinEnabled} />
              <View style={styles.divider} />
              <SettingRow label="Milestone celebrations" value={milestonesEnabled} onToggle={setMilestonesEnabled} />
              <View style={styles.divider} />
              <SettingRow label="Pod activity" value={podEnabled} onToggle={setPodEnabled} />
              <View style={styles.divider} />
              <SettingRow label="Quiet hours" type="nav" />
            </Card>

            <SectionHeader label="CONTENT BLOCKER" />
            <Card>
              <SettingRow label="DNS blocker" value={true} onToggle={() => {}} />
              <View style={styles.divider} />
              <SettingRow label="Distraction apps" type="nav" />
              <View style={styles.divider} />
              <SettingRow label="Custom URLs" type="nav" />
            </Card>

            <SectionHeader label="APP BEHAVIOUR" />
            <Card>
              <SettingRow label="Haptics" value={hapticsEnabled} onToggle={setHapticsEnabled} />
              <View style={styles.divider} />
              <SettingRow label="Anonymous mode" value={anonMode} onToggle={setAnonMode} />
            </Card>

            <SectionHeader label="ABOUT" />
            <Card>
              <SettingRow label="Privacy policy" type="nav" />
              <View style={styles.divider} />
              <SettingRow label="Open source (GitHub)" type="nav" />
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text variant="body" color={colors.textSecondary}>Version</Text>
                <Text variant="body" color={colors.textMuted}>1.0.0</Text>
              </View>
            </Card>

            <View style={styles.disclaimerBlock}>
              <Text variant="caption" color={colors.textMuted} style={styles.disclaimer}>
                This app is not a substitute for professional mental health treatment.
              </Text>
            </View>
          </>
        )}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
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
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeBtn: {
    padding: spacing.xs,
    minWidth: 50,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.card,
    borderColor: colors.primary,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  sectionHeader: {
    letterSpacing: 2,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  avatarSection: {
    marginBottom: spacing.sm,
  },
  avatarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  avatarOption: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  avatarSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  dangerCard: {
    marginTop: spacing.md,
    borderColor: `${colors.danger}44`,
  },
  disclaimerBlock: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  disclaimer: {
    textAlign: 'center',
    lineHeight: 18,
  },
});
