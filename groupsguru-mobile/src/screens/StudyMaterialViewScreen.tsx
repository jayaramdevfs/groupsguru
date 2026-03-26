import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { studyMaterialService } from "../api/studyMaterialService";
import { StudyMaterial } from "../api/types";
import { useLanguage } from "../context/LanguageContext";
import { colors, spacing, radii, typography } from "../theme/tokens";

type RootStackParamList = {
  StudyMaterialView: { material: StudyMaterial };
};

const StudyMaterialViewScreen = () => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  const route = useRoute<RouteProp<RootStackParamList, "StudyMaterialView">>();
  const { material } = route.params;

  useEffect(() => {
    const loadContent = async () => {
      try {
        const text = await studyMaterialService.fetchContent(material.id);
        setContent(text);
      } catch (error) {
        console.error("Failed to fetch study material content", error);
        setContent("Error loading content. Please ensure you are logged in and have access.");
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [material.id]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.label}>
          {language === 'en' ? "READING" : "చదువుతున్నాము"}
        </Text>
        <Text style={styles.title} numberOfLines={1}>
          {language === 'en' ? material.title : material.titleTe}
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={styles.loadingText}>Fetching material content...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={true}>
          <View style={styles.contentCard}>
            <Text style={styles.contentText}>{content}</Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default StudyMaterialViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.fgFaint,
  },
  label: {
    fontSize: 9,
    color: colors.accent,
    fontWeight: "bold",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.fgPrimary,
  },
  scrollContainer: {
    padding: spacing.xl,
    paddingBottom: 100,
  },
  contentCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.fgFaint,
    minHeight: Dimensions.get('window').height - 200,
  },
  contentText: {
    fontSize: 15,
    color: colors.fgPrimary,
    lineHeight: 24,
    fontFamily: 'monospace', // Simple fallback for now
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: colors.fgMuted,
    fontSize: 12,
  },
});
