import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { ProfessionalLogo } from "../components/ProfessionalLogo";
import { LanguageToggle } from "../components/LanguageToggle";
import { colors, radii, spacing } from "../theme/tokens";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const { login } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ProfessionalLogo size={28} />
        <LanguageToggle />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in to your GroupsGuru account
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={colors.fgMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={[styles.label, { marginTop: spacing.lg }]}>
            Password
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter password"
              placeholderTextColor={colors.fgMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.visibilityToggle} 
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.visibilityText}>
                {showPassword ? "HIDE" : "SHOW"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {loading ? "Signing in..." : "Sign in"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton} 
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.linkText}>
              Don't have an account? <Text style={{ color: colors.accent }}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>GroupsGuru Exam Intelligence Engine</Text>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing["5xl"],
    paddingBottom: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: spacing["3xl"],
  },
  title: {
    fontSize: 28,
    fontWeight: "400",
    color: colors.fgPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.fgMuted,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing["2xl"],
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.fgSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    width: "100%",
    backgroundColor: colors.inset,
    color: colors.fgPrimary,
    fontSize: 15,
    fontWeight: "500",
    padding: spacing.lg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inset,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  passwordInput: {
    flex: 1,
    color: colors.fgPrimary,
    fontSize: 15,
    fontWeight: "500",
    padding: spacing.lg,
  },
  visibilityToggle: {
    paddingHorizontal: spacing.lg,
  },
  visibilityText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.accent,
    letterSpacing: 1,
  },
  button: {
    backgroundColor: colors.accent,
    width: "100%",
    paddingVertical: 14,
    borderRadius: radii.md,
    marginTop: spacing["2xl"],
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  footer: {
    textAlign: "center",
    color: colors.fgMuted,
    fontSize: 11,
    fontWeight: "500",
    marginTop: spacing["2xl"],
  },
  linkButton: {
    marginTop: spacing.xl,
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    color: colors.fgSecondary,
    fontWeight: "500",
  },
});
