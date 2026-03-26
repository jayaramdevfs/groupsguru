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
import { colors, spacing, radii, typography } from "../theme/tokens";
import { ScreenHeader } from "../components/ScreenHeader";

type RootStackParamList = {
  Category: undefined;
  SubCategory: { categoryId: number; categoryName: string; categoryNameTe: string };
  Section: { subCategoryId: number; subCategoryName: string; subCategoryNameTe: string };
  Topic: { sectionId: number; sectionName: string; sectionNameTe: string };
  MicroTopic: { topicId: number; topicName: string; topicNameTe: string };
  StudyMaterial: { entityType: string; entityId: number; entityName: string };
  QuestionList: { microTopicId?: string; entityName?: string };
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
         <View style={{ flex: 1 }}>
            <View style={styles.badges}>
               <View style={styles.idBadge}><Text style={styles.idBadgeText}>{item.microTopicId}</Text></View>
               {item.paper && <View style={styles.paperBadge}><Text style={styles.paperBadgeText}>{item.paper}</Text></View>}
            </View>
            <Text style={styles.name}>
              {`Node ${item.microTopicId}`}
            </Text>
         </View>
         <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.dataConfidence?.toUpperCase() || "STABLE"}</Text>
         </View>
      </View>
      
      <Text style={styles.desc}>
        {item.microTopicText}
      </Text>
      
      {item.groupApplicability && (
        <View style={styles.applicabilityRow}>
           <Text style={styles.appLabel}>GROUPS:</Text>
           <Text style={styles.appValue}>{item.groupApplicability}</Text>
        </View>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => navigation.navigate("QuestionList", { 
            microTopicId: item.microTopicId,
            entityName: item.microTopicId 
          })}
        >
          <Text style={styles.actionBtnText}>⚡ PRACTICE</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionBtn, { borderColor: colors.border }]}
          onPress={() => navigation.navigate("StudyMaterial", { 
            entityType: "MICRO_TOPIC", 
            entityId: item.id, 
            entityName: item.microTopicId 
          })}
        >
          <Text style={[styles.actionBtnText, { color: colors.fgSecondary }]}>📚 NOTES</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader 
        title={language === "en" ? "Syllabus Registry" : "సిలబస్ రిజిస్ట్రీ"} 
        subtitle={language === "en" ? topicName : topicNameTe}
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <TextInput 
            style={styles.searchInput}
            placeholder={language === "en" ? "Search within this node..." : "శోధించండి..."}
            placeholderTextColor={colors.fgMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : filteredTopics.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No micro-topics found matching criteria.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTopics}
          renderItem={renderMicroTopic}
          keyExtractor={(item, index) => `${item.microTopicId}-${index}`}
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
  searchContainer: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  searchBox: { backgroundColor: colors.inset, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 0 },
  searchInput: { backgroundColor: colors.inset, borderRadius: radii.sm, padding: spacing.md, color: colors.fgPrimary, fontSize: 14, fontFamily: typography.mono.fontFamily },
  list: { padding: spacing.xl },
  card: { backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  idBadge: { backgroundColor: colors.inset, paddingHorizontal: 6, paddingVertical: 2, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.border },
  idBadgeText: { color: colors.fgMuted, fontSize: 10, fontWeight: "bold", fontFamily: typography.mono.fontFamily },
  paperBadge: { backgroundColor: colors.accent + '20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.accent + '40' },
  paperBadgeText: { color: colors.accent, fontSize: 10, fontWeight: "bold" },
  name: { fontSize: 16, fontWeight: "700", color: colors.fgPrimary },
  desc: { fontSize: 13, color: colors.fgSecondary, lineHeight: 18, marginBottom: spacing.md },
  statusBadge: { backgroundColor: colors.inset, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: colors.border },
  statusText: { fontSize: 8, fontWeight: 'bold', color: colors.success, letterSpacing: 0.5 },
  applicabilityRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.md, paddingHorizontal: 4 },
  appLabel: { fontSize: 9, fontWeight: 'bold', color: colors.fgMuted },
  appValue: { fontSize: 9, fontWeight: 'bold', color: colors.accent, fontFamily: typography.mono.fontFamily },
  actionRow: { flexDirection: 'row', gap: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  actionBtn: { flex: 1, height: 32, backgroundColor: colors.inset, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.accent + '40', justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { fontSize: 9, fontWeight: 'bold', color: colors.accent, letterSpacing: 0.5 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: colors.fgMuted, fontSize: 14, fontWeight: "500", fontFamily: typography.mono.fontFamily },
});
