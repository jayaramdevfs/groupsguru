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
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { ProfessionalLogo } from "../components/ProfessionalLogo";
import { CinematicLogo } from "../components/CinematicLogo";
import { LanguageToggle } from "../components/LanguageToggle";
import { colors, radii, spacing, typography } from "../theme/tokens";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { User, Mail, Lock } from "lucide-react-native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RegisterScreen = () => {
  const { register } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);
      Alert.alert("Success", "Account created successfully. Please login.");
      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ProfessionalLogo size={28} />
        <LanguageToggle />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.titleSection}>
            <View style={{ marginBottom: 16 }}>
              <CinematicLogo size={100} />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join GroupsGuru for exam excellence
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <User size={18} color={colors.accent} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor={colors.fgMuted}
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={[styles.label, { marginTop: spacing.lg }]}>
              Email Address
            </Text>
            <View style={styles.inputContainer}>
              <Mail size={18} color={colors.accent} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={colors.fgMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <Text style={[styles.label, { marginTop: spacing.lg }]}>
              Create Password
            </Text>
            <View style={styles.passwordContainer}>
              <Lock size={18} color={colors.accent} style={styles.inputIcon} />
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter password"
                placeholderTextColor={colors.fgMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.visibilityToggle}>
                <Text style={styles.visibilityText}>{showPassword ? "HIDE" : "SHOW"}</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { marginTop: spacing.lg }]}>
              Confirm Password
            </Text>
            <View style={styles.passwordContainer}>
              <Lock size={18} color={colors.accent} style={styles.inputIcon} />
              <TextInput
                style={styles.passwordInput}
                placeholder="Re-enter password"
                placeholderTextColor={colors.fgMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {loading ? "Creating account..." : "Register Now"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.linkButton} 
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.linkText}>
                Already have an account? <Text style={{ color: colors.accent }}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>GroupsGuru Exam Intelligence Engine</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;

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
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["4xl"],
    justifyContent: "center",
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
    fontFamily: 'serif'
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inset,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    color: colors.fgPrimary,
    fontSize: 15,
    fontWeight: "500",
    padding: spacing.lg,
  },
  inputIcon: {
    marginLeft: spacing.lg,
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
  linkButton: {
    marginTop: spacing.xl,
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    color: colors.fgSecondary,
    fontWeight: "500",
  },
  footer: {
    textAlign: "center",
    color: colors.fgMuted,
    fontSize: 11,
    fontWeight: "500",
    marginTop: spacing["3xl"],
  },
});
