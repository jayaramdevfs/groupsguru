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
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { attemptService } from "../api/attemptService";
import { AttemptStartResponse, Question } from "../api/types";
import { useLanguage } from "../context/LanguageContext";

type RootStackParamList = {
  ExamAttempt: { examId: number };
  StudentDashboard: undefined;
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
      
      {/* Timer Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.examName}>{language === 'en' ? data.examName : data.examNameTe}</Text>
          <Text style={styles.qCount}>Question {currentIdx + 1} of {data.questions.length}</Text>
        </View>
        <View style={[styles.timer, timeLeft < 300 && styles.timerCritical]}>
          <Text style={styles.timerText}>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.qCard}>
          <Text style={styles.questionText}>
            {language === 'en' ? currentQuestion.questionTextEn : currentQuestion.questionTextTe}
          </Text>

          <View style={styles.optionsGrid}>
            <OptionButton 
               label="A" 
               textEn={currentQuestion.optionAEn} 
               textTe={currentQuestion.optionATe} 
               isSelected={answers[currentQuestion.id] === 'A'}
               onPress={() => handleSelect('A')}
            />
            <OptionButton 
               label="B" 
               textEn={currentQuestion.optionBEn} 
               textTe={currentQuestion.optionBTe} 
               isSelected={answers[currentQuestion.id] === 'B'}
               onPress={() => handleSelect('B')}
            />
            <OptionButton 
               label="C" 
               textEn={currentQuestion.optionCEn} 
               textTe={currentQuestion.optionCTe} 
               isSelected={answers[currentQuestion.id] === 'C'}
               onPress={() => handleSelect('C')}
            />
            <OptionButton 
               label="D" 
               textEn={currentQuestion.optionDEn} 
               textTe={currentQuestion.optionDTe} 
               isSelected={answers[currentQuestion.id] === 'D'}
               onPress={() => handleSelect('D')}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer Nav */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.navBtn, currentIdx === 0 && styles.disabledBtn]}
          onPress={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
        >
          <Text style={styles.navBtnText}>Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.submitBtn}
          onPress={() => {
            Alert.alert("Confirm", "Are you sure you want to submit?", [
              { text: "Cancel", style: "cancel" },
              { text: "Submit", onPress: handleSubmit }
            ]);
          }}
        >
          <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navBtn, currentIdx === data.questions.length - 1 && styles.disabledBtn]}
          onPress={() => setCurrentIdx(prev => Math.min(data.questions.length - 1, prev + 1))}
          disabled={currentIdx === data.questions.length - 1}
        >
          <Text style={styles.navBtnText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const OptionButton = ({ label, textEn, textTe, isSelected, onPress }: any) => {
  const { language } = useLanguage();
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
    padding: 24,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(147, 51, 234, 0.2)",
  },
  examName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  qCount: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    marginTop: 2,
  },
  timer: {
    backgroundColor: "rgba(147, 51, 234, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
  },
  timerCritical: {
    backgroundColor: "rgba(236, 72, 153, 0.15)",
    borderColor: "rgba(236, 72, 153, 0.3)",
  },
  timerText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    fontFamily: "monospace",
  },
  scroll: {
    padding: 24,
  },
  qCard: {
    backgroundColor: "rgba(255,255,255,0.02)",
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  questionText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
    marginBottom: 24,
  },
  optionsGrid: {
    gap: 12,
  },
  optBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  optBtnSelected: {
    backgroundColor: "rgba(147, 51, 234, 0.2)",
    borderColor: "rgba(147, 51, 234, 0.4)",
  },
  optCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(147, 51, 234, 0.15)",
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
  },
  optLabelSelected: {
    color: "#FFFFFF",
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
  footer: {
    flexDirection: "row",
    padding: 24,
    backgroundColor: "rgba(15, 5, 29, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    gap: 12,
  },
  navBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  navBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  submitBtn: {
    flex: 2,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#9333EA",
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontWeight: "900",
    textTransform: "uppercase",
  },
  disabledBtn: {
    opacity: 0.2,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
