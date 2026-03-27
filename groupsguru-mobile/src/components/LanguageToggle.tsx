import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useLanguage } from "../context/LanguageContext";
import { colors, radii } from "../theme/tokens";

export const LanguageToggle: React.FC = () => {
  // Multi-language support disabled per user request
  return null;
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
  },
  text: {
    fontWeight: "600",
    fontSize: 11,
  },
});
