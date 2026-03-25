import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useLanguage } from "../context/LanguageContext";
import { colors, radii } from "../theme/tokens";

export const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <TouchableOpacity style={styles.button} onPress={toggleLanguage}>
      <Text
        style={[
          styles.text,
          { color: language === "en" ? colors.accent : colors.fgMuted },
        ]}
      >
        EN
      </Text>
      <View style={styles.divider} />
      <Text
        style={[
          styles.text,
          { color: language === "te" ? colors.accent : colors.fgMuted },
        ]}
      >
        తెలుగు
      </Text>
    </TouchableOpacity>
  );
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
