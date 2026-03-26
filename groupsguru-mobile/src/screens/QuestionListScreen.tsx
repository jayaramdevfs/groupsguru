import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, FlatList, ActivityIndicator, TouchableOpacity, TextInput } from "react-native";
import { useLanguage } from "../context/LanguageContext";
import { useRoute, RouteProp } from "@react-navigation/native";
import { questionService } from "../api/questionService";
import { Question } from "../api/types";
import { colors, spacing, radii, typography } from "../theme/tokens";

type RootStackParamList = {
  QuestionList: { microTopicId?: string; entityName?: string };
};

const QuestionListScreen = () => {
  const { language } = useLanguage();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const route = useRoute<RouteProp<RootStackParamList, "QuestionList">>();
  const microTopicId = route.params?.microTopicId;
  const entityName = route.params?.entityName;

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await questionService.getAll(
        0, 
        100, 
        microTopicId || undefined, 
        search || undefined
      );
      setQuestions(data.content);
    } catch (error) {
      console.error("Failed to load questions:", error);
    } finally {
      setLoading(false);
    }
  }, [search, microTopicId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return { bg: "rgba(61, 154, 95, 0.12)", border: "rgba(61, 154, 95, 0.25)", text: colors.success };
      case "medium": return { bg: "rgba(196, 144, 26, 0.12)", border: "rgba(196, 144, 26, 0.25)", text: colors.warning };
      case "hard": return { bg: "rgba(217, 119, 6, 0.12)", border: "rgba(217, 119, 6, 0.25)", text: colors.accent };
      case "very_hard": return { bg: "rgba(199, 68, 68, 0.12)", border: "rgba(199, 68, 68, 0.25)", text: colors.error };
      default: return { bg: "rgba(160, 160, 160, 0.12)", border: "rgba(160, 160, 160, 0.25)", text: colors.fgSecondary };
    }
  };

  const renderItem = ({ item }: { item: Question }) => {
    const dc = getDifficultyColor(item.difficulty);
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
        style={[styles.card, isExpanded && styles.cardExpanded]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.qCode}>{item.questionCode}</Text>
          <View style={[styles.badge, { backgroundColor: dc.bg, borderColor: dc.border }]}>
            <Text style={[styles.badgeText, { color: dc.text }]}>
              {item.difficulty === "very_hard" ? "VERY HARD" : item.difficulty.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.questionPreview} numberOfLines={isExpanded ? undefined : 2}>
          {language === "en" ? item.questionTextEn : item.questionTextTe}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{item.subject}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{item.questionType}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{item.cognitiveLevel}</Text>
        </View>

        {isExpanded && (
          <View style={styles.expandedSection}>
            <View style={styles.divider} />
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
                    <Text style={[styles.optionLetterText, isCorrect && { color: "#FFFFFF" }]}>{opt.letter}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optionText, isCorrect && { color: colors.success }]}>
                      {language === "en" ? opt.en : opt.te}
                    </Text>
                  </View>
                  {isCorrect && <Text style={{ color: colors.success, fontSize: 16 }}>✓</Text>}
                </View>
              );
            })}

            <View style={styles.microTopicBox}>
              <Text style={styles.microTopicLabel}>MAPPING</Text>
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
        <Text style={styles.label}>{language === "en" ? "QUESTION BANK" : "ప్రశ్న బ్యాంక్"}</Text>
        <Text style={styles.title}>{language === "en" ? "Review Content" : "కంటెంట్ రివ్యూ"}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{questions.length} QUESTIONS</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder={language === "en" ? "Filter by keywords..." : "కీవర్డ్ల ద్వారా వెతకండి..."}
            placeholderTextColor={colors.fgMuted}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={fetchQuestions}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={questions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No questions found matching your search.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default QuestionListScreen;

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
  countBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.inset,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.md,
  },
  countText: {
    color: colors.fgSecondary,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: typography.mono.fontFamily,
  },
  searchContainer: { 
    paddingHorizontal: spacing.xl, 
    marginBottom: spacing.lg 
  },
  searchBox: {
    backgroundColor: colors.inset,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    height: 44,
    color: colors.fgPrimary,
    fontSize: 14,
    fontWeight: "500",
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
  cardExpanded: {
    borderColor: "rgba(217, 119, 6, 0.4)",
  },
  cardHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: spacing.md 
  },
  qCode: { 
    color: colors.fgSecondary, 
    fontSize: 11, 
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
    fontSize: 8, 
    fontWeight: "bold" 
  },
  questionPreview: { 
    color: colors.fgPrimary, 
    fontSize: 15, 
    fontWeight: "600", 
    lineHeight: 22, 
    marginBottom: spacing.lg 
  },
  metaRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 6 
  },
  metaText: { 
    color: colors.fgMuted, 
    fontSize: 11, 
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  metaDot: { 
    color: colors.border, 
    fontSize: 12 
  },
  expandedSection: { 
    marginTop: spacing.lg, 
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radii.sm,
    backgroundColor: colors.base,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  optionCorrect: {
    backgroundColor: "rgba(61, 154, 95, 0.08)",
    borderColor: colors.success,
  },
  optionLetter: {
    width: 28,
    height: 28,
    borderRadius: radii.sm,
    backgroundColor: colors.inset,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionLetterCorrect: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  optionLetterText: { 
    fontSize: 12, 
    fontWeight: "bold", 
    color: colors.fgSecondary,
    fontFamily: typography.mono.fontFamily
  },
  optionText: { 
    color: colors.fgPrimary, 
    fontSize: 14, 
    fontWeight: "600" 
  },
  microTopicBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radii.sm,
    backgroundColor: colors.inset,
    borderWidth: 1,
    borderColor: colors.border,
  },
  microTopicLabel: { 
    fontSize: 9, 
    fontWeight: "bold", 
    color: colors.fgMuted, 
    textTransform: "uppercase", 
    letterSpacing: 1.5, 
    marginBottom: 2 
  },
  microTopicValue: { 
    fontSize: 12, 
    fontWeight: "bold", 
    color: colors.accent,
    fontFamily: typography.mono.fontFamily
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: colors.fgMuted,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: typography.mono.fontFamily,
    textAlign: 'center',
  }
});

