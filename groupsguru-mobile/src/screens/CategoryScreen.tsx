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
import { LanguageToggle } from "../components/LanguageToggle";
import { PriceBadge } from "../components/PriceBadge";

type RootStackParamList = {
  Category: { commissionId?: number; commissionName?: string };
  SubCategory: { categoryId: number; categoryName: string; categoryNameTe: string };
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
      const data = await categoryService.getAll(commissionId);
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [commissionId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      activeOpacity={0.8}
      style={styles.categoryCard}
      onPress={() => navigation.navigate("SubCategory", { 
        categoryId: item.id, 
        categoryName: item.name,
        categoryNameTe: item.nameTe
      })}
    >
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <Text style={styles.initial}>{item.name.charAt(0)}</Text>
        )}
      </View>
      <View style={styles.content}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
          <Text style={styles.categoryName}>
            {language === 'en' ? item.name : item.nameTe}
          </Text>
          <PriceBadge accessType={item.accessType} priceInr={item.priceInr} />
        </View>
        <Text style={styles.categoryDesc} numberOfLines={2}>
          {language === 'en' ? item.description : item.descriptionTe}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {language === 'en' ? "Browse Subjects" : "విషయాలు చూడండి"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {language === 'en' ? "What's next?" : "తదుపరి ఎమిటి?"}
          </Text>
          <Text style={styles.title}>
            {language === 'en' ? commissionName : commissionName}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <LanguageToggle />
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#9333EA" />
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
    backgroundColor: "#0f051d",
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutBtn: {
    padding: 8,
  },
  logoutText: {
    color: "#EC4899",
    fontWeight: "700",
    fontSize: 14,
  },
  list: {
    padding: 24,
    paddingTop: 10,
  },
  categoryCard: {
    backgroundColor: "rgba(147, 51, 234, 0.08)",
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.2)",
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#2e1065",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.4)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  initial: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  categoryDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    lineHeight: 20,
  },
  badge: {
    marginTop: 10,
    backgroundColor: "rgba(147, 51, 234, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#a855f7",
    fontSize: 12,
    fontWeight: "700",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 16,
    fontWeight: "600",
  },
});
