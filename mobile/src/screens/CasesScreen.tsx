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

// Gleiche 5 Typen wie LogbuchNewClient im Web (WG wurde gestrichen).
const CONFLICT_TYPES: { type: string; title: string; description: string; icon: string; business?: boolean }[] = [
  {
    type: "trennung",
    title: "Trennung & Familie",
    description: "Partnerschaft, Trennung, Umgang.",
    icon: "💔",
  },
  {
    type: "erbschaft",
    title: "Erbschaft",
    description: "Erbengemeinschaft, Nachlass, Immobilie.",
    icon: "📜",
  },
  {
    type: "nachbarschaft",
    title: "Nachbarschaft",
    description: "Lärm, Grenze, Garten, Parken.",
    icon: "🏡",
  },
  {
    type: "verbraucher",
    title: "Verbraucher & Handwerker",
    description: "Mängel, Rechnungen, Leistungen.",
    icon: "🧾",
  },
  {
    type: "odr",
    title: "Geschäft & Arbeit",
    description: "Team, Gesellschafter, Kunden, B2B.",
    icon: "🏢",
    business: true,
  },
];

export default function CasesScreen({
  onOpen,
  onLoggedOut,
}: {
  onOpen: (id: number, title: string, mode: string, mediationType: string) => void;
  onLoggedOut: () => void;
}) {
  const [cases, setCases] = useState<CaseSummary[] | null>(null);
  // Laufende Mediationen: das Logbuch läuft dort als "Logbuch & Journal zum
  // Fall" weiter (wie im Web) – sonst verschwände es nach der Umwandlung.
  const [linkedCases, setLinkedCases] = useState<CaseSummary[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [creating, setCreating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const all = await api<CaseSummary[]>("/mediations/me");
      setCases(all.filter((c) => c.mode === "logbuch"));
      setLinkedCases(all.filter((c) => c.mode !== "logbuch"));
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

  const createLogbook = async (type: string, title: string, business?: boolean) => {
    setCreating(type);
    setError(null);
    const fullTitle = business ? `Falldokumentation – ${title}` : `Logbuch – ${title}`;
    try {
      const body = await api<{ mediation_id?: number; id?: number }>("/mediations", {
        method: "POST",
        body: { mediation_type: type, mode: "logbuch", title: fullTitle },
      });
      const id = body.mediation_id ?? body.id;
      if (id != null) {
        setShowNew(false);
        await load();
        onOpen(Number(id), fullTitle, "logbuch", type);
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
                  <Pressable key={t.type} onPress={() => createLogbook(t.type, t.title, t.business)}>
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
          <Pressable
            onPress={() =>
              onOpen(item.mediation_id, item.title ?? "Logbuch", item.mode, item.mediation_type)
            }
          >
            <Card>
              <Text style={styles.caseTitle}>{item.title ?? "Logbuch"}</Text>
              <Text style={styles.caseMeta}>
                {CONFLICT_TYPES.find((t) => t.type === item.mediation_type)?.title ??
                  item.mediation_type}
              </Text>
            </Card>
          </Pressable>
        )}
        ListFooterComponent={
          showNew || linkedCases.length === 0 ? null : (
            <View>
              <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>
                Logbuch & Journal zum Fall
              </Text>
              {linkedCases.map((c) => (
                <Pressable
                  key={c.mediation_id}
                  onPress={() =>
                    onOpen(c.mediation_id, c.title ?? "Fall", c.mode, c.mediation_type)
                  }
                >
                  <Card>
                    <Text style={styles.caseTitle}>{c.title ?? "Fall"}</Text>
                    <Text style={styles.caseMeta}>
                      Laufende Mediation – Ihr Logbuch läuft hier weiter. Geteilte Einträge sehen
                      alle Beteiligten.
                    </Text>
                  </Card>
                </Pressable>
              ))}
            </View>
          )
        }
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
