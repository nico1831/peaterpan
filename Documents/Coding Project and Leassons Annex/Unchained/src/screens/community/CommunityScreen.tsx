import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, Pressable, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, radius } from '@/theme';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';

type PostType = 'checkin' | 'win' | 'struggle' | 'question';
type Filter = 'all' | 'secular' | 'my_religion';

interface Post {
  id: string;
  username: string;
  avatar: string;
  type: PostType;
  content: string;
  streak: number;
  timeAgo: string;
  reactions: { fist: number; fire: number; heart: number; strength: number };
}

const SAMPLE_POSTS: Post[] = [
  {
    id: '1', username: 'recoveredwarrior', avatar: '🌿', type: 'win',
    content: 'Hit 30 days today. The first two weeks were brutal but something shifted after week 3. Keep going everyone.',
    streak: 30, timeAgo: '2h ago',
    reactions: { fist: 47, fire: 23, heart: 15, strength: 8 },
  },
  {
    id: '2', username: 'clearingthefog', avatar: '🌱', type: 'struggle',
    content: 'Day 8 and the urges are intense today. Used the breathing tool twice. Holding on.',
    streak: 8, timeAgo: '4h ago',
    reactions: { fist: 31, fire: 6, heart: 18, strength: 22 },
  },
  {
    id: '3', username: 'rootsrundeep', avatar: '🌳', type: 'checkin',
    content: 'Feeling okay today. Sleep has been noticeably better this week. Weird but real.',
    streak: 45, timeAgo: '6h ago',
    reactions: { fist: 12, fire: 9, heart: 7, strength: 3 },
  },
  {
    id: '4', username: 'firstday_again', avatar: '🌰', type: 'question',
    content: 'Does the flatline period actually end? Week 3 and I feel nothing. Not even the urges. Is that normal?',
    streak: 21, timeAgo: '9h ago',
    reactions: { fist: 8, fire: 2, heart: 24, strength: 14 },
  },
];

const TYPE_COLORS: Record<PostType, string> = {
  win: colors.primary,
  struggle: colors.danger,
  checkin: colors.textSecondary,
  question: colors.gold,
};

const TYPE_LABELS: Record<PostType, string> = {
  win: 'Win',
  struggle: 'Struggle',
  checkin: 'Check-in',
  question: 'Question',
};

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);

  return (
    <Card style={styles.postCard} padding="md">
      <View style={styles.postHeader}>
        <View style={styles.postAuthor}>
          <Text style={styles.avatar}>{post.avatar}</Text>
          <View>
            <Text variant="label" color={colors.textPrimary}>{post.username}</Text>
            <Text variant="caption" color={colors.textMuted}>{post.streak}d streak · {post.timeAgo}</Text>
          </View>
        </View>
        <View style={[styles.typeBadge, { backgroundColor: `${TYPE_COLORS[post.type]}18` }]}>
          <Text variant="labelSm" color={TYPE_COLORS[post.type]}>{TYPE_LABELS[post.type]}</Text>
        </View>
      </View>

      <Text variant="body" style={styles.postContent}>{post.content}</Text>

      <View style={styles.reactions}>
        {([
          { key: 'fist', emoji: '✊', label: 'Fist bump' },
          { key: 'fire', emoji: '🔥', label: 'Fire' },
          { key: 'heart', emoji: '❤️', label: 'Heart' },
          { key: 'strength', emoji: '💪', label: 'Send strength' },
        ] as const).map(({ key, emoji, label }) => (
          <Pressable
            key={key}
            style={({ pressed }) => [styles.reactionBtn, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.reactionEmoji}>{emoji}</Text>
            <Text variant="caption" color={colors.textMuted}>{post.reactions[key]}</Text>
          </Pressable>
        ))}
      </View>
    </Card>
  );
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All posts' },
  { value: 'secular', label: 'Secular' },
  { value: 'my_religion', label: 'My community' },
];

export function CommunityScreen() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text variant="h2">Community</Text>
        <Pressable style={styles.postBtn}>
          <Text variant="label" color={colors.bg}>+ Post</Text>
        </Pressable>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        style={styles.filtersScroll}
      >
        {FILTERS.map((f) => (
          <Pressable
            key={f.value}
            onPress={() => setActiveFilter(f.value)}
            style={[styles.filterChip, activeFilter === f.value && styles.filterChipActive]}
          >
            <Text
              variant="label"
              color={activeFilter === f.value ? colors.bg : colors.textSecondary}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={SAMPLE_POSTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={styles.feed}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        ListFooterComponent={<View style={{ height: spacing.xl }} />}
      />
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  postBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  filtersScroll: {
    flexGrow: 0,
  },
  filtersRow: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  feed: {
    paddingHorizontal: spacing.md,
  },
  postCard: {
    gap: spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    fontSize: 28,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  postContent: {
    lineHeight: 23,
  },
  reactions: {
    flexDirection: 'row',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  reactionEmoji: {
    fontSize: 16,
  },
});
