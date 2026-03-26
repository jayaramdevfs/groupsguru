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
import { topicService } from "../api/topicService";
import { Topic } from "../api/types";
import { useLanguage } from "../context/LanguageContext";
import { LanguageToggle } from "../components/LanguageToggle";
import { PriceBadge } from "../components/PriceBadge";
import { accessService } from "../api/accessService";
import { AccessCheckResponse } from "../api/accessTypes";
import { PaywallModal } from "../components/PaywallModal";
import { colors, spacing, radii, typography } from "../theme/tokens";

type RootStackParamList = {
  Category: undefined;
  SubCategory: { categoryId: number; categoryName: string; categoryNameTe: string };
  Section: { subCategoryId: number; subCategoryName: string; subCategoryNameTe: string };
  Topic: { sectionId: number; sectionName: string; sectionNameTe: string };
  MicroTopic: { topicId: number; topicName: string; topicNameTe: string };
  StudyMaterial: { entityType: string; entityId: number; entityName: string };
};

type TopicScreenRouteProp = RouteProp<RootStackParamList, 'Topic'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TopicScreen = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [accessData, setAccessData] = useState<AccessCheckResponse | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const { language } = useLanguage();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<TopicScreenRouteProp>();
  const { sectionId, sectionName, sectionNameTe } = route.params;

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await topicService.getBySectionId(sectionId);
      setTopics(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const handleTopicPress = async (item: Topic) => {
    setLoading(true);
    try {
      const access = await accessService.checkAccess("TOPIC", item.id);
      if (access.hasAccess) {
        navigation.navigate("MicroTopic", {
          topicId: item.id,
          topicName: item.name,
          topicNameTe: item.nameTe,
        });
      } else {
        setSelectedTopic(item);
        setAccessData(access);
        setPaywallVisible(true);
      }
    } catch (error) {
      Alert.alert("Error", "Could not verify access.");
    } finally {
      setLoading(false);
    }
  };

  const renderTopic = ({ item }: { item: Topic }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.card}
      onPress={() => handleTopicPress(item)}
    >
      <View style={styles.contentHeader}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>{item.topicCode || 'T'}</Text>
        </View>
        <View style={styles.titleArea}>
           <Text style={styles.name}>
            {language === 'en' ? item.name : item.nameTe}
          </Text>
          <PriceBadge accessType={item.accessType} priceInr={item.priceInr} />
        </View>
      </View>
      
      <Text style={styles.desc} numberOfLines={3}>
        {language === 'en' ? item.description : item.descriptionTe}
      </Text>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.notesBtn} 
          onPress={() => navigation.navigate("StudyMaterial", { 
            entityType: "TOPIC", 
            entityId: item.id, 
            entityName: language === 'en' ? item.name : item.nameTe 
          })}
        >
          <Text style={styles.notesText}>📚 {language === "en" ? "NOTES" : "నోట్స్"}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.badge} onPress={() => handleTopicPress(item)}>
          <Text style={styles.badgeText}>
            {language === "en" ? "EXPLORE →" : "చూడండి →"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
            {language === 'en' ? sectionName : sectionNameTe}
          </Text>
          <Text style={styles.title}>
            {language === 'en' ? "Topics" : "టాపిక్‌లు"}
          </Text>
        </View>
        <LanguageToggle />
      </View>

      {loading && topics.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      ) : topics.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No topics found for this section.</Text>
        </View>
      ) : (
        <FlatList
          data={topics}
          renderItem={renderTopic}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchTopics}
        />
      )}
      <PaywallModal
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
        price={accessData?.price ?? null}
        entityType="TOPIC"
        entityId={selectedTopic?.id ?? 0}
        entityName={language === 'en' ? (selectedTopic?.name ?? '') : (selectedTopic?.nameTe ?? '')}
        parentOptions={accessData?.parentOptions}
        onSuccess={() => {
          if (selectedTopic) {
            navigation.navigate("MicroTopic", {
              topicId: selectedTopic.id,
              topicName: selectedTopic.name,
              topicNameTe: selectedTopic.nameTe,
            });
          }
        }}
      />
    </SafeAreaView>
  );
};

export default TopicScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  header: { paddingHorizontal: spacing.xl, paddingVertical: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", alignItems: "center" },
  backBtn: { padding: spacing.xs, marginRight: spacing.sm },
  backIcon: { color: colors.fgPrimary, fontSize: 24, fontWeight: "300" },
  headerTitleContainer: { flex: 1 },
  label: { fontSize: 10, color: colors.fgMuted, fontWeight: "bold", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 2 },
  title: { fontSize: 22, fontWeight: "400", color: colors.fgPrimary, fontFamily: 'serif' },
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
