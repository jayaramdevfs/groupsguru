import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import { useAuth } from "../context/AuthContext";
import { ProfessionalLogo } from "./ProfessionalLogo";
import { colors, spacing, radii } from "../theme/tokens";

const studentLinks = [
  { name: "Dashboard", target: "StudentDashboard", icon: "🏠" },
  { name: "Categories", target: "Category", icon: "📚" },
  { name: "Study Materials", target: "StudyMaterial", params: { entityType: "GLOBAL", entityId: 0, entityName: "Global Archive" }, icon: "💎" },
  { name: "Test Series", target: "ExamList", icon: "📝" },
  { name: "Exams", target: "ExamList", icon: "📑" },
];

const adminSections = [
  {
    label: "CORE",
    links: [
      { name: "Dashboard", target: "AdminDashboard", icon: "🏠" },
      { name: "Exam Categories", target: "Category", icon: "🌳" },
      { name: "Knowledge Assets", target: "StudyMaterial", params: { entityType: "GLOBAL", entityId: 0, entityName: "Global" }, icon: "📚" },
    ],
  },
  {
    label: "ASSESSMENT",
    links: [
      { name: "Question Forge", target: "QuestionList", icon: "❓" },
      { name: "Active Exams", target: "ExamList", icon: "📝" },
      { name: "Intelligence", target: "Intelligence", icon: "⚛️" },
    ],
  },
  {
    label: "SYSTEM",
    links: [
      { name: "Access & Pricing", target: "Category", icon: "💰" },
      { name: "Engine Migration", target: "Category", icon: "🔄" },
    ],
  },
];

export const SidebarDrawer = (props: DrawerContentComponentProps) => {
  const { user, logout } = useAuth();
  const currentRoute = props.state.routes[props.state.index].name;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProfessionalLogo size={24} />
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
        {user?.role === "ADMIN" ? (
          adminSections.map((section) => (
            <View key={section.label} style={styles.navSection}>
              <Text style={styles.sectionLabel}>{section.label}</Text>
              {section.links.map((link) => {
                const isActive = currentRoute === link.target;
                return (
                  <TouchableOpacity
                    key={link.name}
                    style={[styles.link, isActive && styles.linkActive]}
                    onPress={() => props.navigation.navigate(link.target, link.params)}
                  >
                    <Text style={styles.linkIcon}>{link.icon}</Text>
                    <Text style={[styles.linkText, isActive && styles.linkTextActive]}>{link.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        ) : (
          <View style={styles.navSection}>
             <Text style={styles.sectionLabel}>CAPABILITIES</Text>
             {studentLinks.map((link) => {
               const isActive = currentRoute === link.target;
               return (
                 <TouchableOpacity
                   key={link.name}
                   style={[styles.link, isActive && styles.linkActive]}
                   onPress={() => props.navigation.navigate(link.target, link.params)}
                 >
                   <Text style={styles.linkIcon}>{link.icon}</Text>
                   <Text style={[styles.linkText, isActive && styles.linkTextActive]}>
                     {link.name}
                   </Text>
                 </TouchableOpacity>
               );
             })}
          </View>
        )}

        <View style={[styles.navSection, { marginTop: 40 }]}>
           <Text style={styles.sectionLabel}>ACCOUNT</Text>
           <View style={styles.userBox}>
              <Text style={styles.userName}>{user?.name || (user?.role === "ADMIN" ? "Administrator" : "Student")}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
           </View>
           <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Text style={styles.logoutText}>TERMINATE SESSION</Text>
           </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>GroupsGuru Mobile Mirror v2.6</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  header: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  scroll: {
    paddingTop: 10,
  },
  navSection: {
    paddingHorizontal: 16,
    gap: 4,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#666666",
    letterSpacing: 2,
    marginBottom: 8,
    marginLeft: 12,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 12,
  },
  linkActive: {
    backgroundColor: "#2D2D2D",
    borderLeftWidth: 2,
    borderLeftColor: "#D97706",
  },
  linkIcon: {
    fontSize: 18,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#A0A0A0",
  },
  linkTextActive: {
    color: "#E8E8E8",
  },
  userBox: {
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E8E8E8",
  },
  userEmail: {
    fontSize: 11,
    color: "#666666",
  },
  logoutBtn: {
    marginHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.error,
    letterSpacing: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#3A3A3A",
  },
  footerText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#444444",
    textAlign: "center",
  },
});
