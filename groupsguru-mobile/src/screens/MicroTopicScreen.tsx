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
import { PriceBadge } from "../components/PriceBadge";
import { colors, spacing, radii, typography } from "../theme/tokens";

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
      <View style={styles.cardHeader}>
         <View style={styles.iconContainer}>
           <Text style={styles.iconText}>⚛</Text>
         </View>
         <View style={styles.titleArea}>
            <View style={styles.badges}>
              <View style={styles.idBadge}><Text style={styles.idBadgeText}>{item.microTopicId}</Text></View>
              {item.paper && <View style={styles.paperBadge}><Text style={styles.paperBadgeText}>{item.paper}</Text></View>}
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8}}>
              <Text style={styles.name}>
                {item.topicName || "Atomic Topic"}
              </Text>
              <PriceBadge accessType={item.accessType} priceInr={item.priceInr} />
            </View>
         </View>
      </View>
      
      <Text style={styles.desc}>
        {item.microTopicText}
      </Text>
      
      <View style={styles.footer}>
        {item.groupApplicability && <Text style={styles.code}>🎯 {item.groupApplicability}</Text>}
        {item.dataConfidence && <Text style={styles.code}>✓ CONFIDENCE: {item.dataConfidence.toUpperCase()}</Text>}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.label}>
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
          placeholderTextColor={colors.fgMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.accent} />
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
  container: { flex: 1, backgroundColor: colors.base },
  header: { paddingHorizontal: spacing.xl, paddingVertical: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", alignItems: "center" },
  backBtn: { padding: spacing.xs, marginRight: spacing.sm },
  backIcon: { color: colors.fgPrimary, fontSize: 24, fontWeight: "300" },
  headerTitleContainer: { flex: 1 },
  label: { fontSize: 10, color: colors.fgMuted, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 2 },
  title: { fontSize: 22, fontWeight: "400", color: colors.fgPrimary, fontFamily: 'serif' },
  searchContainer: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  searchInput: { backgroundColor: colors.inset, borderRadius: radii.sm, padding: spacing.md, color: colors.fgPrimary, fontSize: 14, borderWidth: 1, borderColor: colors.border, fontFamily: typography.mono.fontFamily },
  list: { padding: spacing.xl },
  card: { backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  iconContainer: { width: 40, height: 40, borderRadius: radii.sm, backgroundColor: colors.inset, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: colors.border },
  iconText: { fontSize: 20, color: colors.accent },
  titleArea: { flex: 1, marginLeft: spacing.md },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  idBadge: { backgroundColor: colors.inset, paddingHorizontal: 6, paddingVertical: 2, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.border },
  idBadgeText: { color: colors.fgMuted, fontSize: 10, fontWeight: "bold", fontFamily: typography.mono.fontFamily },
  paperBadge: { backgroundColor: colors.accent + '20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.accent + '40' },
  paperBadgeText: { color: colors.accent, fontSize: 10, fontWeight: "bold" },
  name: { fontSize: 18, fontWeight: "700", color: colors.fgPrimary },
  desc: { fontSize: 14, color: colors.fgSecondary, lineHeight: 20, marginBottom: spacing.xl },
  footer: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  code: { fontSize: 10, color: colors.fgMuted, fontWeight: "bold", fontFamily: typography.mono.fontFamily },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: colors.fgMuted, fontSize: 14, fontWeight: "500", fontFamily: typography.mono.fontFamily },
});
