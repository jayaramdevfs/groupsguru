import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path, Circle, Defs, RadialGradient, Stop, LinearGradient } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { colors } from "../theme/tokens";

interface Props {
  size?: number;
}

export const CinematicLogo = ({ size = 120 }: Props) => {
  const time = useSharedValue(0);

  useEffect(() => {
    // 5-second continuous continuous loop matching Web physics timeline
    time.value = withRepeat(
      withTiming(1, { duration: 5000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedMainStyle = useAnimatedStyle(() => {
    // Removed rotation to keep logo upright and stable
    const scale = 1.0 + Math.sin(time.value * Math.PI * 4) * 0.02;
    
    return {
      transform: [
        { scale: scale }
      ],
    };
  });

  const animatedGlowStyle = useAnimatedStyle(() => {
    // Pulsing intensity for the background ambient glow
    const pulse = Math.sin(time.value * Math.PI * 2);
    const opacity = 0.4 + 0.3 * pulse;
    const scale = 1.0 + 0.1 * pulse;

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  // Radar waves that continuously expand and fade out perfectly
  const Wave = ({ index, total }: { index: number; total: number }) => {
    const waveStyle = useAnimatedStyle(() => {
      // Offset each wave's timeline
      const phase = (time.value + index / total) % 1.0;
      // Exponentially slowing expansion (simulating drag)
      const scale = 1.0 - Math.exp(-2.5 * phase);
      
      // Fade in sharply, fade out smoothly
      let opacity = 1.0;
      if (phase < 0.1) opacity = phase / 0.1;
      else opacity = 1.0 - Math.pow((phase - 0.1) / 0.9, 2);

      return {
        opacity: opacity * 0.6,
        transform: [{ scale: scale * 2.5 }], // Expands up to 2.5x logo size
      };
    });

    return (
      <Animated.View style={[StyleSheet.absoluteFill, styles.centerAlign, waveStyle]}>
        <View style={{
          width: size * 0.8,
          height: size * 0.8,
          borderRadius: size,
          borderWidth: 1,
          borderColor: colors.accent,
        }} />
      </Animated.View>
    );
  };

  return (
    <View style={[{ width: size, height: size }, styles.container]}>
      {/* Background Ambient Glow */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.centerAlign, animatedGlowStyle]}>
        <Svg width={size * 1.5} height={size * 1.5} viewBox="0 0 100 100">
          <Defs>
            <RadialGradient id="ambientGlow" cx="50" cy="50" r="50">
              <Stop offset="0" stopColor={colors.accent} stopOpacity="0.4" />
              <Stop offset="1" stopColor={colors.accent} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="50" cy="50" r="50" fill="url(#ambientGlow)" />
        </Svg>
      </Animated.View>

      {/* Expand/Drag Physics Radar Waves */}
      <Wave index={0} total={3} />
      <Wave index={1} total={3} />
      <Wave index={2} total={3} />

      {/* Main Core Logo geometry matching SVG paths */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.centerAlign, animatedMainStyle]}>
        <Svg width={size * 0.8} height={size * 0.8} viewBox="0 0 40 40" fill="none">
          <Defs>
            <LinearGradient id="gradientBase" x1="0" y1="0" x2="40" y2="40">
              <Stop offset="0" stopColor="#FF7A00" stopOpacity="1" />
              <Stop offset="1" stopColor="#FFAA22" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="gradientSweep" x1="0" y1="20" x2="40" y2="20">
              <Stop offset="0" stopColor="#FF7A00" stopOpacity="1" />
              <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity="1" />
              <Stop offset="1" stopColor="#FF7A00" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          {/* Glow Layer */}
          <Path d="M32 20c0 6.627-5.373 12-12 12S8 26.627 8 20 13.373 8 20 8" stroke="url(#gradientBase)" strokeWidth="3.5" strokeLinecap="round" opacity="0.3" />
          <Path d="M28 20c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8" stroke="url(#gradientBase)" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
          
          {/* Main Bright Layer */}
          <Path d="M32 20c0 6.627-5.373 12-12 12S8 26.627 8 20 13.373 8 20 8" stroke="url(#gradientSweep)" strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M28 20c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8" stroke="url(#gradientBase)" strokeWidth="2" strokeLinecap="round" />
          <Path d="M24 20c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4" stroke="url(#gradientBase)" strokeWidth="1.5" strokeLinecap="round" />
          <Circle cx="20" cy="20" r="1.5" fill="url(#gradientBase)" />
          <Path d="M20 20 L32 20" stroke="url(#gradientBase)" strokeWidth="2" strokeLinecap="round" />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerAlign: {
    justifyContent: "center",
    alignItems: "center",
  },
});
