// Übersicht aller Logbücher des Nutzers + Anlegen eines neuen Logbuchs.
// Spiegel von app/dashboard/logbuch/new/LogbuchNewClient.tsx (Web).
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ApiError, api, logout } from "../api";
import { colors, radius, spacing } from "../theme";
import { CaseSummary } from "../types";
import { Badge, Button, Card, ErrorText } from "../ui";

const CONFLICT_TYPES: { type: string; title: string; description: string; icon: string }[] = [
  {
    type: "trennung",
    title: "Trennung & Familie",
    description: "Trennung, Scheidung, Umgang, Familienkonflikte.",
    icon: "💔",
  },
  {
    type: "nachbarschaft",
    title: "Nachbarschaft",
    description: "Lärm, Grenzen, Miteinander im Haus oder am Zaun.",
    icon: "🏡",
  },
  {
    type: "wg",
    title: "WG & Zusammenleben",
    description: "Mitbewohner, Putzplan, Finanzen, Auszug.",
    icon: "🛋️",
  },
  {
    type: "verbraucher",
    title: "Verbraucher",
    description: "Ärger mit Händlern, Werkstätten, Dienstleistern.",
    icon: "🛒",
  },
  {
    type: "erbschaft",
    title: "Erbschaft",
    description: "Streit in der Erbengemeinschaft, Nachlass, Immobilie.",
    icon: "📜",
  },
  {
    type: "odr",
    title: "Geschäft & Arbeit",
    description: "Team, Gesellschafter, Kunden, Lieferanten (B2B).",
    icon: "🏢",
  },
];

export default function CasesScreen({
  onOpen,
  onLoggedOut,
}: {
  onOpen: (id: number, title: string) => void;
  onLoggedOut: () => void;
}) {
  const [cases, setCases] = useState<CaseSummary[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [creating, setCreating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const all = await api<CaseSummary[]>("/mediations/me");
      setCases(all.filter((c) => c.mode === "logbuch"));
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        onLoggedOut();
        return;
      }
      setError(e instanceof ApiError ? e.message : "Server nicht erreichbar.");
      setCases((prev) => prev ?? []);
    }
  }, [onLoggedOut]);

  useEffect(() => {
    void load();
  }, [load]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const createLogbook = async (type: string, title: string) => {
    setCreating(type);
    setError(null);
    try {
      const body = await api<{ mediation_id?: number; id?: number }>("/mediations", {
        method: "POST",
        body: { mediation_type: type, mode: "logbuch", title: `Logbuch – ${title}` },
      });
      const id = body.mediation_id ?? body.id;
      if (id != null) {
        setShowNew(false);
        await load();
        onOpen(Number(id), `Logbuch – ${title}`);
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Logbuch konnte nicht angelegt werden.");
    } finally {
      setCreating(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    onLoggedOut();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          medi<Text style={{ color: colors.accent }}>pact</Text>
        </Text>
        <Pressable onPress={handleLogout} hitSlop={12}>
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>Abmelden</Text>
        </Pressable>
      </View>

      <FlatList
        data={showNew ? [] : cases ?? []}
        keyExtractor={(c) => String(c.mediation_id)}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        ListHeaderComponent={
          <View>
            <Badge label="Kostenlos" />
            <Text style={styles.title}>Ihre Konflikt-Logbücher</Text>
            <ErrorText message={error} />
            {showNew && (
              <View>
                <Text style={styles.sectionLabel}>Worum geht es?</Text>
                {CONFLICT_TYPES.map((t) => (
                  <Pressable key={t.type} onPress={() => createLogbook(t.type, t.title)}>
                    <Card style={creating === t.type ? { opacity: 0.5 } : undefined}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ fontSize: 28, marginRight: spacing.md }}>{t.icon}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.caseTitle}>{t.title}</Text>
                          <Text style={styles.caseMeta}>{t.description}</Text>
                        </View>
                      </View>
                    </Card>
                  </Pressable>
                ))}
                <Button title="Abbrechen" variant="ghost" onPress={() => setShowNew(false)} />
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          showNew || cases == null ? null : (
            <Card>
              <Text style={styles.caseTitle}>Noch kein Logbuch</Text>
              <Text style={styles.caseMeta}>
                Legen Sie ein Konflikt-Logbuch an und halten Sie fest, was passiert: Vorkommnisse,
                Gespräche, E-Mails, WhatsApp-Nachrichten, Telefonate und Ihre Gedanken.
              </Text>
            </Card>
          )
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => onOpen(item.mediation_id, item.title ?? "Logbuch")}>
            <Card>
              <Text style={styles.caseTitle}>{item.title ?? "Logbuch"}</Text>
              <Text style={styles.caseMeta}>
                {CONFLICT_TYPES.find((t) => t.type === item.mediation_type)?.title ??
                  item.mediation_type}
              </Text>
            </Card>
          </Pressable>
        )}
      />

      {!showNew && (
        <View style={styles.fabWrap}>
          <Button title="+ Neues Logbuch" onPress={() => setShowNew(true)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: { fontSize: 20, fontWeight: "800", color: colors.text },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: colors.textSoft,
    marginBottom: spacing.md,
  },
  caseTitle: { fontSize: 16, fontWeight: "600", color: colors.text },
  caseMeta: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  fabWrap: {
    position: "absolute",
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    borderRadius: radius.md,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
