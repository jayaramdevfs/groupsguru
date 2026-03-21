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
  FlatList,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { attemptService } from "../api/attemptService";
import { ExamResult, QuestionResult, TopicAnalytics } from "../api/types";
import { useLanguage } from "../context/LanguageContext";

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
        <ActivityIndicator size="large" color="#9333EA" />
      </View>
    );
  }

  if (!result) return null;

  const { attempt, questions, topicAnalytics } = result;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Hero Section */}
        <View style={styles.hero}>
           <Text style={styles.heroTitle}>Exam Analysis</Text>
           <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>{attempt.totalMarks?.toFixed(1)}</Text>
              <Text style={styles.scoreSub}>of {questions.length} marks</Text>
           </View>
           
           <View style={styles.statsGrid}>
              <StatItem label="Correct" value={attempt.correctCount || 0} color="#10b981" />
              <StatItem label="Wrong" value={attempt.wrongCount || 0} color="#ef4444" />
              <StatItem label="Skipped" value={attempt.unattemptedCount || 0} color="#71717a" />
           </View>
        </View>

        {/* Topic Breakdown */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Topic Performance</Text>
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
          <Text style={styles.doneBtnText}>Back to Dashboard</Text>
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
        <Text style={styles.topicName}>{topic.topicName}</Text>
        <Text style={styles.hitRate}>{topic.hitRate.toFixed(0)}%</Text>
     </View>
     <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${topic.hitRate}%` }]} />
     </View>
     <View style={styles.topicMeta}>
        <Text style={styles.metaText}>{topic.correctCount} Correct</Text>
        <Text style={styles.metaText}>{topic.wrongCount} Wrong</Text>
     </View>
  </View>
);

const QuestionReviewCard = ({ qr, index, language }: { qr: QuestionResult, index: number, language: string }) => {
  const isCorrect = qr.isCorrect;
  const isSelected = !!qr.selectedOption;
  
  const statusColor = isCorrect ? "#10b981" : !isSelected ? "#71717a" : "#ef4444";

  return (
    <View style={[styles.qCard, { borderColor: statusColor + "40" }]}>
       <View style={styles.qHeader}>
          <Text style={styles.qIndex}>Question {index + 1}</Text>
          {qr.isCorrect !== null && (
             <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>{isCorrect ? "Correct" : "Incorrect"}</Text>
             </View>
          )}
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
             <Text style={styles.explanationLabel}>Explanation</Text>
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
  let borderColor = "rgba(255,255,255,0.05)";
  let bgColor = "rgba(255,255,255,0.03)";
  let labelBg = "rgba(255,255,255,0.1)";

  if (correct) {
     borderColor = "#10b98140";
     bgColor = "#10b98110";
     labelBg = "#10b981";
  } else if (selected && !correct) {
     borderColor = "#ef444440";
     bgColor = "#ef444410";
     labelBg = "#ef4444";
  }

  return (
    <View style={[styles.optBtn, { borderColor, backgroundColor: bgColor }]}>
       <View style={[styles.optCircle, { backgroundColor: labelBg }]}>
          <Text style={styles.optLabel}>{label}</Text>
       </View>
       <View style={styles.optContent}>
          <Text style={styles.optEn}>{en}</Text>
          <Text style={styles.optTe}>{te}</Text>
       </View>
    </View>
  );
};

export default ExamResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f051d",
  },
  scroll: {
    padding: 24,
  },
  hero: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 40,
    padding: 32,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.2)",
    alignItems: "center",
    marginBottom: 32,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    fontStyle: "italic",
    marginBottom: 24,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  scoreText: {
    color: "#FFFFFF",
    fontSize: 64,
    fontWeight: "900",
    fontStyle: "italic",
  },
  scoreSub: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
    fontWeight: "800",
    fontStyle: "italic",
    textTransform: "uppercase",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    fontStyle: "italic",
    marginBottom: 4,
  },
  statLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 8,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  sectionHeader: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    fontStyle: "italic",
  },
  topicList: {
    gap: 16,
    marginBottom: 40,
  },
  topicCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  topicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  topicName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    flex: 1,
    marginRight: 16,
    textTransform: "uppercase",
  },
  hitRate: {
    color: "#9333EA",
    fontSize: 18,
    fontWeight: "900",
  },
  progressBg: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#9333EA",
    borderRadius: 4,
  },
  topicMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  questionList: {
    gap: 20,
    marginBottom: 40,
  },
  qCard: {
    backgroundColor: "rgba(255,255,255,0.02)",
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
  },
  qHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  qIndex: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  qText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 26,
    marginBottom: 24,
  },
  optionsGrid: {
    gap: 12,
    marginBottom: 24,
  },
  optBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  optCircle: {
    width: 28,
    height: 28,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  optContent: {
    flex: 1,
  },
  optEn: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  optTe: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  explanationBox: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  explanationLabel: {
    color: "#9333EA",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  explanationText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  doneBtn: {
    backgroundColor: "#9333EA",
    height: 64,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#9333EA",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  doneBtnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    fontStyle: "italic",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
