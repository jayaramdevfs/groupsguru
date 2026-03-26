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
import Markdown from "react-native-markdown-display";
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
        setContent("### ⚠️ Load Error\nUnable to retrieve the content for this knowledge node. Please ensure your connection is stable or try downloading the PDF version.");
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [material.id]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#141413" />
      <View style={styles.header}>
         <View style={styles.headerTag}>
           <View style={styles.tagDot} />
           <Text style={styles.label}>
             {material.subject || (language === 'en' ? "CORE KNOWLEDGE NODE" : "కోర్ నాలెడ్జ్ నోడ్")}
           </Text>
         </View>
        <Text style={styles.title} numberOfLines={2}>
          {language === 'en' ? material.title : material.titleTe}
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Synchronizing Node...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={true}>
          <View style={styles.contentCard}>
            <Markdown style={markdownStyles}>
              {content}
            </Markdown>
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
    backgroundColor: "#111110",
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    backgroundColor: "#141413",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A28",
  },
  headerTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(217,119,6,0.1)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(217,119,6,0.2)",
    marginBottom: 12,
  },
  tagDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginRight: 6,
  },
  label: {
    fontSize: 9,
    color: colors.accent,
    fontWeight: "bold",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "serif",
    color: "#ffffff",
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    paddingLeft: 12,
    letterSpacing: -0.5,
  },
  scrollContainer: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  contentCard: {
    paddingBottom: spacing.xl,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
  },
  loadingText: {
    marginTop: 16,
    color: colors.fgMuted,
    fontSize: 12,
    fontFamily: "monospace",
    fontWeight: "bold",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    color: "#F3F4F6",
    fontSize: 15,
    lineHeight: 26,
    fontFamily: "sans-serif", // Translates nicely on android
  },
  heading1: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
    marginTop: 24,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A28",
    fontFamily: "serif", // Exact parity with web's font-serif
  },
  heading2: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginTop: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    paddingLeft: 10,
    fontFamily: "serif",
  },
  heading3: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.accent,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(217,119,6,0.05)",
    borderLeftWidth: 2,
    borderLeftColor: colors.accent,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  paragraph: {
    marginBottom: 16,
    color: "#F3F4F6",
    lineHeight: 26,
  },
  list_item: {
    flexDirection: "row",
    marginBottom: 8,
    color: "#F3F4F6",
    lineHeight: 26,
  },
  bullet_list_icon: {
    color: colors.accent,
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  code_inline: {
    backgroundColor: "#1C1C1C",
    borderColor: "#2A2A28",
    borderWidth: 1,
    color: colors.accent,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 13,
    fontFamily: "monospace",
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    paddingLeft: 16,
    backgroundColor: "#191918",
    paddingVertical: 16,
    paddingRight: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    marginVertical: 24,
    fontStyle: "italic",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: "#2A2A28",
    borderRadius: 12,
    marginVertical: 24,
    backgroundColor: "#141413",
  },
  th: {
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A28",
    padding: 12,
    backgroundColor: "#191918",
    color: "#888888",
    fontWeight: "700",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontFamily: "monospace",
  },
  td: {
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A28",
    padding: 12,
    color: "#F3F4F6",
    fontSize: 14,
  },
  strong: {
    fontWeight: "700",
    color: "#ffffff",
    backgroundColor: "rgba(217,119,6,0.2)", // Mimicking web highlight
  },
  em: {
    fontStyle: "italic",
    color: "#E8E8E8",
  },
});
