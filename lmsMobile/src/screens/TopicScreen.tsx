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
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { topicService } from "../api/topicService";
import { Topic } from "../api/types";
import { useLanguage } from "../context/LanguageContext";
import { LanguageToggle } from "../components/LanguageToggle";

type RootStackParamList = {
  Category: undefined;
  SubCategory: { categoryId: number; categoryName: string; categoryNameTe: string };
  Section: { subCategoryId: number; subCategoryName: string; subCategoryNameTe: string };
  Topic: { sectionId: number; sectionName: string; sectionNameTe: string };
  MicroTopic: { topicId: number; topicName: string; topicNameTe: string };
};

type TopicScreenRouteProp = RouteProp<RootStackParamList, 'Topic'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TopicScreen = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<TopicScreenRouteProp>();
  const { sectionId, sectionName, sectionNameTe } = route.params;

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await topicService.getBySectionId(sectionId);
      setTopics(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const renderTopic = ({ item }: { item: Topic }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => {
        navigation.navigate("MicroTopic", {
          topicId: item.id,
          topicName: item.name,
          topicNameTe: item.nameTe,
        });
      }}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{item.topicCode || 'T'}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>
          {language === 'en' ? item.name : item.nameTe}
        </Text>
        <Text style={styles.desc} numberOfLines={3}>
          {language === 'en' ? item.description : item.descriptionTe}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.code}>Code: {item.topicCode}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {language === "en" ? "Micro-Topics" : "మైక్రో-టాపిక్స్"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.subtitle}>
            {language === 'en' ? sectionName : sectionNameTe}
          </Text>
          <Text style={styles.title}>
            {language === 'en' ? "Topics" : "టాపిక్‌లు"}
          </Text>
        </View>
        <LanguageToggle />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : topics.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No topics found for this section.</Text>
        </View>
      ) : (
        <FlatList
          data={topics}
          renderItem={renderTopic}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchTopics}
        />
      )}
    </SafeAreaView>
  );
};

export default TopicScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f051d" },
  header: { paddingHorizontal: 24, paddingVertical: 20, flexDirection: "row", alignItems: "center" },
  backBtn: { padding: 10, marginLeft: -10 },
  backText: { color: "#FFFFFF", fontSize: 24, fontWeight: "bold" },
  headerTitleContainer: { flex: 1, marginLeft: 10 },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.6)", fontWeight: "600", textTransform: "uppercase" },
  title: { fontSize: 24, fontWeight: "800", color: "#FFFFFF", marginTop: 2 },
  list: { padding: 24, paddingTop: 10 },
  card: { backgroundColor: "rgba(16, 185, 129, 0.08)", borderRadius: 24, padding: 16, marginBottom: 20, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "rgba(16, 185, 129, 0.2)" },
  iconContainer: { width: 56, height: 56, borderRadius: 16, backgroundColor: "#064e3b", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(16, 185, 129, 0.4)" },
  iconText: { fontSize: 20, fontWeight: "bold", color: "#10b981" },
  content: { flex: 1, marginLeft: 16 },
  name: { fontSize: 18, fontWeight: "700", color: "#FFFFFF", marginBottom: 4 },
  desc: { fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 18, marginBottom: 8 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  code: { fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: "600" },
  badge: { backgroundColor: "rgba(16, 185, 129, 0.15)", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  badgeText: { color: "#10b981", fontSize: 11, fontWeight: "700" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "rgba(255,255,255,0.4)", fontSize: 16, fontWeight: "600" },
});
