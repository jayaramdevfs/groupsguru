import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { ProfessionalLogo } from "../components/ProfessionalLogo";
import { LanguageToggle } from "../components/LanguageToggle";
import { PriceBadge } from "../components/PriceBadge";
import { ScreenHeader } from "../components/ScreenHeader";
import { colors, spacing, radii, typography } from "../theme/tokens";
import { commissionService } from "../api/commissionService";
import { Commission } from "../api/types";
import { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const StudentDashboard = () => {
  const { logout, user } = useAuth();
  const { language } = useLanguage();
  const navigation = useNavigation<NavigationProp>();
  const name = user?.name ?? user?.email?.split("@")[0] ?? "Student";
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
      
      {/* Refined Mirror Header */}
      <ScreenHeader title={language === 'en' ? 'Dashboard' : 'డ్యాష్‌బోర్డ్'} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Synapsing Hero Node */}
        <View style={styles.welcomeSection}>
           <View style={styles.vaultBadge}>
              <Text style={styles.vaultBadgeText}>
                {language === "en" ? "INTELLIGENCE_LAYER_V2.6" : "ఇంటెలిజెన్స్_లేయర్_V2.6"}
              </Text>
           </View>
           <Text style={styles.title}>
             {language === "en" ? `Syncing, ${name}` : `సింకింగ్, ${name}`}
           </Text>
           <Text style={styles.subtitle}>
             {language === "en" 
               ? "Synchronize your target syllabus and retrieve predictive exam nodes." 
               : "మీ సిలబస్‌ను సింక్ చేయండి మరియు పరీక్ష నోడ్స్‌ను పొందండి."}
           </Text>
        </View>

        {/* Global Access Dock */}
        <View style={styles.dock}>
           <TouchableOpacity 
             style={styles.dockNode}
             onPress={() => navigation.navigate("StudyMaterial", { entityType: "GLOBAL", entityId: 0, entityName: "Global Registry" })}
           >
              <View style={[styles.dockIcon, { backgroundColor: colors.accentSubtle }]}>
                 <Text style={{fontSize: 20}}>📚</Text>
              </View>
              <Text style={styles.dockText}>{language === "en" ? "VAULT" : "వాల్ట్"}</Text>
           </TouchableOpacity>

           <TouchableOpacity 
             style={styles.dockNode}
             onPress={() => navigation.navigate("ExamList")}
           >
              <View style={[styles.dockIcon, { backgroundColor: colors.fgFaint }]}>
                 <Text style={{fontSize: 20}}>📝</Text>
              </View>
              <Text style={styles.dockText}>{language === "en" ? "EXAMS" : "పరీక్షలు"}</Text>
           </TouchableOpacity>

           <TouchableOpacity 
             style={styles.dockNode}
             onPress={() => navigation.navigate("Intelligence")}
           >
              <View style={[styles.dockIcon, { backgroundColor: colors.inset }]}>
                 <Text style={{fontSize: 20}}>📊</Text>
              </View>
              <Text style={styles.dockText}>{language === "en" ? "RANK" : "ర్యాంక్"}</Text>
           </TouchableOpacity>
        </View>

        {/* Target Commissions Registry */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>SYLLABUS_REGISTRY</Text>
          <View style={styles.sectionLine} />
        </View>

        {loading ? (
             <ActivityIndicator size="small" color={colors.accent} style={{ marginVertical: 40 }} />
        ) : commissions.length > 0 ? (
          <View style={styles.grid}>
            {commissions.map((comm) => (
              <TouchableOpacity
                key={comm.id}
                activeOpacity={0.8}
                style={styles.navCard}
                onPress={() => navigation.navigate("Category", { commissionId: comm.id, commissionName: comm.code })}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconBox}>
                    <Text style={styles.iconText}>{comm.code.charAt(0)}</Text>
                  </View>
                  <View style={styles.cardStatus}>
                    <PriceBadge accessType={comm.accessType} priceInr={comm.priceInr} />
                  </View>
                </View>
                
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{comm.name}</Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>
                    {language === "en" ? comm.description : (comm.descriptionTe || comm.description)}
                  </Text>
                </View>

                <View style={styles.cardFooter}>
                   <View style={styles.metadataPill}>
                      <Text style={styles.metadataText}>#{comm.code}</Text>
                   </View>
                   <Text style={styles.actionPrompt}>{language === "en" ? "ACCESS ARCHIVE →" : "ఆర్కైవ్ చూడండి →"}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
             <Text style={styles.emptyText}>
               {language === "en" ? "No SYLLABUS active in your region." : "ఈ ప్రాంతంలో సిలబస్ ఏదీ అందుబాటులో లేదు."}
             </Text>
          </View>
        )}

        <View style={styles.footerBranding}>
           <Text style={styles.footerTag}>GroupsGuru Intelligence Engine • v2.6</Text>
        </View>
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.base,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  secondaryBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryBtnText: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.error,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingBottom: spacing["5xl"],
  },
  welcomeSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing["3xl"],
    paddingBottom: spacing.xl,
  },
  vaultBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.accentSubtle,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: spacing.md,
    shadowColor: colors.accent,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  vaultBadgeText: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "400",
    color: colors.fgPrimary,
    fontFamily: 'serif',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.fgSecondary,
    lineHeight: 18,
    maxWidth: '85%',
  },
  dock: {
    flexDirection: "row",
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["2xl"],
    gap: spacing.md,
  },
  dockNode: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  dockIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dockText: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.fgMuted,
    letterSpacing: 1.5,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.fgMuted,
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  grid: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  navCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: colors.inset,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.accent,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
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
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  metadataPill: {
    backgroundColor: colors.inset,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  metadataText: {
    fontSize: 8,
    fontFamily: 'monospace',
    fontWeight: "bold",
    color: colors.fgMuted,
  },
  actionPrompt: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.accent,
    letterSpacing: 1,
  },
  emptyState: {
    paddingVertical: spacing["5xl"],
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: colors.fgMuted,
    textAlign: "center",
  },
  footerBranding: {
    marginTop: spacing["5xl"],
    alignItems: "center",
    opacity: 0.3,
  },
  footerTag: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.fgMuted,
    letterSpacing: 1,
  },
  cardStatus: {
    paddingHorizontal: 4,
  },
  cardBody: {
    paddingVertical: 4,
  },
});

