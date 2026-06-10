import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../components/ui/AppText';
import { AppCard } from '../components/ui/AppCard';
import { AppButton } from '../components/ui/AppButton';
import { TypeBadge } from '../components/ui/TypeBadge';
import { TeamSlot } from '../components/team/TeamSlot';
import { useTeamContext } from '../context/TeamContext';
import { palette } from '../styles/colors';
import { theme } from '../styles/theme';
import { MainTabScreenProps } from '../routes/types';

export function TeamBuilderScreen({ navigation }: MainTabScreenProps<'TeamBuilder'>) {
  const { slots, members, analysis, setSlot, clearTeam } = useTeamContext();

  const filled = members.filter(Boolean).length;

  return (
    <LinearGradient colors={[palette.background, '#0f1528']} style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <AppText variant="h1">Team Builder</AppText>
            <AppText variant="caption" muted>
              {filled}/6 slots · Score {analysis.score}/100
            </AppText>
          </View>

          <View style={styles.grid}>
            {slots.map((_, i) => (
              <TeamSlot
                key={i}
                index={i}
                pokemon={members[i] ?? null}
                onPress={() => navigation.navigate('TeamPicker', { slotIndex: i })}
                onRemove={
                  members[i]
                    ? () => setSlot(i, null)
                    : undefined
                }
              />
            ))}
          </View>

          <View style={styles.actions}>
            <AppButton label="Clear Team" onPress={clearTeam} variant="secondary" />
          </View>

          <AppCard accent style={styles.analysisCard}>
            <AppText variant="h3" style={styles.sectionTitle}>
              Type coverage
            </AppText>
            <View style={styles.typeRow}>
              {analysis.types.length === 0 ? (
                <AppText variant="caption" muted>
                  Add Cobblemon to analyze coverage
                </AppText>
              ) : (
                analysis.types.map((t) => <TypeBadge key={t} type={t} size="md" />)
              )}
            </View>
            {analysis.sameTypeHeavyWarning && (
              <View style={styles.alertCard}>
                <AppText variant="caption" color={palette.danger}>
                  {analysis.sameTypeHeavyWarning}
                </AppText>
              </View>
            )}
            {analysis.duplicateTypes.length > 0 && !analysis.sameTypeHeavyWarning && (
              <AppText variant="caption" color={palette.warning} style={styles.warn}>
                Overlapping typings: {analysis.duplicateTypes.join(', ')}
              </AppText>
            )}
          </AppCard>

          <AppCard style={styles.analysisCard}>
            <AppText variant="h3" style={styles.sectionTitle}>
              Defensive pressure map
            </AppText>
            {analysis.weaknesses.length === 0 ? (
              <AppText variant="caption" muted>
                Add members to see stacked weaknesses (counts how many slots are weak to each
                attacking type).
              </AppText>
            ) : (
              analysis.weaknesses.slice(0, 6).map((w) => (
                <View key={w.type} style={styles.weakRow}>
                  <TypeBadge type={w.type} />
                  <View style={styles.weakMeta}>
                    <AppText variant="bodyBold">
                      {w.count}× weak
                    </AppText>
                    <AppText variant="small" muted>
                      {w.count >= 3
                        ? 'Critical — build a pivot or dual-resist lead.'
                        : w.count === 2
                          ? 'Moderate — keep a switch-in ready.'
                          : 'Low footprint'}
                    </AppText>
                  </View>
                </View>
              ))
            )}
          </AppCard>

          <AppCard glowColor={palette.accent} style={styles.analysisCard}>
            <AppText variant="h3" style={styles.sectionTitle}>
              Coach suggestions
            </AppText>
            {analysis.suggestions.map((s, i) => (
              <AppText key={i} variant="body" muted style={styles.suggestion}>
                • {s}
              </AppText>
            ))}
          </AppCard>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: theme.spacing.md, paddingBottom: theme.spacing.xxl },
  header: { marginBottom: theme.spacing.lg, gap: 4 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  actions: { marginBottom: theme.spacing.lg },
  analysisCard: { marginBottom: theme.spacing.md },
  sectionTitle: { marginBottom: theme.spacing.md },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  warn: { marginTop: theme.spacing.sm },
  weakRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  weakMeta: { flex: 1, gap: 2 },
  alertCard: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: palette.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: palette.danger + '55',
  },
  suggestion: { marginBottom: theme.spacing.sm, lineHeight: 20 },
});
