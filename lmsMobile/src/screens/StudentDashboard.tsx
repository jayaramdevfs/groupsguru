import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { ProfessionalLogo } from "../components/ProfessionalLogo";
import { LanguageToggle } from "../components/LanguageToggle";
import { BackgroundGlow } from "../components/BackgroundGlow";
import { PriceBadge } from "../components/PriceBadge";
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
      <BackgroundGlow />
      
      <View style={styles.header}>
        <View style={styles.logoWrapper}>
          <ProfessionalLogo size={32} />
        </View>
        <LanguageToggle />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.subtitle}>
            {language === "en" ? "Student Space" : "విద్యార్థి విభాగం"}
          </Text>
          <Text style={styles.title}>
            {language === "en" ? `Welcome, ${name}` : `స్వాగతం, ${name}`}
          </Text>
        </View>

        <View style={styles.grid}>
          {loading ? (
            <ActivityIndicator size="large" color="#9333EA" style={{ marginVertical: 40 }} />
          ) : commissions.length > 0 ? (
            commissions.map((comm) => (
              <TouchableOpacity
                key={comm.id}
                activeOpacity={0.8}
                style={styles.navCard}
                onPress={() => navigation.navigate("Category", { commissionId: comm.id, commissionName: comm.code })}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>{comm.code.charAt(0)}</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.cardTitle}>{comm.name}</Text>
                  <PriceBadge accessType={comm.accessType} priceInr={comm.priceInr} />
                </View>
                <Text style={styles.cardDesc}>
                  {language === "en" ? comm.description : (comm.descriptionTe || comm.description)}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
              {language === "en" ? "No commissions available." : "కమిషన్లు అందుబాటులో లేవు."}
            </Text>
          )}

          <TouchableOpacity 
            activeOpacity={0.8} 
            style={[styles.navCard, { marginTop: 10 }]}
            onPress={() => navigation.navigate("ExamList")}
          >
            <View style={styles.iconContainerVariant}>
              <Text style={styles.iconText}>📝</Text>
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
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.buttonText}>
            {language === "en" ? "Logout" : "లాగౌట్"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StudentDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f051d",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    marginBottom: 16,
  },
  logoWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 4,
  },
  grid: {
    marginTop: 10,
    gap: 16,
  },
  navCard: {
    backgroundColor: "rgba(147, 51, 234, 0.08)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.2)",
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(147, 51, 234, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainerVariant: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(236, 72, 153, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  iconText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d8b4fe",
  },
  cardTitle: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 20,
  },
  cardDesc: {
    color: "rgba(255,255,255,0.65)",
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    paddingTop: 0,
  },
  logoutButton: {
    backgroundColor: "#9333EA",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
