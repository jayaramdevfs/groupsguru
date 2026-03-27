import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { ScreenHeader } from "../components/ScreenHeader";
import { colors, spacing, radii, typography } from "../theme/tokens";
import { categoryService } from "../api/categoryService";
import { subCategoryService } from "../api/subCategoryService";
import { sectionService } from "../api/sectionService";
import { topicService } from "../api/topicService";
import { registryService } from "../api/registryService";
import { questionService } from "../api/questionService";

type RootStackParamList = {
  AdminDashboard: undefined;
  Category: undefined;
  Intelligence: undefined;
  QuestionList: undefined;
  StudyMaterial: { entityType: string; entityId: number; entityName: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface DashboardStats {
  categories: number;
  subcategories: number;
  sections: number;
  topics: number;
  microTopics: number;
  questions: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigation = useNavigation<NavigationProp>();
  
  const [stats, setStats] = useState<DashboardStats>({
    categories: 0, subcategories: 0, sections: 0, 
    topics: 0, microTopics: 0, questions: 0
  });
  const [statsLoaded, setStatsLoaded] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const [cats, subs, secs, tops, mts, qData] = await Promise.all([
        categoryService.getAll(),
        subCategoryService.getAll(),
        sectionService.getAll(),
        topicService.getAll(),
        registryService.getPublicMicroTopics(),
        questionService.getCount()
      ]);
      setStats({
        categories: cats.length,
        subcategories: subs.length,
        sections: secs.length,
        topics: tops.length,
        microTopics: mts.totalElements,
        questions: qData
      });
    } catch (error) {
      console.error("Failed to load admin dashboard stats:", error);
    } finally {
      setStatsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const navCards = [
    {
      title: language === "en" ? "Content Inventory" : "కంటెంట్ సోపానక్రమం",
      desc: language === "en" ? "Manage the architectural hierarchy from examinations down to atomic topics." : "పరీక్షల నుండి టాపిక్‌ల వరకు పూర్తి కంటెంట్‌ను నిర్వహించండి.",
      icon: "🌳",
      route: "Category" as const,
      stat: null,
      statLabel: "Hierarchy",
    },
    {
      title: language === "en" ? "Knowledge Atlas" : "ఇంటెలిజెన్స్ ఇంజిన్",
      desc: language === "en" ? "Precision registry of micro-topics and syllabus coverage intelligence." : "ప్రిడిక్షన్ స్కోర్లు మరియు సిలబస్ కవరేజీని చూడండి.",
      icon: "⚛️",
      route: "Intelligence" as const,
      stat: stats.microTopics,
      statLabel: "Micro-Nodes",
    },
    {
      title: language === "en" ? "Knowledge Assets" : "నోట్స్ & మెటీరియల్స్",
      desc: language === "en" ? "Manage bilingual study notes, PDFs, and learning resources across the system." : "స్టడీ మెటీరియల్స్ మరియు PDFలను ఇక్కడ నిర్వహించండి.",
      icon: "📚",
      route: "StudyMaterial" as const,
      routeParams: { entityType: "GLOBAL", entityId: 0, entityName: "Global Archive" },
      stat: null,
      statLabel: "Library",
    },
    {
      title: language === "en" ? "Question Forge" : "ప్రశ్న బ్యాంక్",
      desc: language === "en" ? "Bilingual MCQ engineering with difficulty and cognitive metadata." : "ద్విభాషా MCQలను నిర్వహించండి మరియు క్రియేట్ చేయండి.",
      icon: "❓",
      route: "QuestionList" as const,
      stat: stats.questions,
      statLabel: "MCQ Corpus",
    },
    {
      title: language === "en" ? "Access Logic" : "ధర & యాక్సెస్",
      desc: language === "en" ? "Economic layers and student subscription access parameters." : "ధరలను మరియు యూజర్ యాక్సెస్ నిర్వహించండి.",
      icon: "💰",
      route: "Category" as const, // Placeholder mapped to Category initially
      stat: null,
      statLabel: "Paywall",
    },
  ];

  const StatBox = ({ label, value }: { label: string, value: number }) => (
    <View style={styles.statBox}>
      <Text style={styles.statBoxLabel}>{label}</Text>
      {statsLoaded ? (
        <Text style={styles.statBoxValue}>{value}</Text>
      ) : (
        <ActivityIndicator size="small" color={colors.accent} style={{ alignSelf: 'flex-start', marginTop: 4 }} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#191919" />
      
      {/* Parity: Added ScreenHeader to inject the Hamburger Menu for Drawer access */}
      <ScreenHeader title={language === 'en' ? 'System Core' : 'సిస్టమ్ కోర్'} showBack={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>COMMAND CENTER V3.2</Text>
          </View>
          <Text style={styles.title}>
            System <Text style={{ color: colors.accent }}>Dashboard</Text>
          </Text>
          <Text style={styles.subtitle}>
            {language === 'en' ? 
              "Operational overview of the GroupsGuru LMS core. Control the knowledge tree, intelligence registry, and examination assets." :
              "మీ విద్యా వ్యవస్థను ఖచ్చితత్వంతో నిర్వహించండి. కవరేజీని ట్రాక్ చేయండి మరియు కంటెంట్‌ను క్యూరేట్ చేయండి."}
          </Text>
        </View>

        {/* Global Inventory Status */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>LIVE GLOBAL ANALYTICS</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatBox label="Exams" value={stats.categories} />
          <StatBox label="Subjects" value={stats.subcategories} />
          <StatBox label="Sections" value={stats.sections} />
          <StatBox label="Topics" value={stats.topics} />
          <StatBox label="Micro-Topics" value={stats.microTopics} />
          <StatBox label="MCQs" value={stats.questions} />
        </View>

        {/* Module Controls Grid */}
        <View style={[styles.sectionHeader, { marginTop: spacing['2xl'] }]}>
          <Text style={styles.sectionTitle}>MODULE GATEWAYS</Text>
        </View>

        <View style={styles.modulesGrid}>
          {navCards.map((card, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              style={styles.navCard}
              onPress={() => navigation.navigate(card.route, card.routeParams as any)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>{card.icon}</Text>
                {card.statLabel && (
                  <View style={styles.cardStatBadge}>
                    <Text style={styles.cardStatText}>
                      {statsLoaded && card.stat !== null ? `${card.stat} ` : ""}{card.statLabel}
                    </Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDesc}>{card.desc}</Text>

              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>ACCESS SYSTEM NODE</Text>
                <Text style={styles.cardFooterArrow}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* System Health Status */}
        <View style={styles.healthFooter}>
          <Text style={styles.healthText}>CORE_SVC: ACTIVE // BUILD_SIG: CLAUDE_MIRROR_3.2</Text>
          <View style={styles.healthRow}>
            <View style={styles.healthDot} />
            <Text style={styles.healthText}>DB: PERSISTENT_REPLICA</Text>
          </View>
          <View style={styles.healthRow}>
            <View style={styles.healthDot} />
            <Text style={styles.healthText}>AUTH: SECURE_PROVIDER</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing["5xl"],
  },
  welcomeSection: {
    marginBottom: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: 'rgba(217, 119, 6, 0.1)', // Amber with opacity
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
    marginBottom: spacing.md,
  },
  badgeText: {
    color: colors.accent,
    fontSize: 9,
    fontFamily: typography.mono.fontFamily,
    fontWeight: "700",
    letterSpacing: 2,
  },
  title: {
    fontSize: 32,
    fontFamily: 'serif',
    color: colors.fgPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 13,
    color: colors.fgSecondary,
    lineHeight: 20,
  },
  sectionHeader: {
    marginBottom: spacing.md,
    paddingLeft: 4,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: typography.mono.fontFamily,
    fontWeight: "bold",
    color: colors.fgMuted,
    letterSpacing: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statBox: {
    width: '47%', // roughly 2 columns
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    padding: spacing.lg,
  },
  statBoxLabel: {
    fontSize: 8,
    fontFamily: typography.mono.fontFamily,
    fontWeight: "bold",
    color: "#666666",
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  statBoxValue: {
    fontSize: 24,
    fontFamily: typography.mono.fontFamily,
    color: colors.fgPrimary,
  },
  modulesGrid: {
    gap: spacing.md,
  },
  navCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  cardIcon: {
    fontSize: 32,
  },
  cardStatBadge: {
    backgroundColor: colors.inset,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  cardStatText: {
    fontSize: 8,
    fontFamily: typography.mono.fontFamily,
    fontWeight: "bold",
    color: "#666666",
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.fgPrimary,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.fgSecondary,
    lineHeight: 18,
    marginBottom: spacing.xl,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardFooterText: {
    fontSize: 9,
    fontFamily: typography.mono.fontFamily,
    fontWeight: "bold",
    color: colors.accent,
    letterSpacing: 1.5,
    opacity: 0.8,
  },
  cardFooterArrow: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.accent,
    opacity: 0.8,
  },
  healthFooter: {
    marginTop: spacing['4xl'],
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  healthDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  healthText: {
    fontSize: 8,
    fontFamily: typography.mono.fontFamily,
    fontWeight: "bold",
    color: "#666666",
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

