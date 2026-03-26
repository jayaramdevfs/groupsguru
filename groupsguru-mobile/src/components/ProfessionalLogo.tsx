import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, Circle, Line } from "react-native-svg";
import { colors } from "../theme/tokens";

export const ProfessionalLogo = ({ 
  size = 32, 
  showWordmark = true 
}: { 
  size?: number; 
  showWordmark?: boolean;
}) => {
  const iconSize = size;
  const wordmarkFontSize = size * 0.7;

  return (
    <View style={styles.container}>
      <Svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
      >
        {/* Outer arc */}
        <Path
          d="M32 20c0 6.627-5.373 12-12 12S8 26.627 8 20 13.373 8 20 8"
          stroke={colors.accent}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Middle arc */}
        <Path
          d="M28 20c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8"
          stroke={colors.accent}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Inner arc */}
        <Path
          d="M24 20c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4"
          stroke={colors.accent}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Center dot */}
        <Circle cx="20" cy="20" r="1.5" fill={colors.accent} />
        {/* Horizontal bar of G */}
        <Line
          x1="20"
          y1="20"
          x2="32"
          y2="20"
          stroke={colors.accent}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
      {showWordmark && (
        <Text style={[styles.brandText, { fontSize: wordmarkFontSize }]}>
          Groups
          <Text style={styles.brandAccent}>Guru</Text>
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
