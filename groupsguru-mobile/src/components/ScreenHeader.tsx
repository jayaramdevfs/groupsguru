import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { LanguageToggle } from "./LanguageToggle";
import { colors, spacing, radii } from "../theme/tokens";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export const ScreenHeader = ({ title, subtitle, showBack = true }: ScreenHeaderProps) => {
  const navigation = useNavigation<any>();
  const { logout } = useAuth();
  const { language } = useLanguage();

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {showBack && navigation.canGoBack() ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.menuBtn}>
            <Text style={{ color: "#A0A0A0", fontSize: 20 }}>←</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.menuBtn}
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          >
            <View style={styles.menuIcon}>
               <View style={styles.menuLine} />
               <View style={[styles.menuLine, { width: 14 }]} />
               <View style={styles.menuLine} />
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
           {subtitle && (
             <Text style={styles.subtitle}>{subtitle}</Text>
           )}
           <View style={styles.row}>
             {subtitle && <Text style={styles.separator}>/</Text>}
             <Text style={styles.title}>{title}</Text>
           </View>
        </View>
      </View>

      <View style={styles.right}>
        <LanguageToggle />
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>{language === 'en' ? 'LOGOUT' : 'లాగ్అవుట్'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 48,
    backgroundColor: "#191919",
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    width: 18,
    height: 12,
    justifyContent: "space-between",
  },
  menuLine: {
    height: 2,
    backgroundColor: "#666666",
    width: "100%",
  },
  titleContainer: {
    justifyContent: "center",
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subtitle: {
    fontSize: 8,
    fontWeight: "700",
    color: "#666666",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: -2,
  },
  separator: {
     fontSize: 10,
     color: "#444444",
     marginRight: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: "500",
    color: "#A0A0A0",
    textTransform: "capitalize",
    fontFamily: 'serif',
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoutBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 6,
  },
  logoutText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#A0A0A0",
  },
});
