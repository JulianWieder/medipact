import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ApiError, login } from "../api";
import { colors, radius, spacing } from "../theme";
import { Button, ErrorText } from "../ui";

export default function LoginScreen({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Bitte E-Mail und Passwort eingeben.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      onLoggedIn();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Server nicht erreichbar.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>
          medi<Text style={{ color: colors.accent }}>pact</Text>
        </Text>
        <Text style={styles.title}>Konflikt-Logbuch</Text>
        <Text style={styles.subtitle}>
          Dokumentieren Sie Ihren Konflikt – vertraulich, kostenlos, jederzeit griffbereit.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>E-Mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="ihre@email.de"
            placeholderTextColor={colors.textSoft}
          />
          <Text style={styles.label}>Passwort</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            placeholder="••••••••"
            placeholderTextColor={colors.textSoft}
            onSubmitEditing={handleLogin}
          />
          <ErrorText message={error} />
          <Button title="Anmelden" onPress={handleLogin} loading={busy} style={{ marginTop: spacing.md }} />
          <Text style={styles.hint}>
            Noch kein Konto? Registrieren Sie sich auf medipact.de – danach können Sie sich hier
            anmelden.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: spacing.xl },
  logo: { fontSize: 32, fontWeight: "800", color: colors.text, textAlign: "center" },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSoft,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  form: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
  },
  label: { fontSize: 13, fontWeight: "600", color: colors.textMuted, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.md,
    backgroundColor: colors.bg,
  },
  hint: { fontSize: 12, color: colors.textSoft, marginTop: spacing.lg, textAlign: "center" },
});
