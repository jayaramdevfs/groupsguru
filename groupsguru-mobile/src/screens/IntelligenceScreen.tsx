import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native";
import { useLanguage } from "../context/LanguageContext";
import { intelligenceService, PredictionScore, ContentGap, Coverage } from "../api/intelligenceService";
import { colors, spacing, radii, typography } from "../theme/tokens";

const SUBJECTS = ["All Subjects", "History", "Economy", "Polity", "Science", "Environment", "AP History", "AP Economy", "Geography", "Mental Ability"];

type TabId = "PREDICTIONS" | "GAPS" | "COVERAGE";

const IntelligenceScreen = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabId>("PREDICTIONS");
  const [predictions, setPredictions] = useState<PredictionScore[]>([]);
  const [gaps, setGaps] = useState<ContentGap[]>([]);
  const [coverage, setCoverage] = useState<Coverage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "PREDICTIONS") {
        const data = await intelligenceService.getTopPredictions(selectedSubject, 50);
        setPredictions(data);
      } else if (activeTab === "GAPS") {
        const data = await intelligenceService.getContentGaps();
        setGaps(selectedSubject === "All Subjects" ? data : data.filter(g => g.subject === selectedSubject));
      } else if (activeTab === "COVERAGE") {
        const data = await intelligenceService.getCoverage();
        setCoverage(data);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedSubject, activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getPriorityColor = (rank: string) => {
    switch (rank) {
      case "VERY_HIGH": return { bg: "rgba(61, 154, 95, 0.12)", border: "rgba(61, 154, 95, 0.25)", text: colors.success };
      case "HIGH": return { bg: "rgba(74, 143, 191, 0.12)", border: "rgba(74, 143, 191, 0.25)", text: colors.info };
      case "MEDIUM": return { bg: "rgba(196, 144, 26, 0.12)", border: "rgba(196, 144, 26, 0.25)", text: colors.warning };
      default: return { bg: "rgba(160, 160, 160, 0.12)", border: "rgba(160, 160, 160, 0.25)", text: colors.fgSecondary };
    }
  };

  const renderPrediction = ({ item }: { item: PredictionScore }) => {
    const pColor = getPriorityColor(item.priorityRank);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.mtId}>{item.microTopicId}</Text>
          <View style={[styles.badge, { backgroundColor: pColor.bg, borderColor: pColor.border }]}>
            <Text style={[styles.badgeText, { color: pColor.text }]}>{item.priorityRank.replace("_", " ")}</Text>
          </View>
        </View>
        <Text style={styles.cardTitle}>{item.subject}</Text>
        <View style={styles.confidenceRow}>
          <Text style={styles.confidenceValue}>{(item.predictionConfidence * 100).toFixed(0)}% Confidence</Text>
          <View style={styles.progressBarBg}>
             <View style={[styles.progressFill, { width: `${Math.min(100, item.predictionConfidence * 100)}%`, backgroundColor: colors.accent }]} />
          </View>
        </View>
      </View>
    );
  };

  const renderGap = ({ item }: { item: ContentGap }) => {
    const pColor = getPriorityColor(item.priorityRank);
    return (
      <View style={[styles.card, { borderColor: "rgba(199, 68, 68, 0.3)" }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.mtId}>{item.microTopicId}</Text>
          <View style={[styles.badge, { backgroundColor: pColor.bg, borderColor: pColor.border }]}>
            <Text style={[styles.badgeText, { color: pColor.text }]}>{item.priorityRank.replace("_", " ")}</Text>
          </View>
        </View>
        <Text style={styles.cardTitle}>{item.microTopicText}</Text>
        <View style={styles.gapFooter}>
           <Text style={styles.gapSubjectText}>{item.subject}</Text>
           <Text style={styles.gapStatus}>MISSING CONTENT</Text>
        </View>
      </View>
    );
  };

  const renderCoverage = ({ item }: { item: Coverage }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.coverageSubject}>{item.subject}</Text>
            <View style={styles.coverageRow}>
                <Text style={styles.coveragePerc}>{item.coveragePercentage.toFixed(0)}% COVERED</Text>
                <Text style={styles.coverageCount}>{item.coveredTopics}/{item.totalTopics} Topics</Text>
            </View>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressFill, { width: `${item.coveragePercentage}%`, backgroundColor: item.coveragePercentage > 50 ? colors.success : colors.accent }]} />
            </View>
            <Text style={styles.totalQ}>{item.totalQuestions} Questions Analyzed</Text>
        </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.label}>{activeTab}</Text>
        <Text style={styles.title}>{language === "en" ? "Intelligence" : "ఇంటెలిజెన్స్"}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {[
          { id: "PREDICTIONS", label: "Predictions" },
          { id: "GAPS", label: "Gaps" },
          { id: "COVERAGE", label: "Coverage" },
        ].map((t) => (
          <TouchableOpacity 
            key={t.id}
            onPress={() => setActiveTab(t.id as TabId)}
            style={[styles.tabButton, activeTab === t.id && styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, activeTab === t.id && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab !== "COVERAGE" && (
        <View style={styles.filtersWrapper}>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
             {SUBJECTS.map((item) => (
                <TouchableOpacity 
                  key={item}
                  activeOpacity={0.7}
                  onPress={() => setSelectedSubject(item)}
                  style={[styles.filterChip, selectedSubject === item && styles.filterChipActive]}
                >
                  <Text style={[styles.filterText, selectedSubject === item && styles.filterTextActive]}>{item}</Text>
                </TouchableOpacity>
             ))}
           </ScrollView>
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={(activeTab === "PREDICTIONS" ? predictions : activeTab === "GAPS" ? gaps : coverage) as any}
          keyExtractor={(item, index) => (item as any).id?.toString() || (item as any).microTopicId || index.toString()}
          renderItem={(activeTab === "PREDICTIONS" ? renderPrediction : activeTab === "GAPS" ? renderGap : renderCoverage) as any}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No data available for the selected filters.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default IntelligenceScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.base 
  },
  header: { 
    paddingHorizontal: spacing.xl, 
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  label: { 
    fontSize: 10, 
    fontWeight: "bold", 
    color: colors.fgMuted, 
    textTransform: "uppercase", 
    letterSpacing: 2 
  },
  title: { 
    fontSize: 28, 
    fontWeight: "400", 
    color: colors.fgPrimary, 
    marginTop: 4,
    fontFamily: 'serif' 
  },
  tabsContainer: { 
    flexDirection: "row", 
    paddingHorizontal: spacing.xl, 
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  tabButton: { 
    flex: 1,
    paddingVertical: spacing.sm, 
    borderRadius: radii.sm, 
    backgroundColor: colors.inset, 
    borderWidth: 1, 
    borderColor: colors.border,
    alignItems: 'center'
  },
  tabButtonActive: { 
    backgroundColor: colors.accent, 
    borderColor: colors.accent 
  },
  tabText: { 
    color: colors.fgSecondary, 
    fontSize: 11, 
    fontWeight: "bold", 
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  tabTextActive: { 
    color: "#FFFFFF" 
  },
  filtersWrapper: { 
    marginBottom: spacing.md, 
  },
  filterScroll: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  filterChip: { 
    paddingHorizontal: spacing.md, 
    paddingVertical: 6, 
    borderRadius: radii.sm, 
    backgroundColor: colors.inset, 
    borderWidth: 1, 
    borderColor: colors.border,
  },
  filterChipActive: { 
    borderColor: colors.accent,
    backgroundColor: "rgba(217, 119, 6, 0.08)"
  },
  filterText: { 
    color: colors.fgSecondary, 
    fontSize: 12, 
    fontWeight: "600" 
  },
  filterTextActive: { 
    color: colors.accent,
  },
  listContent: { 
    padding: spacing.xl, 
    paddingTop: 0, 
    paddingBottom: 40, 
    gap: spacing.md 
  },
  card: { 
    backgroundColor: colors.surface, 
    borderRadius: radii.md, 
    padding: spacing.lg, 
    borderWidth: 1, 
    borderColor: colors.border,
  },
  cardHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: spacing.md,
  },
  mtId: { 
    color: colors.fgMuted, 
    fontSize: 10, 
    fontWeight: "bold", 
    fontFamily: typography.mono.fontFamily,
    letterSpacing: 0.5
  },
  badge: { 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: radii.sm, 
    borderWidth: 1 
  },
  badgeText: { 
    fontSize: 9, 
    fontWeight: "bold",
    textTransform: "uppercase"
  },
  cardTitle: { 
    color: colors.fgPrimary, 
    fontSize: 16, 
    fontWeight: "700", 
    lineHeight: 22,
    marginBottom: spacing.lg 
  },
  confidenceRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between" 
  },
  confidenceValue: { 
    color: colors.fgPrimary, 
    fontSize: 12, 
    fontWeight: "bold",
    fontFamily: typography.mono.fontFamily
  },
  progressBarBg: { 
    flex: 1, 
    height: 4, 
    backgroundColor: colors.inset, 
    borderRadius: 2, 
    overflow: "hidden", 
    marginLeft: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border
  },
  progressFill: { 
    height: "100%", 
    borderRadius: 2 
  },
  totalQ: { 
    color: colors.fgMuted, 
    fontSize: 10, 
    fontWeight: "bold", 
    marginTop: spacing.md,
    letterSpacing: 0.5
  },
  gapFooter: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  gapSubjectText: { 
    color: colors.accent, 
    fontSize: 10, 
    fontWeight: "bold", 
    textTransform: "uppercase" 
  },
  gapStatus: { 
    color: colors.error, 
    fontSize: 9, 
    fontWeight: "bold" 
  },
  coverageSubject: { 
    color: colors.fgPrimary, 
    fontSize: 18, 
    fontWeight: "700", 
    marginBottom: spacing.lg 
  },
  coverageRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "baseline", 
    marginBottom: spacing.sm 
  },
  coveragePerc: { 
    color: colors.success, 
    fontSize: 20, 
    fontWeight: "bold",
    fontFamily: typography.mono.fontFamily
  },
  coverageCount: { 
    color: colors.fgSecondary, 
    fontSize: 12, 
    fontWeight: "600" 
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    paddingVertical: 40
  },
  emptyText: {
    color: colors.fgMuted,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: typography.mono.fontFamily,
    textAlign: 'center'
  }
});
