import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { examService } from "../api/examService";
import { Exam } from "../api/types";
import { useLanguage } from "../context/LanguageContext";
import { LanguageToggle } from "../components/LanguageToggle";
import { colors, spacing, radii, typography } from "../theme/tokens";

type RootStackParamList = {
  ExamList: undefined;
  ExamDetail: { examId: number };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ExamListScreen = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const navigation = useNavigation<NavigationProp>();

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const data = await examService.getAll();
      setExams(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const renderExam = ({ item }: { item: Exam }) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      style={styles.examCard}
      onPress={() => navigation.navigate("ExamDetail", { examId: item.id })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{item.examType.replace('_', ' ')}</Text>
        </View>
        <Text style={styles.subjectText}>{item.subject}</Text>
      </View>
      
      <Text style={styles.examName}>
        {language === 'en' ? item.name : item.nameTe}
      </Text>
      
      <Text style={styles.examDesc} numberOfLines={2}>
        {language === 'en' ? item.description : item.descriptionTe}
      </Text>
      
      <View style={styles.footer}>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>{language === 'en' ? "Questions" : "ప్రశ్నలు"}</Text>
            <Text style={styles.statValue}>{item.totalQuestions}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>{language === 'en' ? "Duration" : "సమయం"}</Text>
            <Text style={styles.statValue}>{item.durationMinutes}m</Text>
          </View>
        </View>
        <View style={styles.viewBtn}>
          <Text style={styles.viewBtnText}>{language === 'en' ? "TAKE TEST" : "ప్రారంభించండి"}</Text>
          <Text style={{color: colors.accent, marginLeft: 4}}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>
            {language === 'en' ? "PRACTICE CENTER" : "ప్రాక్టీస్ సెంటర్"}
          </Text>
          <Text style={styles.title}>
            {language === 'en' ? "Exams" : "పరీక్షలు"}
          </Text>
        </View>
        <LanguageToggle />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : exams.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No exams available yet.</Text>
        </View>
      ) : (
        <FlatList
          data={exams}
          renderItem={renderExam}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchExams}
        />
      )}
    </SafeAreaView>
  );
};

export default ExamListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 10,
    color: colors.fgMuted,
    fontWeight: "bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "400",
    color: colors.fgPrimary,
    fontFamily: 'serif',
  },
  list: {
    padding: spacing.xl,
  },
  examCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  typeBadge: {
    backgroundColor: colors.inset,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeBadgeText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontFamily: typography.mono.fontFamily,
  },
  subjectText: {
    color: colors.fgMuted,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  examName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.fgPrimary,
    marginBottom: 8,
  },
  examDesc: {
    fontSize: 14,
    color: colors.fgSecondary,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statsRow: {
    flexDirection: "row",
  },
  stat: {
    marginRight: spacing.xl,
  },
  statLabel: {
    fontSize: 9,
    color: colors.fgMuted,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 15,
    color: colors.fgPrimary,
    fontWeight: "700",
    fontFamily: typography.mono.fontFamily,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewBtnText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: colors.fgMuted,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: typography.mono.fontFamily,
  },
});
