import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { intelligenceService, PredictionScore } from "../api/intelligenceService";
import { useFocusEffect } from "@react-navigation/native";

const SUBJECTS = ["All Subjects", "History", "Economy", "Polity", "Science", "Environment", "AP History"];

const IntelligenceScreen = () => {
  const { language } = useLanguage();
  const [predictions, setPredictions] = useState<PredictionScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");

  const fetchPredictions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await intelligenceService.getTopPredictions(selectedSubject, 50);
      setPredictions(data);
    } catch (error) {
      console.error("Failed to load predictions:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedSubject]);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  const getPriorityColor = (rank: string) => {
    switch (rank) {
      case "VERY_HIGH": return { bg: "rgba(16, 185, 129, 0.2)", border: "rgba(16, 185, 129, 0.4)", text: "#34d399" };
      case "HIGH": return { bg: "rgba(59, 130, 246, 0.2)", border: "rgba(59, 130, 246, 0.4)", text: "#60a5fa" };
      case "MEDIUM": return { bg: "rgba(234, 179, 8, 0.2)", border: "rgba(234, 179, 8, 0.4)", text: "#facc15" };
      default: return { bg: "rgba(156, 163, 175, 0.2)", border: "rgba(156, 163, 175, 0.4)", text: "#9ca3af" };
    }
  };

  const renderItem = ({ item }: { item: PredictionScore }) => {
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.subtitle}>{language === "en" ? "PREDICTION ENGINE" : "TE PREDICTION ENGINE"}</Text>
        <Text style={styles.title}>{language === "en" ? "Intelligence" : "TE Intelligence"}</Text>
      </View>

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

      {loading ? (
        <ActivityIndicator size="large" color="#9333EA" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={predictions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          initialNumToRender={10}
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
  progressFill: { height: "100%", backgroundColor: "#9333ea", borderRadius: 4 }
});
