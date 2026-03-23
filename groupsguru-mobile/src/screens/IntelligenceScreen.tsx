import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { intelligenceService, PredictionScore, ContentGap, Coverage } from "../api/intelligenceService";
import { useFocusEffect } from "@react-navigation/native";

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
      case "VERY_HIGH": return { bg: "rgba(16, 185, 129, 0.2)", border: "rgba(16, 185, 129, 0.4)", text: "#34d399" };
      case "HIGH": return { bg: "rgba(59, 130, 246, 0.2)", border: "rgba(59, 130, 246, 0.4)", text: "#60a5fa" };
      case "MEDIUM": return { bg: "rgba(234, 179, 8, 0.2)", border: "rgba(234, 179, 8, 0.4)", text: "#facc15" };
      default: return { bg: "rgba(156, 163, 175, 0.2)", border: "rgba(156, 163, 175, 0.4)", text: "#9ca3af" };
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
        <Text style={styles.subject}>{item.subject}</Text>
        <View style={styles.confidenceRow}>
          <Text style={styles.confidenceValue}>{(item.predictionConfidence * 100).toFixed(0)}% Confidence</Text>
          <View style={styles.progressBarBg}>
             <View style={[styles.progressFill, { width: `${Math.min(100, item.predictionConfidence * 100)}%` }]} />
          </View>
        </View>
      </View>
    );
  };

  const renderGap = ({ item }: { item: ContentGap }) => {
    const pColor = getPriorityColor(item.priorityRank);
    return (
      <View style={[styles.card, { borderColor: "rgba(239, 68, 68, 0.3)" }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.mtId}>{item.microTopicId}</Text>
          <View style={[styles.badge, { backgroundColor: pColor.bg, borderColor: pColor.border }]}>
            <Text style={[styles.badgeText, { color: pColor.text }]}>{item.priorityRank.replace("_", " ")}</Text>
          </View>
        </View>
        <Text style={styles.subject}>{item.microTopicText}</Text>
        <View style={styles.gapFooter}>
           <Text style={styles.gapSubjectText}>{item.subject}</Text>
           <Text style={styles.gapStatus}>NO QUESTIONS</Text>
        </View>
      </View>
    );
  };

  const renderCoverage = ({ item }: { item: Coverage }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.coverageSubject}>{item.subject}</Text>
            <View style={styles.coverageRow}>
                <Text style={styles.coveragePerc}>{item.coveragePercentage.toFixed(0)}% Covered</Text>
                <Text style={styles.coverageCount}>{item.coveredTopics}/{item.totalTopics} Topics</Text>
            </View>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressFill, { width: `${item.coveragePercentage}%`, backgroundColor: item.coveragePercentage > 50 ? "#10b981" : "#9333ea" }]} />
            </View>
            <Text style={styles.totalQ}>{item.totalQuestions} Questions Total</Text>
        </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.subtitle}>{activeTab}</Text>
        <Text style={styles.title}>{language === "en" ? "Intelligence" : "TE Intelligence"}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {[
          { id: "PREDICTIONS", label: "Preds" },
          { id: "GAPS", label: "Gaps" },
          { id: "COVERAGE", label: "Stats" },
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
           <FlatList 
             data={SUBJECTS}
             horizontal
             showsHorizontalScrollIndicator={false}
             keyExtractor={(item) => item}
             renderItem={({ item }) => (
               <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={() => setSelectedSubject(item)}
                  style={[styles.filterChip, selectedSubject === item && styles.filterChipActive]}
               >
                  <Text style={[styles.filterText, selectedSubject === item && styles.filterTextActive]}>{item}</Text>
               </TouchableOpacity>
             )}
           />
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#9333EA" style={{ marginTop: 40 }} />
      ) : activeTab === "PREDICTIONS" ? (
        <FlatList
          data={predictions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPrediction}
          contentContainerStyle={styles.listContent}
        />
      ) : activeTab === "GAPS" ? (
        <FlatList
          data={gaps}
          keyExtractor={(item) => item.microTopicId}
          renderItem={renderGap}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <FlatList
          data={coverage}
          keyExtractor={(item) => item.subject}
          renderItem={renderCoverage}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

export default IntelligenceScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f051d" },
  header: { padding: 24, paddingBottom: 10 },
  subtitle: { fontSize: 13, fontWeight: "800", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1 },
  title: { fontSize: 32, fontWeight: "900", color: "#FFFFFF", marginTop: 4 },
  filtersWrapper: { paddingLeft: 24, marginBottom: 16, height: 40 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", marginRight: 8, justifyContent: "center" },
  filterChipActive: { backgroundColor: "rgba(147, 51, 234, 0.2)", borderColor: "#9333ea" },
  filterText: { color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "700" },
  filterTextActive: { color: "#c084fc", fontWeight: "800" },
  listContent: { padding: 24, paddingTop: 0, paddingBottom: 40, gap: 16 },
  card: { backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "rgba(147,51,234,0.15)" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  mtId: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "800", letterSpacing: 1, fontFamily: "System" },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: "900" },
  subject: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", marginTop: 12, marginBottom: 16 },
  confidenceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  confidenceValue: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  progressBarBg: { flex: 1, height: 8, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden", marginLeft: 16 },
  progressFill: { height: "100%", backgroundColor: "#9333ea", borderRadius: 4 },
  totalQ: { color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: "700", marginTop: 8 },
  tabsContainer: { flexDirection: "row", paddingHorizontal: 24, marginBottom: 16, gap: 12 },
  tabButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  tabButtonActive: { backgroundColor: "#9333ea", borderColor: "#c084fc" },
  tabText: { color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "800", textTransform: "uppercase" },
  tabTextActive: { color: "#FFFFFF" },
  gapFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  gapSubjectText: { color: "#c084fc", fontSize: 11, fontWeight: "800", textTransform: "uppercase" },
  gapStatus: { color: "#ef4444", fontSize: 10, fontWeight: "900" },
  coverageSubject: { color: "#FFFFFF", fontSize: 18, fontWeight: "900", marginBottom: 12 },
  coverageRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 },
  coveragePerc: { color: "#34d399", fontSize: 24, fontWeight: "900" },
  coverageCount: { color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "700" }
});
