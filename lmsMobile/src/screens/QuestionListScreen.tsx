import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, FlatList, ActivityIndicator, TouchableOpacity, TextInput } from "react-native";
import { useLanguage } from "../context/LanguageContext";
import { questionService } from "../api/questionService";
import { Question } from "../api/types";

const QuestionListScreen = () => {
  const { language } = useLanguage();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await questionService.getAll(0, 100, undefined, search || undefined);
      setQuestions(data.content);
    } catch (error) {
      console.error("Failed to load questions:", error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return { bg: "rgba(16, 185, 129, 0.2)", border: "rgba(16, 185, 129, 0.4)", text: "#34d399" };
      case "medium": return { bg: "rgba(234, 179, 8, 0.2)", border: "rgba(234, 179, 8, 0.4)", text: "#facc15" };
      case "hard": return { bg: "rgba(249, 115, 22, 0.2)", border: "rgba(249, 115, 22, 0.4)", text: "#fb923c" };
      case "very_hard": return { bg: "rgba(239, 68, 68, 0.2)", border: "rgba(239, 68, 68, 0.4)", text: "#f87171" };
      default: return { bg: "rgba(156, 163, 175, 0.2)", border: "rgba(156, 163, 175, 0.4)", text: "#9ca3af" };
    }
  };

  const renderItem = ({ item }: { item: Question }) => {
    const dc = getDifficultyColor(item.difficulty);
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
        style={styles.card}
      >
        {/* Header Row */}
        <View style={styles.cardHeader}>
          <Text style={styles.qCode}>{item.questionCode}</Text>
          <View style={[styles.badge, { backgroundColor: dc.bg, borderColor: dc.border }]}>
            <Text style={[styles.badgeText, { color: dc.text }]}>
              {item.difficulty === "very_hard" ? "VERY HARD" : item.difficulty.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Question preview */}
        <Text style={styles.questionPreview} numberOfLines={isExpanded ? undefined : 2}>
          {language === "en" ? item.questionTextEn : item.questionTextTe}
        </Text>

        {/* Meta row */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{item.subject}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{item.questionType}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{item.cognitiveLevel}</Text>
        </View>

        {/* Expanded details */}
        {isExpanded && (
          <View style={styles.expandedSection}>
            {/* Options */}
            {[
              { letter: "A", en: item.optionAEn, te: item.optionATe },
              { letter: "B", en: item.optionBEn, te: item.optionBTe },
              { letter: "C", en: item.optionCEn, te: item.optionCTe },
              { letter: "D", en: item.optionDEn, te: item.optionDTe },
            ].map((opt) => {
              const isCorrect = item.correctOption === opt.letter;
              return (
                <View
                  key={opt.letter}
                  style={[
                    styles.optionRow,
                    isCorrect && styles.optionCorrect,
                  ]}
                >
                  <View style={[styles.optionLetter, isCorrect && styles.optionLetterCorrect]}>
                    <Text style={[styles.optionLetterText, isCorrect && { color: "#34d399" }]}>{opt.letter}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optionText, isCorrect && { color: "#34d399" }]}>
                      {language === "en" ? opt.en : opt.te}
                    </Text>
                  </View>
                  {isCorrect && <Text style={{ color: "#34d399", fontSize: 18 }}>✓</Text>}
                </View>
              );
            })}

            {/* Micro-Topic */}
            <View style={styles.microTopicRow}>
              <Text style={styles.microTopicLabel}>Micro-Topic</Text>
              <Text style={styles.microTopicValue}>{item.microTopicId}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.subtitle}>{language === "en" ? "QUESTION BANK" : "ప్రశ్న బ్యాంక్"}</Text>
        <Text style={styles.title}>{language === "en" ? "All Questions" : "అన్ని ప్రశ్నలు"}</Text>
        <Text style={styles.count}>{questions.length} MCQs loaded</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder={language === "en" ? "Search questions..." : "ప్రశ్నలు వెతకండి..."}
          placeholderTextColor="rgba(255,255,255,0.3)"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={fetchQuestions}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#9333EA" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={questions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          initialNumToRender={10}
        />
      )}
    </SafeAreaView>
  );
};

export default QuestionListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f051d" },
  header: { padding: 24, paddingBottom: 10 },
  subtitle: { fontSize: 11, fontWeight: "800", color: "rgba(147, 51, 234, 0.8)", textTransform: "uppercase", letterSpacing: 3 },
  title: { fontSize: 32, fontWeight: "900", color: "#FFFFFF", marginTop: 4 },
  count: { fontSize: 14, fontWeight: "600", color: "rgba(255,255,255,0.5)", marginTop: 4 },
  searchWrapper: { paddingHorizontal: 24, marginBottom: 16 },
  searchInput: {
    backgroundColor: "#1e102f",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.2)",
  },
  listContent: { padding: 24, paddingTop: 0, paddingBottom: 40, gap: 16 },
  card: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(147,51,234,0.15)",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  qCode: { color: "#c4b5fd", fontSize: 13, fontWeight: "800", letterSpacing: 0.5 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: "900" },
  questionPreview: { color: "#FFFFFF", fontSize: 14, fontWeight: "600", lineHeight: 22, marginBottom: 12 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: "700" },
  metaDot: { color: "rgba(255,255,255,0.2)", fontSize: 12 },
  expandedSection: { marginTop: 16, gap: 8 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 12,
  },
  optionCorrect: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  optionLetter: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionLetterCorrect: {
    backgroundColor: "rgba(16, 185, 129, 0.3)",
  },
  optionLetterText: { fontSize: 13, fontWeight: "900", color: "rgba(255,255,255,0.6)" },
  optionText: { color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: "600" },
  microTopicRow: {
    marginTop: 8,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(147,51,234,0.08)",
    borderWidth: 1,
    borderColor: "rgba(147,51,234,0.2)",
  },
  microTopicLabel: { fontSize: 10, fontWeight: "800", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 },
  microTopicValue: { fontSize: 13, fontWeight: "700", color: "#c4b5fd" },
});
