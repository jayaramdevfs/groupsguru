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
import { colors, spacing, radii, typography } from "../theme/tokens";

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
        <ActivityIndicator size="small" color={colors.accent} />
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
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <LanguageToggle />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
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
            <Text style={styles.statLabel}>{language === 'en' ? "Total Marks" : "మార్కులు"}</Text>
            <Text style={styles.statValue}>{exam.totalQuestions * exam.marksPerQuestion}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>{language === 'en' ? "Penalty" : "నెగటివ్"}</Text>
            <Text style={styles.statValue}>{exam.negativeMarking ? `-${exam.penaltyPerWrong}` : "NONE"}</Text>
          </View>
        </View>

        <View style={styles.rulesContainer}>
          <Text style={styles.rulesTitle}>{language === 'en' ? "Instructions" : "నిర్దేశాలు"}</Text>
          <View style={styles.ruleItem}>
            <View style={styles.ruleDot} />
            <Text style={styles.ruleText}>{language === 'en' ? "Clock cannot be paused once started." : "పరీక్ష ప్రారంభమైన తర్వాత క్లాక్ ఆపలేము."}</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.ruleDot} />
            <Text style={styles.ruleText}>{language === 'en' ? "Auto-submit on timer expiry." : "సమయం ముగిసినప్పుడు ఆటో-సబ్మిట్ అవుతుంది."}</Text>
          </View>
          <View style={styles.ruleItem}>
            <View style={styles.ruleDot} />
            <Text style={styles.ruleText}>{language === 'en' ? "Switch languages during attempt." : "పరీక్ష మధ్యలో భాషను మార్చుకోవచ్చు."}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.startBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("ExamAttempt", { examId })}
        >
          <Text style={styles.startBtnText}>{language === 'en' ? "Begin Exam Attempt" : "పరీక్షను ప్రారంభించండి"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExamDetailScreen;

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
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    paddingVertical: spacing.sm,
  },
  backIcon: {
    color: colors.fgPrimary,
    fontSize: 24,
    fontWeight: "300",
  },
  scroll: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
  typeTag: {
    backgroundColor: colors.inset,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: "flex-start",
    marginBottom: spacing.xl,
  },
  typeTagText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontFamily: typography.mono.fontFamily,
  },
  name: {
    fontSize: 28,
    fontWeight: "400",
    color: colors.fgPrimary,
    lineHeight: 36,
    marginBottom: spacing.md,
    fontFamily: 'serif',
  },
  desc: {
    fontSize: 15,
    color: colors.fgSecondary,
    lineHeight: 22,
    marginBottom: spacing["3xl"],
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing["2xl"],
  },
  statCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  statLabel: {
    fontSize: 9,
    color: colors.fgMuted,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    color: colors.fgPrimary,
    fontWeight: "700",
    fontFamily: typography.mono.fontFamily,
  },
  rulesContainer: {
    backgroundColor: colors.inset,
    borderRadius: radii.md,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing["4xl"],
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.fgPrimary,
    marginBottom: spacing.lg,
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  ruleDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.accent,
    marginTop: 7,
    marginRight: 10,
  },
  ruleText: {
    fontSize: 14,
    color: colors.fgSecondary,
    lineHeight: 20,
    flex: 1,
  },
  startBtn: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.xl,
    borderRadius: radii.md,
    alignItems: "center",
  },
  startBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: "bold",
  },
});
