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
import { BackgroundGlow } from "../components/BackgroundGlow";

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
        <ActivityIndicator size="large" color="#9333EA" />
      </View>
    );
  }

  if (!data || !currentQuestion) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <BackgroundGlow />
      
      {/* Refined Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.examName} numberOfLines={1}>
            {language === 'en' ? data.examName : data.examNameTe}
          </Text>
          <View style={styles.qBadge}>
            <Text style={styles.qBadgeText}>Q {currentIdx + 1} / {data.questions.length}</Text>
          </View>
        </View>
        
        <View style={[styles.timer, timeLeft < 300 && styles.timerCritical]}>
          <Text style={styles.timerText}>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</Text>
        </View>
      </View>

      {/* Question Navigator Bar (Horizontal Shelf) */}
      <View style={styles.shelfContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelfScroll}>
          {data.questions.map((q, idx) => (
            <TouchableOpacity 
              key={q.id}
              style={[
                styles.shelfItem, 
                currentIdx === idx && styles.shelfItemActive,
                answers[q.id] && styles.shelfItemAnswered
              ]}
              onPress={() => setCurrentIdx(idx)}
            >
              <Text style={[
                styles.shelfItemText, 
                currentIdx === idx && styles.shelfItemTextActive,
                answers[q.id] && styles.shelfItemTextAnswered
              ]}>
                {idx + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.qCard}>
          {/* Professional Question Formatting */}
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

      {/* Improved Footer Nav */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.navBtn, currentIdx === 0 && styles.disabledBtn]}
          onPress={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
        >
          <Text style={styles.navBtnText}>PREV</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.submitBtn}
          onPress={() => {
            Alert.alert("Submit Exam", "Are you sure? Unanswered questions will be marked as skipped.", [
              { text: "Cancel", style: "cancel" },
              { text: "SUBMIT NOW", style: 'destructive', onPress: handleSubmit }
            ]);
          }}
        >
          <Text style={styles.submitBtnText}>SUBMIT</Text>
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
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.optBtn, isSelected && styles.optBtnSelected]}
    >
      <View style={[styles.optCircle, isSelected && styles.optCircleSelected]}>
        <Text style={[styles.optLabel, isSelected && styles.optLabelSelected]}>{label}</Text>
      </View>
      <View style={styles.optContent}>
        <Text style={styles.optEn}>{textEn}</Text>
        <Text style={styles.optTe}>{textTe}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ExamAttemptScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f051d",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "rgba(15, 5, 29, 0.98)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(147, 51, 234, 0.3)",
    zIndex: 10,
  },
  headerTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  examName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  qBadge: {
    backgroundColor: "rgba(147, 51, 234, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  qBadgeText: {
    color: "#d8b4fe",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  timer: {
    backgroundColor: "rgba(147, 51, 234, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.4)",
    minWidth: 70,
    alignItems: 'center',
  },
  timerCritical: {
    backgroundColor: "rgba(236, 72, 153, 0.2)",
    borderColor: "rgba(236, 72, 153, 0.5)",
  },
  timerText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    fontFamily: "monospace",
  },
  shelfContainer: {
    backgroundColor: "rgba(15, 5, 29, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    paddingVertical: 10,
  },
  shelfScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  shelfItem: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  shelfItemActive: {
    backgroundColor: '#9333EA',
    borderColor: '#c084fc',
    elevation: 4,
  },
  shelfItemAnswered: {
    borderColor: '#9333EA',
    borderWidth: 2,
  },
  shelfItemText: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '800',
    fontSize: 14,
  },
  shelfItemTextActive: {
    color: '#FFFFFF',
  },
  shelfItemTextAnswered: {
    color: '#d8b4fe',
  },
  scroll: {
    padding: 20,
  },
  qCard: {
    backgroundColor: "rgba(255,255,255,0.02)",
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  optionsGrid: {
    gap: 12,
    marginTop: 10,
  },
  optBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  optBtnSelected: {
    backgroundColor: "rgba(147, 51, 234, 0.25)",
    borderColor: "rgba(147, 51, 234, 0.6)",
  },
  optCircle: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(147, 51, 234, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optCircleSelected: {
    backgroundColor: "#9333EA",
  },
  optLabel: {
    color: "#c084fc",
    fontWeight: "900",
    fontSize: 16,
  },
  optLabelSelected: {
    color: "#FFFFFF",
  },
  optContent: {
    flex: 1,
  },
  optEn: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  optTe: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 3,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
    backgroundColor: "rgba(15, 5, 29, 0.98)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    gap: 12,
  },
  navBtn: {
    flex: 1,
    height: 52,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  navBtnText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 1,
  },
  submitBtn: {
    flex: 1.8,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#a855f7",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#9333EA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 14,
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
