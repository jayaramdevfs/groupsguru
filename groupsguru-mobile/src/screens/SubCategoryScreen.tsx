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
import { subCategoryService } from "../api/subCategoryService";
import { SubCategory } from "../api/types";
import { useLanguage } from "../context/LanguageContext";
import { LanguageToggle } from "../components/LanguageToggle";
import { PriceBadge } from "../components/PriceBadge";
import { ScreenHeader } from "../components/ScreenHeader";
import { colors, spacing, radii, typography } from "../theme/tokens";

type RootStackParamList = {
  Category: undefined;
  SubCategory: { categoryId: number; categoryName: string; categoryNameTe: string };
  Section: { subCategoryId: number; subCategoryName: string; subCategoryNameTe: string };
  StudyMaterial: { entityType: string; entityId: number; entityName: string };
};

type SubCategoryScreenRouteProp = RouteProp<RootStackParamList, 'SubCategory'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SubCategoryScreen = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SubCategoryScreenRouteProp>();
  const { categoryId, categoryName, categoryNameTe } = route.params;

  const fetchSubCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await subCategoryService.getByCategoryId(categoryId);
      setSubCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchSubCategories();
  }, [fetchSubCategories]);

  const renderSubCategory = ({ item }: { item: SubCategory }) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      style={styles.card}
      onPress={() => navigation.navigate("Section", { 
        subCategoryId: item.id, 
        subCategoryName: item.name,
        subCategoryNameTe: item.nameTe
      })}
    >
      <View style={styles.contentHeader}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>{item.syllabusCode || "S"}</Text>
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
            entityType: "SUB_CATEGORY", 
            entityId: item.id, 
            entityName: language === 'en' ? item.name : item.nameTe 
          })}
        >
          <Text style={styles.notesText}>📚 {language === "en" ? "NOTES" : "నోట్స్"}</Text>
        </TouchableOpacity>
        
        <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {language === 'en' ? "EXPLORE →" : "చూడండి →"}
            </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader 
        title={language === 'en' ? "Subjects" : "విషయాలు"} 
        subtitle={language === 'en' ? categoryName : categoryNameTe}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : subCategories.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No subjects found for this category.</Text>
        </View>
      ) : (
        <FlatList
          data={subCategories}
          renderItem={renderSubCategory}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchSubCategories}
        />
      )}
    </SafeAreaView>
  );
};

export default SubCategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  list: {
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    backgroundColor: colors.inset,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.accent,
    fontFamily: typography.mono.fontFamily,
  },
  titleArea: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.fgPrimary,
    marginBottom: 2,
  },
  desc: {
    fontSize: 13,
    color: colors.fgSecondary,
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
  },
  code: {
    fontSize: 10,
    color: colors.fgMuted,
    fontWeight: "bold",
    fontFamily: typography.mono.fontFamily,
  },
  badge: {
    paddingHorizontal: spacing.sm,
  },
  badgeText: { color: colors.accent, fontSize: 10, fontWeight: "bold", letterSpacing: 1 },
  notesBtn: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4, backgroundColor: colors.inset, borderWidth: 1, borderColor: colors.border },
  notesText: { color: colors.fgSecondary, fontSize: 9, fontWeight: "bold", letterSpacing: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    color: colors.fgMuted,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: typography.mono.fontFamily,
  },
});
