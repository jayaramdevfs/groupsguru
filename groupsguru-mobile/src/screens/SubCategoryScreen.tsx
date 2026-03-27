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
import { categoryService } from "../api/categoryService";
import { paymentService } from "../api/paymentService";
import { SubCategory, Category } from "../api/types";
import RazorpayCheckout from "react-native-razorpay";
import { useLanguage } from "../context/LanguageContext";
import { LanguageToggle } from "../components/LanguageToggle";
import { PriceBadge } from "../components/PriceBadge";
import { ScreenHeader } from "../components/ScreenHeader";
import { colors, spacing, radii, typography } from "../theme/tokens";
import { ScrollView, Alert } from "react-native";

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
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("PRELIMS");
  const { language } = useLanguage();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SubCategoryScreenRouteProp>();
  const { categoryId, categoryName, categoryNameTe } = route.params;

  const fetchSubCategories = useCallback(async () => {
    setLoading(true);
    try {
      const [subs, cat] = await Promise.all([
        subCategoryService.getByCategoryId(categoryId),
        categoryService.getById(categoryId)
      ]);
      setSubCategories(subs);
      setCategory(cat);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchSubCategories();
  }, [fetchSubCategories]);

  const handlePackagePayment = async (type: string, id: number, name: string, amount: number, packageType?: string) => {
    setIsProcessing(true);
    try {
      const orderId = await paymentService.createOrder(type, id, packageType);

      const options = {
        description: `Purchase access to ${name} (${packageType})`,
        image: '',
        currency: 'INR',
        key: 'rzp_test_SU3wy02Xv8CfbL',
        amount: (amount * 100).toString(),
        name: 'GroupsGuru',
        order_id: orderId,
        prefill: {
          email: '',
          contact: '',
          name: '',
        },
        theme: { color: colors.accent },
      };

      const response = await RazorpayCheckout.open(options);

      await paymentService.verifyPayment(
        response.razorpay_order_id,
        response.razorpay_payment_id,
        response.razorpay_signature,
      );

      Alert.alert('Success', 'Payment successful! Content unlocked.');
      fetchSubCategories();
    } catch (error: any) {
      if (error?.code !== 'PAYMENT_CANCELLED') {
        Alert.alert('Error', 'Payment failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredSubs = subCategories.filter(s => 
    !s.phase || s.phase === activeTab || s.phase === "BOTH"
  );

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

      {/* Package Selection */}
      {!loading && category && (category.priceInr || category.prelimsPriceInr || category.mainsPriceInr) && (
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.label, { marginHorizontal: 20, marginBottom: 10 }]}>SUBSCRIPTION PLANS</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {category.prelimsPriceInr && (
              <TouchableOpacity 
                style={styles.pkgCard}
                onPress={() => handlePackagePayment("CATEGORY", categoryId, category.name, category.prelimsPriceInr!, "PRELIMS")}
                disabled={isProcessing}
              >
                <Text style={styles.pkgLabel}>Standard</Text>
                <Text style={styles.pkgName}>Prelims Only</Text>
                <Text style={styles.pkgPrice}>₹{category.prelimsPriceInr}</Text>
                <Text style={styles.pkgAction}>SELECT</Text>
              </TouchableOpacity>
            )}
            
            {category.mainsPriceInr && (
              <TouchableOpacity 
                style={styles.pkgCard}
                onPress={() => handlePackagePayment("CATEGORY", categoryId, category.name, category.mainsPriceInr!, "MAINS")}
                disabled={isProcessing}
              >
                <Text style={styles.pkgLabel}>Advanced</Text>
                <Text style={styles.pkgName}>Mains Only</Text>
                <Text style={styles.pkgPrice}>₹{category.mainsPriceInr}</Text>
                <Text style={styles.pkgAction}>SELECT</Text>
              </TouchableOpacity>
            )}

            {category.priceInr && (
              <TouchableOpacity 
                style={[styles.pkgCard, { borderColor: colors.accent, borderWidth: 2 }]}
                onPress={() => handlePackagePayment("CATEGORY", categoryId, category.name, category.priceInr!, "COMPLETE")}
                disabled={isProcessing}
              >
                <View style={styles.recommendTag}>
                  <Text style={styles.recommendText}>BEST</Text>
                </View>
                <Text style={styles.pkgLabel}>Full Access</Text>
                <Text style={styles.pkgName}>Complete</Text>
                <Text style={styles.pkgPrice}>₹{category.priceInr}</Text>
                <Text style={[styles.pkgAction, { color: colors.accent }]}>BUY NOW</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}

      {/* Phase Tabs */}
      {!loading && subCategories.length > 0 && (
        <View style={styles.tabContainer}>
          {["PRELIMS", "MAINS"].map(tab => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : filteredSubs.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No subjects available for this phase.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSubs}
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
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabButton: {
    borderBottomColor: colors.accent,
  },
  tabText: {
    color: colors.fgMuted,
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 2,
    fontFamily: typography.mono.fontFamily,
  },
  activeTabText: {
    color: colors.accent,
  },
  label: {
    fontSize: 10,
    color: colors.fgMuted,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  pkgCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    marginRight: spacing.md,
    width: 140,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
    overflow: 'hidden',
  },
  pkgLabel: {
    fontSize: 8,
    color: colors.fgMuted,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  pkgName: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.fgPrimary,
    marginBottom: 8,
  },
  pkgPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.accent,
    fontFamily: typography.mono.fontFamily,
    marginBottom: 12,
  },
  pkgAction: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.fgSecondary,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  recommendTag: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderBottomLeftRadius: 4,
  },
  recommendText: {
    color: '#fff',
    fontSize: 7,
    fontWeight: 'bold',
  },
});
