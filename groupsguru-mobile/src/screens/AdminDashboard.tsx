import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { ProfessionalLogo } from "../components/ProfessionalLogo";
import { LanguageToggle } from "../components/LanguageToggle";
import { colors, spacing, radii, typography } from "../theme/tokens";
import { categoryService } from "../api/categoryService";

type RootStackParamList = {
  AdminDashboard: undefined;
  Category: undefined;
  Intelligence: undefined;
  QuestionList: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const { language } = useLanguage();
  const navigation = useNavigation<NavigationProp>();
  const [categoryCount, setCategoryCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const categories = await categoryService.getAll();
      setCategoryCount(categories.length);
    } catch (error) {
      console.error("Failed to load admin dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const NavItem = ({ title, desc, onPress, icon }: { title: string, desc: string, onPress: () => void, icon: string }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.navCard}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{icon}</Text>
        <View style={styles.arrowIcon}>
          <Text style={{ color: colors.accent, fontSize: 18, fontWeight: "700" }}>→</Text>
        </View>
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{desc}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <ProfessionalLogo size={28} />
        <LanguageToggle />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {language === "en" ? "ADMIN_CONSOLE" : "అడ్మిన్_కన్సోల్"}
            </Text>
          </View>
          <Text style={styles.title}>
            {language === "en" ? "System Core" : "సిస్టమ్ కోర్"}
          </Text>
          <Text style={styles.userText}>{user?.email ?? ""}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>
              {language === "en" ? "Exams" : "పరీక్షలు"}
            </Text>
            {loading ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <Text style={styles.statValue}>{categoryCount}</Text>
            )}
          </View>
          <View style={[styles.statBox, { borderLeftWidth: 0 }]}>
            <Text style={styles.statLabel}>
              {language === "en" ? "Status" : "స్థితి"}
            </Text>
            <View style={styles.statusIndicator}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>LIVE</Text>
            </View>
          </View>
        </View>

        <View style={styles.grid}>
          <NavItem 
            title={language === "en" ? "Content Tree" : "కంటెంట్ ట్రీ"}
            desc={language === "en" ? "Precision hierarchy management" : "ఖచ్చితమైన కంటెంట్ నిర్వహణ"}
            icon="🌳"
            onPress={() => navigation.navigate("Category")}
          />
          
          <NavItem 
            title={language === "en" ? "Intelligence" : "ఇంటెలిజెన్స్"}
            desc={language === "en" ? "AI predictions & heatmaps" : "AI ప్రిడిక్షన్ స్కోర్లు"}
            icon="⚛️"
            onPress={() => navigation.navigate("Intelligence")}
          />

          <NavItem 
            title={language === "en" ? "Question Bank" : "ప్రశ్న బ్యాంక్"}
            desc={language === "en" ? "Bilingual MCQ repository" : "ద్విభాషా MCQల సేకరణ"}
            icon="❓"
            onPress={() => navigation.navigate("QuestionList")}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>
            {language === "en" ? "Terminate Session" : "సెషన్‌ను ముగించు"}
          </Text>
        </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.fgFaint,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing["5xl"],
  },
  welcomeSection: {
    marginBottom: spacing.xl,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.accentSubtle,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  badgeText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  title: {
    ...typography.displayMd,
    color: colors.fgPrimary,
    fontWeight: "400", // Instrument Serif placeholder style
  },
  userText: {
    ...typography.bodySm,
    color: colors.fgSecondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.fgFaint,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    marginBottom: spacing.xl,
    overflow: "hidden",
  },
  statBox: {
    flex: 1,
    padding: spacing.md,
    borderLeftWidth: 1,
    borderLeftColor: colors.fgFaint,
  },
  statLabel: {
    ...typography.caption,
    color: colors.fgMuted,
    marginBottom: 4,
  },
  statValue: {
    ...typography.mono,
    fontSize: 24,
    color: colors.fgPrimary,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  statusText: {
    ...typography.mono,
    fontSize: 12,
    color: colors.success,
  },
  grid: {
    gap: spacing.md,
  },
  navCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.fgFaint,
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  cardIcon: {
    fontSize: 24,
  },
  arrowIcon: {
    opacity: 0.5,
  },
  cardTitle: {
    ...typography.heading,
    color: colors.fgPrimary,
    marginBottom: 4,
  },
  cardDesc: {
    ...typography.bodySm,
    color: colors.fgSecondary,
    lineHeight: 18,
  },
  logoutButton: {
    marginTop: spacing["3xl"],
    paddingVertical: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radii.md,
  },
  logoutText: {
    ...typography.bodySm,
    color: colors.error,
    fontWeight: "700",
  },
});

