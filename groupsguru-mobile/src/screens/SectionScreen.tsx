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
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { sectionService } from "../api/sectionService";
import { Section } from "../api/types";
import { useLanguage } from "../context/LanguageContext";
import { LanguageToggle } from "../components/LanguageToggle";
import { PriceBadge } from "../components/PriceBadge";
import { ScreenHeader } from "../components/ScreenHeader";
import { colors, spacing, radii, typography } from "../theme/tokens";

type RootStackParamList = {
  Category: undefined;
  SubCategory: { categoryId: number; categoryName: string; categoryNameTe: string };
  Section: { subCategoryId: number; subCategoryName: string; subCategoryNameTe: string };
  Topic: { sectionId: number; sectionName: string; sectionNameTe: string };
  StudyMaterial: { entityType: string; entityId: number; entityName: string };
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
      activeOpacity={0.7}
      style={styles.card}
      onPress={() => {
        navigation.navigate("Topic", {
          sectionId: item.id,
          sectionName: item.name,
          sectionNameTe: item.nameTe,
        });
      }}
    >
      <View style={styles.contentHeader}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>{item.sectionCode || 'S'}</Text>
        </View>
        <View style={styles.titleArea}>
           <Text style={styles.name}>
             {language === 'en' ? item.name : item.nameTe}
           </Text>
           <PriceBadge accessType={item.accessType} priceInr={item.priceInr} />
        </View>
      </View>
      
      <Text style={styles.desc} numberOfLines={2}>
        {language === 'en' ? item.description : item.descriptionTe}
      </Text>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.notesBtn} 
          onPress={() => navigation.navigate("StudyMaterial", { 
            entityType: "SECTION", 
            entityId: item.id, 
            entityName: language === 'en' ? item.name : item.nameTe 
          })}
        >
          <Text style={styles.notesText}>📚 {language === "en" ? "NOTES" : "నోట్స్"}</Text>
        </TouchableOpacity>
        
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {language === "en" ? "EXPLORE →" : "చూడండి →"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader 
        title={language === 'en' ? "Sections" : "భాగాలు"} 
        subtitle={language === 'en' ? subCategoryName : subCategoryNameTe}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.accent} />
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
  container: { flex: 1, backgroundColor: colors.base },
  list: { padding: spacing.xl },
  card: { backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  contentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  iconContainer: { width: 44, height: 44, borderRadius: radii.sm, backgroundColor: colors.inset, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: colors.border },
  iconText: { fontSize: 16, fontWeight: "bold", color: colors.accent, fontFamily: typography.mono.fontFamily },
  titleArea: { flex: 1, marginLeft: spacing.md },
  name: { fontSize: 18, fontWeight: "700", color: colors.fgPrimary, marginBottom: 2 },
  desc: { fontSize: 13, color: colors.fgSecondary, lineHeight: 18, marginBottom: spacing.lg },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  code: { fontSize: 10, color: colors.fgMuted, fontWeight: "bold", fontFamily: typography.mono.fontFamily },
  badge: { paddingHorizontal: spacing.sm },
  badgeText: { color: colors.accent, fontSize: 10, fontWeight: "bold", letterSpacing: 1 },
  notesBtn: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4, backgroundColor: colors.inset, borderWidth: 1, borderColor: colors.border },
  notesText: { color: colors.fgSecondary, fontSize: 9, fontWeight: "bold", letterSpacing: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: colors.fgMuted, fontSize: 14, fontWeight: "500", fontFamily: typography.mono.fontFamily },
});
