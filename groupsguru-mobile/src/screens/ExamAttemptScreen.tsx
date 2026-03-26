import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { attemptService } from "../api/attemptService";
import { AttemptStartResponse, Question } from "../api/types";
import { useLanguage } from "../context/LanguageContext";
import { FormattedQuestionText } from "../components/FormattedQuestionText";
import { colors, spacing, radii, typography } from "../theme/tokens";

const { width } = Dimensions.get('window');

type RootStackParamList = {
  ExamAttempt: { examId: number };
  StudentDashboard: undefined;
  ExamResult: { attemptId: number; examId: number };
};

type RouteParams = RouteProp<RootStackParamList, "ExamAttempt">;

const ExamAttemptScreen = () => {
  const route = useRoute<RouteParams>();
  const { examId } = route.params;
  const [data, setData] = useState<AttemptStartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const { language } = useLanguage();
  const navigation = useNavigation<any>();

  const fetchAttempt = useCallback(async () => {
    setLoading(true);
    try {
      const res = await attemptService.start(examId);
      setData(res);
      setTimeLeft(res.durationMinutes * 60);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to start exam. Please check your connection.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [examId, navigation]);

  useEffect(() => {
    fetchAttempt();
  }, [fetchAttempt]);

  useEffect(() => {
    if (timeLeft <= 0 && data) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, data]);

  const handleSubmit = async () => {
    if (!data) return;
    try {
      const payload = {
        answers: data.questions.map(q => ({
          questionId: q.id,
          selectedOption: answers[q.id] || null
        }))
      };
      const res = await attemptService.submit(data.attemptId, payload);
      Alert.alert("Success", "Exam submitted successfully!", [
        { text: "View Results", onPress: () => navigation.navigate("ExamResult", { attemptId: data.attemptId, examId }) }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Submission failed. Try again.");
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const currentQuestion = data?.questions[currentIdx];

  const handleSelect = (option: string) => {
    if (!currentQuestion) return;
    setAnswers({ ...answers, [currentQuestion.id]: option });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  }

  if (!data || !currentQuestion) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.examName} numberOfLines={1}>
            {language === 'en' ? data.examName : data.examNameTe}
          </Text>
          <View style={styles.qBadge}>
            <Text style={styles.qBadgeText}>QUESTION {currentIdx + 1} OF {data.questions.length}</Text>
          </View>
        </View>
        
        <View style={[styles.timer, timeLeft < 300 && styles.timerCritical]}>
          <Text style={styles.timerText}>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</Text>
        </View>
      </View>

      {/* Question Navigator */}
      <View style={styles.shelfContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelfScroll}>
          {data.questions.map((q, idx) => (
            <TouchableOpacity 
              key={q.id}
              style={[
                styles.shelfItem, 
                currentIdx === idx && styles.shelfItemActive,
                answers[q.id] && currentIdx !== idx && styles.shelfItemAnswered
              ]}
              onPress={() => setCurrentIdx(idx)}
            >
              <Text style={[
                styles.shelfItemText, 
                currentIdx === idx && styles.shelfItemTextActive,
                answers[q.id] && currentIdx !== idx && styles.shelfItemTextAnswered
              ]}>
                {idx + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.qCard}>
          <FormattedQuestionText 
            text={language === 'en' ? currentQuestion.questionTextEn : currentQuestion.questionTextTe} 
          />

          <View style={styles.optionsGrid}>
            {['A', 'B', 'C', 'D'].map((label) => (
              <OptionButton 
                key={label}
                label={label} 
                textEn={(currentQuestion as any)[`option${label}En`]} 
                textTe={(currentQuestion as any)[`option${label}Te`]} 
                isSelected={answers[currentQuestion.id] === label}
                onPress={() => handleSelect(label)}
              />
            ))}
          </View>
        </View>
        <View style={{height: 40}} />
      </ScrollView>

      {/* Footer Nav */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.navBtn, currentIdx === 0 && styles.disabledBtn]}
          onPress={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
        >
          <Text style={styles.navBtnText}>PREVIOUS</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.submitBtn}
          onPress={() => {
            Alert.alert("Finish Exam", "Are you sure you want to submit your attempt?", [
              { text: "Continue Test", style: "cancel" },
              { text: "Submit Now", style: 'default', onPress: handleSubmit }
            ]);
          }}
        >
          <Text style={styles.submitBtnText}>FINISH</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navBtn, currentIdx === data.questions.length - 1 && styles.disabledBtn]}
          onPress={() => setCurrentIdx(prev => Math.min(data.questions.length - 1, prev + 1))}
          disabled={currentIdx === data.questions.length - 1}
        >
          <Text style={styles.navBtnText}>NEXT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const OptionButton = ({ label, textEn, textTe, isSelected, onPress }: any) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.optBtn, isSelected && styles.optBtnSelected]}
    >
      <View style={[styles.optCircle, isSelected && styles.optCircleSelected]}>
        <Text style={[styles.optLabel, isSelected && styles.optLabelSelected]}>{label}</Text>
      </View>
      <View style={styles.optContent}>
        <Text style={styles.optEn}>{textEn}</Text>
        {textTe && <Text style={styles.optTe}>{textTe}</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default ExamAttemptScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  examName: {
    color: colors.fgPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  qBadge: {
    backgroundColor: colors.inset,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  qBadgeText: {
    color: colors.fgMuted,
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  timer: {
    backgroundColor: colors.inset,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 80,
    alignItems: 'center',
  },
  timerCritical: {
    backgroundColor: "rgba(199, 68, 68, 0.1)",
    borderColor: "rgba(199, 68, 68, 0.3)",
  },
  timerText: {
    color: colors.fgPrimary,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: typography.mono.fontFamily,
  },
  shelfContainer: {
    backgroundColor: colors.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
  },
  shelfScroll: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  shelfItem: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: colors.inset,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  shelfItemActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  shelfItemAnswered: {
    backgroundColor: "rgba(61, 154, 95, 0.1)",
    borderColor: "rgba(61, 154, 95, 0.3)",
  },
  shelfItemText: {
    color: colors.fgSecondary,
    fontWeight: '700',
    fontSize: 13,
    fontFamily: typography.mono.fontFamily,
  },
  shelfItemTextActive: {
    color: '#FFFFFF',
  },
  shelfItemTextAnswered: {
    color: colors.success,
  },
  scroll: {
    padding: spacing.xl,
  },
  qCard: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
  },
  optionsGrid: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  optBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inset,
    padding: spacing.lg,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optBtnSelected: {
    backgroundColor: "rgba(217, 119, 6, 0.08)",
    borderColor: colors.accent,
  },
  optCircle: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optCircleSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  optLabel: {
    color: colors.fgMuted,
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: typography.mono.fontFamily,
  },
  optLabelSelected: {
    color: "#FFFFFF",
  },
  optContent: {
    flex: 1,
  },
  optEn: {
    color: colors.fgPrimary,
    fontWeight: "600",
    fontSize: 15,
  },
  optTe: {
    color: colors.fgSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["2xl"],
    paddingTop: spacing.lg,
    backgroundColor: colors.base,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  navBtn: {
    flex: 1,
    height: 48,
    borderRadius: radii.sm,
    backgroundColor: colors.inset,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  navBtnText: {
    color: colors.fgPrimary,
    fontWeight: "bold",
    fontSize: 10,
    letterSpacing: 1,
  },
  submitBtn: {
    flex: 1.5,
    height: 48,
    borderRadius: radii.sm,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1,
  },
  disabledBtn: {
    opacity: 0.3,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
