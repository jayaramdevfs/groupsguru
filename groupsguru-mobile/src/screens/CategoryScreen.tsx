import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { categoryService } from "../api/categoryService";
import { Category } from "../api/types";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { PriceBadge } from "../components/PriceBadge";
import { colors, spacing, radii, typography } from "../theme/tokens";
import { ScreenHeader } from "../components/ScreenHeader";

type RootStackParamList = {
  Category: { commissionId?: number; commissionName?: string };
  SubCategory: { categoryId: number; categoryName: string; categoryNameTe: string };
  StudyMaterial: { entityType: string; entityId: number; entityName: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CategoryScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const { language } = useLanguage();
  const navigation = useNavigation<NavigationProp>();

  const route = useRoute<RouteProp<RootStackParamList, "Category">>();
  const commissionId = route.params?.commissionId;
  const commissionName = route.params?.commissionName || "Explore";

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      console.log("MOBILE: Fetching categories for commissionId:", commissionId);
      const data = await categoryService.getAll(commissionId);
      console.log("MOBILE: Received categories:", JSON.stringify(data, null, 2));
      setCategories(data);
    } catch (error) {
      console.error("MOBILE: Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }, [commissionId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      style={styles.categoryCard}
      onPress={() => navigation.navigate("SubCategory", { 
        categoryId: item.id, 
        categoryName: item.name,
        categoryNameTe: item.nameTe
      })}
    >
      <View style={styles.contentHeader}>
        <View style={styles.imageContainer}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          ) : (
            <Text style={styles.initial}>{item.name.charAt(0)}</Text>
          )}
        </View>
        <View style={styles.titleArea}>
           <Text style={styles.categoryName}>
            {language === 'en' ? item.name : item.nameTe}
          </Text>
          <PriceBadge accessType={item.accessType} priceInr={item.priceInr} />
        </View>
      </View>
      
      <Text style={styles.categoryDesc} numberOfLines={2}>
        {language === 'en' ? item.description : item.descriptionTe}
      </Text>
      
      <View style={styles.cardFooter}>
         <TouchableOpacity 
            style={styles.notesBtn} 
            onPress={() => navigation.navigate("StudyMaterial", { 
              entityType: "CATEGORY", 
              entityId: item.id, 
              entityName: language === 'en' ? item.name : item.nameTe 
            })}
          >
            <Text style={styles.notesText}>📚 {language === "en" ? "NOTES" : "నోట్స్"}</Text>
          </TouchableOpacity>

         <TouchableOpacity 
           activeOpacity={0.7}
           onPress={() => navigation.navigate("SubCategory", { 
            categoryId: item.id, 
            categoryName: item.name,
            categoryNameTe: item.nameTe
          })}
          style={styles.footerLinkContainer}
         >
           <Text style={styles.footerLink}>
             {language === 'en' ? "BROWSE SUBJECTS" : "విషయాలు చూడండి"}
           </Text>
           <View style={styles.arrowIcon}>
             <Text style={{color: colors.accent, fontWeight: 'bold'}}>→</Text>
           </View>
         </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#191919" />
      <ScreenHeader title={commissionName} showBack={true} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : categories.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No categories available yet.</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchCategories}
        />
      )}
    </SafeAreaView>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 10,
    color: colors.fgMuted,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "400",
    color: colors.fgPrimary,
    fontFamily: 'serif', // Simulation
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  logoutBtn: {
    marginLeft: spacing.xs,
  },
  logoutText: {
    color: colors.error,
    fontWeight: "600",
    fontSize: 13,
  },
  list: {
    padding: spacing.xl,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: radii.sm,
    backgroundColor: colors.inset,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  titleArea: {
    flex: 1,
    marginLeft: spacing.md,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: radii.sm - 1,
  },
  initial: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.accent,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.fgPrimary,
    marginBottom: 4,
  },
  categoryDesc: {
    fontSize: 14,
    color: colors.fgSecondary,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLink: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  arrowIcon: {
    opacity: 0.8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footerLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  notesBtn: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4, backgroundColor: colors.inset, borderWidth: 1, borderColor: colors.border },
  notesText: { color: colors.fgSecondary, fontSize: 9, fontWeight: "bold", letterSpacing: 1 },
  emptyText: {
    color: colors.fgMuted,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: typography.mono.fontFamily,
  },
});
