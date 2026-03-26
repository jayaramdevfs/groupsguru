import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { attemptService } from "../api/attemptService";
import { ExamResult, QuestionResult, TopicAnalytics } from "../api/types";
import { useLanguage } from "../context/LanguageContext";
import { colors, spacing, radii, typography } from "../theme/tokens";

type RootStackParamList = {
  ExamResult: { attemptId: number; examId: number };
  StudentDashboard: undefined;
};

type RouteParams = RouteProp<RootStackParamList, "ExamResult">;

const ExamResultScreen = () => {
  const route = useRoute<RouteParams>();
  const { attemptId } = route.params;
  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const navigation = useNavigation<any>();

  const fetchResult = useCallback(async () => {
    setLoading(true);
    try {
      const res = await attemptService.getResult(attemptId);
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [attemptId]);

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  }

  if (!result) return null;

  const { attempt, questions, topicAnalytics } = result;
  const scorePercent = ((attempt.correctCount || 0) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
           <Text style={styles.label}>EXAM PERFORMANCE</Text>
           <Text style={styles.title}>Results Analysis</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
           <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{attempt.totalMarks?.toFixed(1)}</Text>
              <Text style={styles.scoreSub}>SCORE</Text>
           </View>
           
           <View style={styles.statsGrid}>
              <StatItem label="Correct" value={attempt.correctCount || 0} color={colors.success} />
              <StatItem label="Incorrect" value={attempt.wrongCount || 0} color={colors.error} />
              <StatItem label="Skipped" value={attempt.unattemptedCount || 0} color={colors.fgMuted} />
           </View>
        </View>

        {/* Topic Breakdown */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Sectional Breakdown</Text>
        </View>
        <View style={styles.topicList}>
           {topicAnalytics.map((topic, i) => (
             <TopicCard key={i} topic={topic} />
           ))}
        </View>

        {/* Question Review */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Question Review</Text>
        </View>
        <View style={styles.questionList}>
           {questions.map((qr, i) => (
             <QuestionReviewCard key={i} qr={qr} index={i} language={language} />
           ))}
        </View>

        <TouchableOpacity 
          style={styles.doneBtn}
          onPress={() => navigation.navigate("StudentDashboard")}
        >
          <Text style={styles.doneBtnText}>BACK TO DASHBOARD</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const StatItem = ({ label, value, color }: any) => (
  <View style={styles.statItem}>
     <Text style={[styles.statValue, { color }]}>{value}</Text>
     <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const TopicCard = ({ topic }: { topic: TopicAnalytics }) => (
  <View style={styles.topicCard}>
     <View style={styles.topicHeader}>
        <Text style={styles.topicName} numberOfLines={1}>{topic.topicName}</Text>
        <Text style={styles.hitRate}>{topic.hitRate.toFixed(0)}%</Text>
     </View>
     <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${topic.hitRate}%`, backgroundColor: topic.hitRate > 70 ? colors.success : topic.hitRate > 40 ? colors.warning : colors.error }]} />
     </View>
     <View style={styles.topicMeta}>
        <Text style={styles.metaText}>{topic.correctCount} Correct | {topic.wrongCount} Wrong</Text>
     </View>
  </View>
);

const QuestionReviewCard = ({ qr, index, language }: { qr: QuestionResult, index: number, language: string }) => {
  const isCorrect = qr.isCorrect;
  const isSelected = !!qr.selectedOption;
  
  const statusColor = isCorrect ? colors.success : !isSelected ? colors.fgMuted : colors.error;

  return (
    <View style={[styles.qCard, { borderColor: statusColor + "40" }]}>
       <View style={styles.qHeader}>
          <Text style={styles.qIndex}>Question {index + 1}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + "15", borderColor: statusColor + "30", borderWidth: 1 }]}>
             <Text style={[styles.statusText, { color: statusColor }]}>
               {isCorrect ? "CORRECT" : !isSelected ? "SKIPPED" : "WRONG"}
             </Text>
          </View>
       </View>
       
       <Text style={styles.qText}>
          {language === 'en' ? qr.question.questionTextEn : qr.question.questionTextTe}
       </Text>

       <View style={styles.optionsGrid}>
          <ReviewOption label="A" en={qr.question.optionAEn} te={qr.question.optionATe} selected={qr.selectedOption === 'A'} correct={qr.question.correctOption === 'A'} />
          <ReviewOption label="B" en={qr.question.optionBEn} te={qr.question.optionBTe} selected={qr.selectedOption === 'B'} correct={qr.question.correctOption === 'B'} />
          <ReviewOption label="C" en={qr.question.optionCEn} te={qr.question.optionCTe} selected={qr.selectedOption === 'C'} correct={qr.question.correctOption === 'C'} />
          <ReviewOption label="D" en={qr.question.optionDEn} te={qr.question.optionDTe} selected={qr.selectedOption === 'D'} correct={qr.question.correctOption === 'D'} />
       </View>

       {(qr.question.explanationEn || qr.question.explanationTe) && (
          <View style={styles.explanationBox}>
             <Text style={styles.explanationLabel}>EXPLANATION</Text>
             <Text style={styles.explanationText}>
                {language === 'en' ? qr.question.explanationEn : qr.question.explanationTe}
             </Text>
          </View>
       )}
    </View>
  );
};

const ReviewOption = ({ label, en, te, selected, correct }: any) => {
  const { language } = useLanguage();
  let borderColor: string = colors.border;
  let bgColor: string = colors.base;
  let labelBg: string = colors.inset;
  let labelTextColor: string = colors.fgMuted;

  if (correct) {
     borderColor = colors.success + "60";
     bgColor = colors.success + "10";
     labelBg = colors.success;
     labelTextColor = "#FFFFFF";
  } else if (selected && !correct) {
     borderColor = colors.error + "60";
     bgColor = colors.error + "10";
     labelBg = colors.error;
     labelTextColor = "#FFFFFF";
  }

  return (
    <View style={[styles.optBtn, { borderColor, backgroundColor: bgColor }]}>
       <View style={[styles.optCircle, { backgroundColor: labelBg, borderColor: correct || selected ? 'transparent' : colors.border }]}>
          <Text style={[styles.optLabel, { color: labelTextColor }]}>{label}</Text>
       </View>
       <View style={styles.optContent}>
          <Text style={styles.optEn}>{en}</Text>
          {te && <Text style={styles.optTe}>{te}</Text>}
       </View>
    </View>
  );
};

export default ExamResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  scroll: {
    padding: spacing.xl,
  },
  header: {
    marginBottom: spacing["2xl"],
  },
  label: {
    fontSize: 10,
    color: colors.fgMuted,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "400",
    color: colors.fgPrimary,
    fontFamily: 'serif',
  },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing["2xl"],
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    marginBottom: spacing["3xl"],
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.accent + "30",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing["2xl"],
    backgroundColor: colors.inset,
  },
  scoreText: {
    color: colors.fgPrimary,
    fontSize: 40,
    fontWeight: "700",
    fontFamily: typography.mono.fontFamily,
  },
  scoreSub: {
    color: colors.fgMuted,
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: "row",
    gap: spacing.md,
    width: '100%',
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.inset,
    padding: spacing.md,
    borderRadius: radii.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: typography.mono.fontFamily,
    marginBottom: 2,
  },
  statLabel: {
    color: colors.fgMuted,
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  sectionHeader: {
    marginBottom: spacing.lg,
    paddingLeft: 4,
  },
  sectionTitle: {
    color: colors.fgPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  topicList: {
    gap: spacing.md,
    marginBottom: spacing["3xl"],
  },
  topicCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  topicName: {
    color: colors.fgPrimary,
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  hitRate: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: typography.mono.fontFamily,
  },
  progressBg: {
    height: 6,
    backgroundColor: colors.inset,
    borderRadius: 3,
    marginBottom: spacing.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  topicMeta: {
    flexDirection: "row",
  },
  metaText: {
    color: colors.fgMuted,
    fontSize: 10,
    fontWeight: "bold",
  },
  questionList: {
    gap: spacing.lg,
    marginBottom: spacing["3xl"],
  },
  qCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.xl,
    borderWidth: 1,
  },
  qHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  qIndex: {
    color: colors.fgMuted,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "bold",
  },
  qText: {
    color: colors.fgPrimary,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  optionsGrid: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  optBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radii.sm,
    borderWidth: 1,
  },
  optCircle: {
    width: 28,
    height: 28,
    borderRadius: radii.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
    borderWidth: 1,
  },
  optLabel: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: typography.mono.fontFamily,
  },
  optContent: {
    flex: 1,
  },
  optEn: {
    color: colors.fgPrimary,
    fontWeight: "600",
    fontSize: 14,
  },
  optTe: {
    color: colors.fgSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  explanationBox: {
    backgroundColor: colors.inset,
    borderRadius: radii.sm,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  explanationLabel: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 6,
  },
  explanationText: {
    color: colors.fgSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  doneBtn: {
    backgroundColor: colors.accent,
    height: 56,
    borderRadius: radii.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: 40,
  },
  doneBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
