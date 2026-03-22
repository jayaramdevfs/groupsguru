import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { ProfessionalLogo } from "../components/ProfessionalLogo";
import { LanguageToggle } from "../components/LanguageToggle";
import { BackgroundGlow } from "../components/BackgroundGlow";
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <BackgroundGlow />
      <View style={styles.header}>
        <View style={styles.logoWrapper}>
          <ProfessionalLogo size={32} />
        </View>
        <LanguageToggle />
      </View>

      <View style={styles.welcomeSection}>
        <Text style={styles.subtitle}>
          {language === "en" ? "Admin Console" : "TE Admin Console"}
        </Text>
        <Text style={styles.title}>
          {language === "en" ? "Welcome Back" : "TE Welcome Back"}
        </Text>
        <Text style={styles.userText}>{user?.email ?? ""}</Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsLabel}>
          {language === "en" ? "Total Categories" : "TE Total Categories"}
        </Text>
        {loading ? (
          <ActivityIndicator size="small" color="#9333EA" />
        ) : (
          <Text style={styles.statsValue}>{categoryCount}</Text>
        )}
      </View>

      <View style={styles.grid}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.navCard}
          onPress={() => navigation.navigate("Category")}
        >
          <Text style={styles.cardTitle}>
            {language === "en" ? "Categories" : "TE Categories"}
          </Text>
          <Text style={styles.cardDesc}>
            {language === "en"
              ? "Manage exam categories"
              : "TE Manage exam categories"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.navCard}
          onPress={() => navigation.navigate("Category")}
        >
          <Text style={styles.cardTitle}>
            {language === "en" ? "Sub Categories" : "TE Sub Categories"}
          </Text>
          <Text style={styles.cardDesc}>
            {language === "en"
              ? "Open categories and drill down"
              : "TE Open categories and drill down"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.navCard}
          onPress={() => navigation.navigate("Intelligence")}
        >
          <Text style={styles.cardTitle}>
            {language === "en" ? "Intelligence Engine" : "TE Intelligence Engine"}
          </Text>
          <Text style={styles.cardDesc}>
            {language === "en"
              ? "View AI prediction scores and PYQ analysis"
              : "TE View AI prediction scores and PYQ analysis"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.navCard}
          onPress={() => navigation.navigate("QuestionList")}
        >
          <Text style={styles.cardTitle}>
            {language === "en" ? "Question Bank" : "ప్రశ్న బ్యాంక్"}
          </Text>
          <Text style={styles.cardDesc}>
            {language === "en"
              ? "Browse and search bilingual MCQs"
              : "ద్విభాషా MCQలను బ్రౌజ్ చేయండి"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.buttonText}>
            {language === "en" ? "Logout" : "TE Logout"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f051d",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    paddingRight: 8,
  },
  logoWrapper: {
    flex: 1,
  },
  welcomeSection: {
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  userText: {
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
    fontWeight: "600",
  },
  statsCard: {
    marginTop: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.25)",
    backgroundColor: "rgba(147, 51, 234, 0.08)",
    padding: 18,
  },
  statsLabel: {
    color: "rgba(255,255,255,0.65)",
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statsValue: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 32,
    marginTop: 8,
  },
  grid: {
    marginTop: 22,
    gap: 14,
  },
  navCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.2)",
    backgroundColor: "rgba(147, 51, 234, 0.08)",
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 2,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 20,
  },
  cardDesc: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
    fontWeight: "600",
  },
  footer: {
    marginTop: "auto",
  },
  logoutButton: {
    backgroundColor: "#DB2777",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
