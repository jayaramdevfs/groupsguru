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
      activeOpacity={0.8}
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
        <View style={styles.stat}>
          <Text style={styles.statLabel}>{language === 'en' ? "Questions" : "ప్రశ్నలు"}</Text>
          <Text style={styles.statValue}>{item.totalQuestions}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>{language === 'en' ? "Duration" : "సమయం"}</Text>
          <Text style={styles.statValue}>{item.durationMinutes}m</Text>
        </View>
        <TouchableOpacity 
          style={styles.viewBtn}
          onPress={() => navigation.navigate("ExamDetail", { examId: item.id })}
        >
          <Text style={styles.viewBtnText}>{language === 'en' ? "View" : "చూడండి"}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {language === 'en' ? "Practice Exams" : "ప్రాక్టీస్ పరీక్షలు"}
          </Text>
          <Text style={styles.title}>
            {language === 'en' ? "Tests" : "పరీక్షలు"}
          </Text>
        </View>
        <LanguageToggle />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#9333EA" />
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
    backgroundColor: "#0f051d",
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 4,
  },
  list: {
    padding: 24,
    paddingTop: 10,
  },
  examCard: {
    backgroundColor: "rgba(147, 51, 234, 0.08)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.2)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  typeBadge: {
    backgroundColor: "rgba(147, 51, 234, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    color: "#c084fc",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  subjectText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    fontWeight: "700",
  },
  examName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  examDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    lineHeight: 20,
    marginBottom: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  stat: {
    marginRight: 24,
  },
  statLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  viewBtn: {
    marginLeft: "auto",
    backgroundColor: "#9333EA",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  viewBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 16,
    fontWeight: "600",
  },
});
