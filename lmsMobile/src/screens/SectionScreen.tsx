import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useLanguage } from "../context/LanguageContext";

type RootStackParamList = {
    Section: { subCategoryId: number; subCategoryName: string; subCategoryNameTe: string };
};

type SectionScreenRouteProp = RouteProp<RootStackParamList, 'Section'>;

const SectionScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<SectionScreenRouteProp>();
    const { subCategoryId, subCategoryName, subCategoryNameTe } = route.params;
    const { language } = useLanguage();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.subtitle}>
                        {language === 'en' ? subCategoryName : subCategoryNameTe}
                    </Text>
                    <Text style={styles.title}>
                        {language === 'en' ? "Sections" : "భాగాలు"}
                    </Text>
                </View>
            </View>
            <View style={styles.content}>
                <Text style={styles.info}>
                    Section data coming in Sprint 4.
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default SectionScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0f051d" },
    header: { padding: 24, flexDirection: "row", alignItems: "center" },
    backBtn: { padding: 10, marginLeft: -10 },
    backText: { color: "#FFFFFF", fontSize: 24, fontWeight: "bold" },
    titleContainer: { marginLeft: 10 },
    subtitle: { fontSize: 14, color: "rgba(255,255,255,0.6)", fontWeight: "600" },
    title: { fontSize: 24, fontWeight: "800", color: "#FFFFFF", marginTop: 2 },
    content: { flex: 1, justifyContent: "center", alignItems: "center" },
    info: { color: "rgba(255,255,255,0.4)", fontSize: 16 },
});
