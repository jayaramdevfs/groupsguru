import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { LanguageToggle } from "../components/LanguageToggle";
import { registryService } from "../api/registryService";
import { useEffect, useState } from "react";

type RootStackParamList = {
  StudentDashboard: undefined;
  Category: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const StudentDashboard = () => {
  const { logout, user } = useAuth();
  const { language } = useLanguage();
  const navigation = useNavigation<NavigationProp>();
  const name = user?.email?.split("@")[0] ?? "Student";
  const [mtCount, setMtCount] = useState<number>(0);

  useEffect(() => {
    const fetchMtCount = async () => {
      try {
        const data = await registryService.getPublicMicroTopics();
        setMtCount(data.totalElements || data.content.length);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMtCount();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>
            {language === "en" ? "Student Space" : "TE Student Space"}
          </Text>
          <Text style={styles.title}>
            {language === "en" ? `Welcome, ${name}` : `TE Welcome, ${name}`}
          </Text>
          {mtCount > 0 && (
            <Text style={styles.mtBadge}>
              {language === "en" ? `Intelligence Registry loaded: ${mtCount} Micro-topics` : `మైక్రో-టాపిక్స్: ${mtCount}`}
            </Text>
          )}
        </View>
        <LanguageToggle />
      </View>

      <View style={styles.grid}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.navCard}
          onPress={() => navigation.navigate("Category")}
        >
          <Text style={styles.cardTitle}>
            {language === "en" ? "Exam Categories" : "TE Exam Categories"}
          </Text>
          <Text style={styles.cardDesc}>
            {language === "en"
              ? "Start your preparation path"
              : "TE Start your preparation path"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} style={[styles.navCard, styles.disabledCard]}>
          <Text style={styles.cardTitle}>
            {language === "en" ? "My Progress" : "TE My Progress"}
          </Text>
          <Text style={styles.cardDesc}>
            {language === "en"
              ? "Progress analytics coming soon"
              : "TE Progress analytics coming soon"}
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

export default StudentDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f051d",
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  mtBadge: {
    color: "#d8b4fe",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 8,
    backgroundColor: "rgba(147, 51, 234, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  grid: {
    marginTop: 24,
    gap: 14,
  },
  navCard: {
    backgroundColor: "rgba(147, 51, 234, 0.08)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.2)",
    padding: 20,
  },
  disabledCard: {
    opacity: 0.7,
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
    marginTop: "auto",
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
