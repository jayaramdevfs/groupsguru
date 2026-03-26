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
import { studyMaterialService } from "../api/studyMaterialService";
import { StudyMaterial } from "../api/types";
import { useLanguage } from "../context/LanguageContext";
import { colors, spacing, radii, typography } from "../theme/tokens";
import { ScreenHeader } from "../components/ScreenHeader";

type RootStackParamList = {
  StudyMaterial: { entityType: string; entityId: number; entityName: string };
  StudyMaterialView: { material: StudyMaterial };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const StudyMaterialScreen = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { language } = useLanguage();
  const navigation = useNavigation<NavigationProp>();

  const route = useRoute<RouteProp<RootStackParamList, "StudyMaterial">>();
  const { entityType, entityId, entityName } = route.params;

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    try {
      let data: StudyMaterial[];
      if (entityType === "GLOBAL") {
        data = await studyMaterialService.getAll();
      } else {
        data = await studyMaterialService.getByEntity(entityType, entityId);
      }
      setMaterials(data || []);
    } catch (error) {
      console.error("Failed to fetch study materials", error);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const filteredMaterials = (materials || []).filter(m => {
    const query = search.toLowerCase();
    const title = (language === 'en' ? m.title : (m.titleTe || m.title)).toLowerCase();
    const subject = (m.subject || "").toLowerCase();
    return title.includes(query) || subject.includes(query);
  });

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
          <View style={styles.breadcrumbCard}>
             <Text style={styles.breadcrumbText}>{item.subject?.toUpperCase() || "GENERAL"}</Text>
          </View>
          <Text style={styles.cardTitle}>
            {language === 'en' ? item.title : (item.titleTe || item.title)}
          </Text>
        </View>
      </View>
      
      {item.description && (
        <Text style={styles.cardDesc} numberOfLines={2}>
            {language === 'en' ? item.description : (item.descriptionTe || item.description)}
        </Text>
      )}
      
      <View style={styles.cardFooter}>
        <View style={styles.fileMetadata}>
           <Text style={styles.fileInfo}>
             {item.fileType} • {(item.fileSize / 1024).toFixed(1)} KB
           </Text>
        </View>
        <Text style={styles.readLink}>
          {language === 'en' ? "RETRIEVE NODE →" : "నోడ్ చూడండి →"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#191919" />
      <ScreenHeader 
        title={entityType === "GLOBAL" ? (language === 'en' ? "Knowledge Vault" : "నాలెడ్జ్ వాల్ట్") : entityName} 
        showBack={true} 
      />

      <View style={styles.searchBar}>
         <View style={styles.searchContainer}>
           <TextInput 
             style={styles.searchInput}
             placeholder={language === "en" ? "Filter by node title..." : "నోడ్ టైటిల్ ద్వారా ఫిల్టర్ చేయండి..."}
             placeholderTextColor="#666"
             value={search}
             onChangeText={setSearch}
           />
         </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color="#D97706" />
        </View>
      ) : filteredMaterials.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No knowledge nodes detected at this frequency.</Text>
          <TouchableOpacity onPress={fetchMaterials} style={styles.retryBtn}>
             <Text style={styles.retryBtnText}>RETRY SYNC</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredMaterials}
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
    color: "#666",
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: spacing.xl,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#D9770633",
    borderRadius: 8,
    backgroundColor: "#D9770611",
  },
  retryBtnText: {
    color: "#D97706",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
  },
  backBtn: { padding: spacing.xs, marginRight: spacing.sm },
  backIcon: { color: colors.fgPrimary, fontSize: 24, fontWeight: "300" },
  headerText: { flex: 1 },
  searchBar: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md, backgroundColor: "#111" },
  searchContainer: {
    height: 48,
    backgroundColor: "#191919",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A28",
    paddingHorizontal: spacing.md,
    justifyContent: "center",
  },
  searchInput: { fontSize: 13, color: "#E8E8E8" },
  breadcrumbCard: { backgroundColor: "#D9770622", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 4 },
  breadcrumbText: { fontSize: 8, fontWeight: 'bold', color: "#D97706", letterSpacing: 0.5 },
  fileMetadata: { backgroundColor: "#191919", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: "#2A2A28" },
});
