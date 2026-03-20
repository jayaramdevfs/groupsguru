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
  TextInput,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { registryService } from "../api/registryService";
import { MicroTopic } from "../api/types";
import { useLanguage } from "../context/LanguageContext";
import { LanguageToggle } from "../components/LanguageToggle";

type RootStackParamList = {
  Category: undefined;
  SubCategory: { categoryId: number; categoryName: string; categoryNameTe: string };
  Section: { subCategoryId: number; subCategoryName: string; subCategoryNameTe: string };
  Topic: { sectionId: number; sectionName: string; sectionNameTe: string };
  MicroTopic: { topicId: number; topicName: string; topicNameTe: string };
};

type MicroTopicScreenRouteProp = RouteProp<RootStackParamList, "MicroTopic">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MicroTopicScreen = () => {
  const [microTopics, setMicroTopics] = useState<MicroTopic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<MicroTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { language } = useLanguage();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<MicroTopicScreenRouteProp>();
  const { topicId, topicName, topicNameTe } = route.params;

  const fetchMicroTopics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await registryService.getPublicMicroTopics();
      // Filter the global micro-topics for this topicId
      const matched = data.content.filter(mt => mt.topicId === topicId);
      setMicroTopics(matched);
      setFilteredTopics(matched);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    fetchMicroTopics();
  }, [fetchMicroTopics]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredTopics(microTopics);
    } else {
      setFilteredTopics(
        microTopics.filter(mt => 
          mt.microTopicText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mt.topicName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mt.microTopicId.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, microTopics]);

  const renderMicroTopic = ({ item }: { item: MicroTopic }) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>⚛️</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.badges}>
          <View style={[styles.badge, styles.idBadge]}><Text style={styles.idBadgeText}>{item.microTopicId}</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>{item.subject}</Text></View>
          {item.paper && <View style={[styles.badge, styles.paperBadge]}><Text style={styles.paperBadgeText}>{item.paper}</Text></View>}
        </View>
        <Text style={styles.name}>
          {item.topicName || "Atomic Topic"}
        </Text>
        <Text style={styles.desc}>
          {item.microTopicText}
        </Text>
        <View style={styles.footer}>
          {item.groupApplicability && <Text style={styles.code}>🎯 {item.groupApplicability}</Text>}
          {item.dataConfidence && <Text style={styles.code}>✓ {item.dataConfidence.toUpperCase()}</Text>}
        </View>
      </View>
    </View>
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
            {language === "en" ? topicName : topicNameTe}
          </Text>
          <Text style={styles.title}>
            {language === "en" ? "Micro-Topics" : "మైక్రో-టాపిక్‌లు"}
          </Text>
        </View>
        <LanguageToggle />
      </View>

      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput}
          placeholder={language === "en" ? "Search micro-topics..." : "శోధించండి..."}
          placeholderTextColor="rgba(255,255,255,0.3)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#06b6d4" />
        </View>
      ) : filteredTopics.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No micro-topics found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTopics}
          renderItem={renderMicroTopic}
          keyExtractor={(item) => item.microTopicId}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchMicroTopics}
        />
      )}
    </SafeAreaView>
  );
};

export default MicroTopicScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f051d" },
  header: { paddingHorizontal: 24, paddingVertical: 20, flexDirection: "row", alignItems: "center" },
  backBtn: { padding: 10, marginLeft: -10 },
  backText: { color: "#FFFFFF", fontSize: 24, fontWeight: "bold" },
  headerTitleContainer: { flex: 1, marginLeft: 10 },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.6)", fontWeight: "600", textTransform: "uppercase" },
  title: { fontSize: 24, fontWeight: "800", color: "#FFFFFF", marginTop: 2 },
  searchContainer: { paddingHorizontal: 24, paddingBottom: 10 },
  searchInput: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 14, color: "#fff", fontSize: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  list: { padding: 24, paddingTop: 10 },
  card: { backgroundColor: "rgba(6, 182, 212, 0.05)", borderRadius: 24, padding: 16, marginBottom: 20, flexDirection: "row", alignItems: "flex-start", borderWidth: 1, borderColor: "rgba(6, 182, 212, 0.2)" },
  iconContainer: { width: 48, height: 48, borderRadius: 12, backgroundColor: "rgba(6, 182, 212, 0.1)", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(6, 182, 212, 0.3)" },
  iconText: { fontSize: 24 },
  content: { flex: 1, marginLeft: 16 },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  badge: { backgroundColor: "rgba(168, 85, 247, 0.15)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: "rgba(168, 85, 247, 0.3)" },
  badgeText: { color: "#c084fc", fontSize: 10, fontWeight: "700" },
  idBadge: { backgroundColor: "rgba(6, 182, 212, 0.15)", borderColor: "rgba(6, 182, 212, 0.3)" },
  idBadgeText: { color: "#22d3ee", fontSize: 10, fontWeight: "bold" },
  paperBadge: { backgroundColor: "rgba(59, 130, 246, 0.15)", borderColor: "rgba(59, 130, 246, 0.3)" },
  paperBadgeText: { color: "#60a5fa", fontSize: 10, fontWeight: "bold" },
  name: { fontSize: 18, fontWeight: "700", color: "#FFFFFF", marginBottom: 6 },
  desc: { fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 20, marginBottom: 12 },
  footer: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 16, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.05)", paddingTop: 12 },
  code: { fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: "600" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "rgba(255,255,255,0.4)", fontSize: 16, fontWeight: "600" },
});
