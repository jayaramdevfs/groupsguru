import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { examService } from "../api/examService";
import { Exam } from "../api/types";
import { useLanguage } from "../context/LanguageContext";
import { LanguageToggle } from "../components/LanguageToggle";

type RootStackParamList = {
  ExamDetail: { examId: number };
  ExamAttempt: { examId: number };
};

type RouteParams = RouteProp<RootStackParamList, "ExamDetail">;

const ExamDetailScreen = () => {
  const route = useRoute<RouteParams>();
  const { examId } = route.params;
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchExam = useCallback(async () => {
    setLoading(true);
    try {
      const data = await examService.getById(examId);
      setExam(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    fetchExam();
  }, [fetchExam]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#9333EA" />
      </View>
    );
  }

  if (!exam) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Exam not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <LanguageToggle />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.typeTag}>
          <Text style={styles.typeTagText}>{exam.examType.replace("_", " ")}</Text>
        </View>

        <Text style={styles.name}>
          {language === 'en' ? exam.name : exam.nameTe}
        </Text>

        <Text style={styles.desc}>
          {language === 'en' ? exam.description : exam.descriptionTe}
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>{language === 'en' ? "Questions" : "ప్రశ్నలు"}</Text>
            <Text style={styles.statValue}>{exam.totalQuestions}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>{language === 'en' ? "Duration" : "సమయం"}</Text>
            <Text style={styles.statValue}>{exam.durationMinutes}m</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>{language === 'en' ? "Total Marks" : "మొత్తం మార్కులు"}</Text>
            <Text style={styles.statValue}>{exam.totalQuestions * exam.marksPerQuestion}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>{language === 'en' ? "Negative" : "నెగటివ్"}</Text>
            <Text style={styles.statValue}>{exam.negativeMarking ? `-${exam.penaltyPerWrong}` : "No"}</Text>
          </View>
        </View>

        <View style={styles.rulesContainer}>
          <Text style={styles.rulesTitle}>{language === 'en' ? "Rules" : "నిబంధనలు"}</Text>
          <View style={styles.ruleItem}>
            <View style={styles.ruleDot} />
            <Text style={styles.ruleText}>{language === 'en' ? "Clock cannot be paused." : "క్లాక్ ఆగదు."}</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.ruleDot} />
            <Text style={styles.ruleText}>{language === 'en' ? "Auto-submit on expiry." : "సమయం ముగిస్తే సబ్మిట్ అవుతుంది."}</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.ruleDot} />
            <Text style={styles.ruleText}>{language === 'en' ? "Bilingual support available." : "రెండు భాషలలో అందుబాటులో ఉంది."}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.startBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("ExamAttempt", { examId })}
        >
          <Text style={styles.startBtnText}>{language === 'en' ? "Start Exam Now" : "పరీక్ష ప్రారంభించండి"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExamDetailScreen;

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
  },
  backBtn: {
    padding: 8,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  scroll: {
    padding: 24,
    paddingTop: 0,
  },
  typeTag: {
    backgroundColor: "rgba(147, 51, 234, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  typeTagText: {
    color: "#c084fc",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  name: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 40,
    marginBottom: 16,
  },
  desc: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 24,
    marginBottom: 32,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  statCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "800",
  },
  rulesContainer: {
    backgroundColor: "rgba(147, 51, 234, 0.05)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.1)",
    marginBottom: 40,
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ruleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#9333EA",
    marginRight: 12,
  },
  ruleText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
  },
  startBtn: {
    backgroundColor: "#9333EA",
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#9333EA",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  startBtnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#EC4899",
    fontSize: 18,
    fontWeight: "700",
  },
});
