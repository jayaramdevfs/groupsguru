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
import { sectionService } from "../api/sectionService";
import { Section } from "../api/types";
import { useLanguage } from "../context/LanguageContext";
import { LanguageToggle } from "../components/LanguageToggle";
import { PriceBadge } from "../components/PriceBadge";

type RootStackParamList = {
  Category: undefined;
  SubCategory: { categoryId: number; categoryName: string; categoryNameTe: string };
  Section: { subCategoryId: number; subCategoryName: string; subCategoryNameTe: string };
  Topic: { sectionId: number; sectionName: string; sectionNameTe: string };
};

type SectionScreenRouteProp = RouteProp<RootStackParamList, 'Section'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SectionScreen = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SectionScreenRouteProp>();
  const { subCategoryId, subCategoryName, subCategoryNameTe } = route.params;

  const fetchSections = useCallback(async () => {
    setLoading(true);
    try {
      const data = await sectionService.getBySubCategoryId(subCategoryId);
      setSections(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [subCategoryId]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const renderSection = ({ item }: { item: Section }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => {
        navigation.navigate("Topic", {
          sectionId: item.id,
          sectionName: item.name,
          sectionNameTe: item.nameTe,
        });
      }}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{item.sectionCode || 'S'}</Text>
      </View>
      <View style={styles.content}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
          <Text style={styles.name}>
            {language === 'en' ? item.name : item.nameTe}
          </Text>
          <PriceBadge accessType={item.accessType} priceInr={item.priceInr} />
        </View>
        <Text style={styles.desc} numberOfLines={2}>
          {language === 'en' ? item.description : item.descriptionTe}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.code}>Code: {item.sectionCode}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {language === "en" ? "Topics" : "టాపిక్‌లు"}
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
            {language === 'en' ? subCategoryName : subCategoryNameTe}
          </Text>
          <Text style={styles.title}>
            {language === 'en' ? "Sections" : "భాగాలు"}
          </Text>
        </View>
        <LanguageToggle />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#9333EA" />
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No sections found for this subject.</Text>
        </View>
      ) : (
        <FlatList
          data={sections}
          renderItem={renderSection}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchSections}
        />
      )}
    </SafeAreaView>
  );
};

export default SectionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f051d" },
  header: { paddingHorizontal: 24, paddingVertical: 20, flexDirection: "row", alignItems: "center" },
  backBtn: { padding: 10, marginLeft: -10 },
  backText: { color: "#FFFFFF", fontSize: 24, fontWeight: "bold" },
  headerTitleContainer: { flex: 1, marginLeft: 10 },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.6)", fontWeight: "600", textTransform: "uppercase" },
  title: { fontSize: 24, fontWeight: "800", color: "#FFFFFF", marginTop: 2 },
  list: { padding: 24, paddingTop: 10 },
  card: { backgroundColor: "rgba(147, 51, 234, 0.08)", borderRadius: 24, padding: 16, marginBottom: 20, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "rgba(147, 51, 234, 0.2)" },
  iconContainer: { width: 56, height: 56, borderRadius: 16, backgroundColor: "#2e1065", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(147, 51, 234, 0.4)" },
  iconText: { fontSize: 20, fontWeight: "bold", color: "#9333EA" },
  content: { flex: 1, marginLeft: 16 },
  name: { fontSize: 18, fontWeight: "700", color: "#FFFFFF", marginBottom: 4 },
  desc: { fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 18, marginBottom: 8 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  code: { fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: "600" },
  badge: { backgroundColor: "rgba(147, 51, 234, 0.15)", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  badgeText: { color: "#a855f7", fontSize: 11, fontWeight: "700" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "rgba(255,255,255,0.4)", fontSize: 16, fontWeight: "600" },
});
