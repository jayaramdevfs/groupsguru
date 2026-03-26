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
import { studyMaterialService } from "../api/studyMaterialService";
import { StudyMaterial } from "../api/types";
import { useLanguage } from "../context/LanguageContext";
import { colors, spacing, radii, typography } from "../theme/tokens";
import { PriceBadge } from "../components/PriceBadge";

type RootStackParamList = {
  StudyMaterial: { entityType: string; entityId: number; entityName: string };
  StudyMaterialView: { material: StudyMaterial };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const StudyMaterialScreen = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const navigation = useNavigation<NavigationProp>();

  const route = useRoute<RouteProp<RootStackParamList, "StudyMaterial">>();
  const { entityType, entityId, entityName } = route.params;

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const data = await studyMaterialService.getByEntity(entityType, entityId);
      setMaterials(data);
    } catch (error) {
      console.error("Failed to fetch study materials", error);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const renderMaterial = ({ item }: { item: StudyMaterial }) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      style={styles.card}
      onPress={() => navigation.navigate("StudyMaterialView", { material: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{item.fileType === 'MD' ? '📄' : '📚'}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.cardTitle}>
            {language === 'en' ? item.title : item.titleTe}
          </Text>
          <PriceBadge accessType={item.accessType} priceInr={item.priceInr} />
        </View>
      </View>
      
      <Text style={styles.cardDesc} numberOfLines={2}>
        {language === 'en' ? item.description : item.descriptionTe}
      </Text>
      
      <View style={styles.cardFooter}>
        <Text style={styles.fileInfo}>
          {item.fileType} • {(item.fileSize / 1024).toFixed(1)} KB
        </Text>
        <Text style={styles.readLink}>
          {language === 'en' ? "READ NOW →" : "ఇప్పుడే చదవండి →"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>
            {language === 'en' ? "STUDY MATERIALS" : "అధ్యయన సామగ్రి"}
          </Text>
          <Text style={styles.title}>{entityName}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : materials.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No materials available for this section.</Text>
        </View>
      ) : (
        <FlatList
          data={materials}
          renderItem={renderMaterial}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchMaterials}
        />
      )}
    </SafeAreaView>
  );
};

export default StudyMaterialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.fgFaint,
  },
  label: {
    fontSize: 10,
    color: colors.fgMuted,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "400",
    color: colors.fgPrimary,
  },
  list: {
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.fgFaint,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.inset,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.fgFaint,
  },
  icon: {
    fontSize: 20,
  },
  titleContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.fgPrimary,
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.fgSecondary,
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.fgFaint,
    paddingTop: spacing.md,
  },
  fileInfo: {
    fontSize: 11,
    color: colors.fgMuted,
    fontWeight: "600",
  },
  readLink: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: colors.fgMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
