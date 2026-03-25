import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { ProfessionalLogo } from "../components/ProfessionalLogo";
import { LanguageToggle } from "../components/LanguageToggle";
import { PriceBadge } from "../components/PriceBadge";
import { colors, spacing, radii, typography } from "../theme/tokens";
import { commissionService } from "../api/commissionService";
import { Commission } from "../api/types";
import { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const StudentDashboard = () => {
  const { logout, user } = useAuth();
  const { language } = useLanguage();
  const navigation = useNavigation<NavigationProp>();
  const name = user?.email?.split("@")[0] ?? "Student";
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        const data = await commissionService.getAll();
        setCommissions(data);
      } catch (e) {
        console.error("Failed to fetch commissions", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCommissions();
  }, []);

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
              {language === "en" ? "PREPARATION_PORTAL" : "ప్రిపరేషన్_పోర్టల్"}
            </Text>
          </View>
          <Text style={styles.title}>
            {language === "en" ? `Welcome, ${name}` : `స్వాగతం, ${name}`}
          </Text>
          <Text style={styles.userText}>
            {language === "en" ? "Select a commission to begin." : "ప్రారంభించడానికి ఒక కమిషన్‌ను ఎంచుకోండి."}
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TARGET COMMISSIONS</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={styles.grid}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.accent} style={{ marginVertical: 40 }} />
          ) : commissions.length > 0 ? (
            commissions.map((comm) => (
              <TouchableOpacity
                key={comm.id}
                activeOpacity={0.7}
                style={styles.navCard}
                onPress={() => navigation.navigate("Category", { commissionId: comm.id, commissionName: comm.code })}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconBox}>
                    <Text style={styles.iconText}>{comm.code.charAt(0)}</Text>
                  </View>
                  <PriceBadge accessType={comm.accessType} priceInr={comm.priceInr} />
                </View>
                <Text style={styles.cardTitle}>{comm.name}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {language === "en" ? comm.description : (comm.descriptionTe || comm.description)}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>
              {language === "en" ? "No commissions available." : "కమిషన్లు అందుబాటులో లేవు."}
            </Text>
          )}
        </View>

        <View style={[styles.sectionHeader, { marginTop: spacing["3xl"] }]}>
          <Text style={styles.sectionTitle}>ADDITIONAL TOOLS</Text>
          <View style={styles.sectionLine} />
        </View>

        <TouchableOpacity 
          activeOpacity={0.7} 
          style={styles.navCard}
          onPress={() => navigation.navigate("ExamList")}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: colors.overlay }]}>
              <Text style={styles.iconText}>📝</Text>
            </View>
          </View>
          <Text style={styles.cardTitle}>
            {language === "en" ? "Practice Exams" : "ప్రాక్టీస్ పరీక్షలు"}
          </Text>
          <Text style={styles.cardDesc}>
            {language === "en"
              ? "Take topic-wise, section-wise & full-length tests"
              : "టాపిక్ వారీగా మరియు పూర్తి స్థాయి పరీక్షలు రాయండి"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>
            {language === "en" ? "Logout" : "లాగౌట్"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentDashboard;

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
    fontWeight: "400",
  },
  userText: {
    ...typography.bodySm,
    color: colors.fgSecondary,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.fgMuted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.fgFaint,
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
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius:radii.sm,
    backgroundColor: colors.inset,
    borderWidth: 1,
    borderColor: colors.fgFaint,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.accent,
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
  emptyText: {
    ...typography.body,
    color: colors.fgMuted,
    textAlign: "center",
    marginTop: 20,
  },
  logoutBtn: {
    marginTop: spacing["3xl"],
    paddingVertical: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.fgFaint,
    borderRadius: radii.md,
  },
  logoutText: {
    ...typography.bodySm,
    color: colors.fgSecondary,
    fontWeight: "600",
  },
});

