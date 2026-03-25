import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/tokens";

export const ProfessionalLogo = ({ size = 32 }: { size?: number }) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.logoBox,
          {
            width: size,
            height: size,
            borderRadius: size * 0.2,
          },
        ]}
      >
        <Text style={[styles.logoText, { fontSize: size * 0.4 }]}>G</Text>
      </View>
      <Text style={[styles.brandText, { fontSize: size * 0.6 }]}>
        Groups
        <Text style={styles.brandAccent}>Guru</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoBox: {
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  brandText: {
    color: colors.fgPrimary,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  brandAccent: {
    color: colors.accent,
  },
});
