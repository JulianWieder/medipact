// Ein einzelnes Konflikt-Logbuch: Chronologie, neuer Eintrag, KI-Analyse.
// Mobile Spiegel von app/dashboard/logbuch/[id]/LogbuchClient.tsx.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ApiError, api, authHeaders, fileUrl } from "../api";
import {
  entryTypeLabel,
  formatDate,
  isUploadValue,
  labelsFor,
  looksLikeImage,
} from "../logbuch";
import { colors, radius, spacing } from "../theme";
import {
  AnalyzeResponse,
  Block,
  LogEntry,
  LogbuchStatus,
  PhaseStepsResponse,
  UploadValue,
} from "../types";
import { Badge, Button, Card, ErrorText } from "../ui";
import EntryComposer from "./EntryComposer";

type Props = { mediationId: number; title: string; onBack: () => void };

export default function LogbookScreen({ mediationId, title, onBack }: Props) {
  const [entries, setEntries] = useState<LogEntry[] | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [status, setStatus] = useState<LogbuchStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [composing, setComposing] = useState(false);
  const [editing, setEditing] = useState<LogEntry | null>(null);
  const [analyzing, setAnalyzing] = useState<number | null>(null);
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const [premiumNotice, setPremiumNotice] = useState<string | null>(null);

  const labels = useMemo(() => labelsFor(blocks), [blocks]);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [stepsRes, list, st] = await Promise.all([
        api<PhaseStepsResponse>(`/mediations/${mediationId}/phase-steps?phase=logbuch`),
        api<LogEntry[]>(`/mediations/${mediationId}/logbuch/entries`),
        api<LogbuchStatus>(`/mediations/${mediationId}/logbuch/status`),
      ]);
      const entryStep = (stepsRes.steps ?? []).find((s) => s.key === "logbuch_eintrag");
      setBlocks((entryStep?.blocks ?? []).filter((b): b is Block => !!b && !!b.id));
      setEntries(list);
      setStatus(st);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Server nicht erreichbar.");
      setEntries((prev) => prev ?? []);
    }
  }, [mediationId]);

  useEffect(() => {
    void load();
  }, [load]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const refreshStatus = useCallback(async () => {
    try {
      setStatus(await api<LogbuchStatus>(`/mediations/${mediationId}/logbuch/status`));
    } catch {
      // Quota-Anzeige ist nicht kritisch.
    }
  }, [mediationId]);

  // ── KI-Analyse ──
  const analyzeEntry = useCallback(
    async (entryId: number) => {
      setAnalyzing(entryId);
      setAiNotice(null);
      try {
        const body = await api<AnalyzeResponse>(
          `/mediations/${mediationId}/logbuch/entries/${entryId}/analyze`,
          { method: "POST" },
        );
        if (body.status === "done" && body.analysis) {
          setEntries((prev) =>
            (prev ?? []).map((e) =>
              e.id === entryId ? { ...e, ai_analysis: body.analysis ?? null } : e,
            ),
          );
        } else if (body.status === "quota_exhausted") {
          setPremiumNotice(
            status?.plan === "premium"
              ? "Ihr tägliches KI-Kontingent ist aufgebraucht – morgen geht es weiter."
              : "Ihre kostenlose KI-Interpretation dieser Woche ist aufgebraucht.",
          );
        } else if (body.status === "skipped" && body.reason) {
          setAiNotice(body.reason);
        }
        if (body.analyses) {
          setStatus((prev) => (prev ? { ...prev, analyses: body.analyses! } : prev));
        }
      } catch (e) {
        setAiNotice(e instanceof ApiError ? e.message : "Analyse fehlgeschlagen.");
      } finally {
        setAnalyzing(null);
      }
    },
    [mediationId, status?.plan],
  );

  const handleSaved = useCallback(
    (entry: LogEntry, wasNew: boolean) => {
      setComposing(false);
      setEditing(null);
      setEntries((prev) =>
        wasNew ? [entry, ...(prev ?? [])] : (prev ?? []).map((e) => (e.id === entry.id ? entry : e)),
      );
      // Wie im Web: neuen Eintrag direkt analysieren lassen.
      if (wasNew) void analyzeEntry(entry.id);
    },
    [analyzeEntry],
  );

  const deleteEntry = useCallback(
    async (id: number) => {
      try {
        await api(`/mediations/${mediationId}/logbuch/entries/${id}`, { method: "DELETE" });
        setEntries((prev) => (prev ?? []).filter((e) => e.id !== id));
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Eintrag konnte nicht gelöscht werden.");
      }
    },
    [mediationId],
  );

  // ── Anzeige-Helfer ──
  const quotaLine = (label: string, q: LogbuchStatus["analyses"]) =>
    q.limit == null
      ? `${label}: unbegrenzt`
      : `${label}: ${q.remaining}/${q.limit} ${q.period === "day" ? "heute" : "diese Woche"}`;

  const renderContent = (entry: LogEntry) => {
    const rows: React.ReactNode[] = [];
    for (const [key, value] of Object.entries(entry.content ?? {})) {
      if (value == null || value === "") continue;
      if (isUploadValue(value)) {
        rows.push(<AttachmentView key={key} upload={value} />);
      } else {
        rows.push(
          <View key={key} style={{ marginTop: spacing.sm }}>
            <Text style={styles.contentLabel}>{labels[key] ?? (key.startsWith("anhang_") ? "Anhang" : key)}</Text>
            <Text style={styles.contentValue}>{String(value)}</Text>
          </View>,
        );
      }
    }
    return rows;
  };

  if (entries == null) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12}>
          <Text style={{ color: colors.accentDark, fontSize: 16 }}>← Zurück</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        {status && <Badge label={status.plan === "premium" ? "Premium" : "Free"} />}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        {status && (
          <Text style={styles.quota}>
            {quotaLine("KI-Analysen", status.analyses)} · {quotaLine("Uploads", status.uploads)}
          </Text>
        )}
        <ErrorText message={error} />

        {premiumNotice && (
          <Card style={{ borderColor: colors.amber, backgroundColor: colors.amberSoft }}>
            <Text style={{ color: colors.amber, fontSize: 14 }}>{premiumNotice}</Text>
            {status?.plan !== "premium" && (
              <Text style={{ color: colors.amber, fontSize: 13, marginTop: spacing.sm }}>
                Mit Logbuch-Premium (einmalig {status?.premium_price_eur.toFixed(2).replace(".", ",")} €)
                erhalten Sie täglich einen KI-Tipp und unbegrenzte Uploads. Das Upgrade schalten Sie
                auf medipact.de in Ihrem Logbuch frei.
              </Text>
            )}
            <Button
              title="Verstanden"
              variant="ghost"
              onPress={() => setPremiumNotice(null)}
              style={{ marginTop: spacing.sm }}
            />
          </Card>
        )}

        {composing || editing ? (
          <EntryComposer
            mediationId={mediationId}
            blocks={blocks}
            editing={editing}
            onSaved={handleSaved}
            onCancel={() => {
              setComposing(false);
              setEditing(null);
            }}
            onQuotaExhausted={(msg) => setPremiumNotice(msg)}
            onUploadCounted={() => void refreshStatus()}
          />
        ) : (
          <Button title="+ Neuer Eintrag" onPress={() => setComposing(true)} style={{ marginBottom: spacing.lg }} />
        )}

        {aiNotice && (
          <Card style={{ backgroundColor: colors.accentSoft, borderColor: colors.accent }}>
            <Text style={{ color: colors.accentDark, fontSize: 13 }}>{aiNotice}</Text>
          </Card>
        )}

        {entries.length === 0 && !composing && (
          <Card>
            <Text style={styles.emptyTitle}>Noch keine Einträge</Text>
            <Text style={styles.emptyText}>
              Halten Sie fest, was passiert – je zeitnaher, desto wertvoller ist Ihre Chronologie
              später.
            </Text>
          </Card>
        )}

        {entries.map((entry) => (
          <Card key={entry.id}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.entryType}>{entryTypeLabel(entry.entry_type)}</Text>
              <Text style={styles.entryDate}>{formatDate(entry.occurred_at ?? entry.created_at)}</Text>
            </View>
            {entry.title ? <Text style={styles.entryTitle}>{entry.title}</Text> : null}
            {renderContent(entry)}

            {entry.ai_analysis ? (
              <View style={styles.analysis}>
                <Text style={styles.analysisHead}>🧭 KI-Einschätzung</Text>
                {entry.ai_analysis.einschaetzung ? (
                  <Text style={styles.analysisText}>{entry.ai_analysis.einschaetzung}</Text>
                ) : null}
                {entry.ai_analysis.naechste_schritte.map((s, i) => (
                  <View key={i} style={{ marginTop: spacing.sm }}>
                    <Text style={styles.analysisStep}>
                      {i + 1}. {s.titel}
                    </Text>
                    {s.warum ? <Text style={styles.analysisText}>{s.warum}</Text> : null}
                  </View>
                ))}
                {entry.ai_analysis.tipp ? (
                  <Text style={styles.analysisTip}>💡 {entry.ai_analysis.tipp}</Text>
                ) : null}
              </View>
            ) : (
              <Button
                title="KI-Analyse anfordern"
                variant="ghost"
                loading={analyzing === entry.id}
                onPress={() => void analyzeEntry(entry.id)}
                style={{ marginTop: spacing.md }}
              />
            )}

            <View style={{ flexDirection: "row", marginTop: spacing.md }}>
              <Pressable onPress={() => setEditing(entry)} hitSlop={8} style={{ marginRight: spacing.xl }}>
                <Text style={styles.actionLink}>Bearbeiten</Text>
              </Pressable>
              <Pressable onPress={() => void deleteEntry(entry.id)} hitSlop={8}>
                <Text style={[styles.actionLink, { color: colors.danger }]}>Löschen</Text>
              </Pressable>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

function AttachmentView({ upload }: { upload: UploadValue }) {
  if (looksLikeImage(upload)) {
    return (
      <Image
        source={{ uri: fileUrl(upload.url), headers: authHeaders() }}
        style={styles.attachmentImage}
        resizeMode="cover"
      />
    );
  }
  return (
    <Text style={[styles.contentValue, { marginTop: spacing.sm }]}>📎 {upload.name}</Text>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: "700", color: colors.text },
  quota: { fontSize: 12, color: colors.textSoft, marginBottom: spacing.md },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: colors.text },
  emptyText: { fontSize: 13, color: colors.textMuted, marginTop: spacing.xs },
  entryType: { fontSize: 13, fontWeight: "700", color: colors.accentDark },
  entryDate: { fontSize: 13, color: colors.textSoft },
  entryTitle: { fontSize: 16, fontWeight: "600", color: colors.text, marginTop: spacing.sm },
  contentLabel: { fontSize: 12, fontWeight: "600", color: colors.textSoft },
  contentValue: { fontSize: 14, color: colors.text, marginTop: 1 },
  attachmentImage: {
    width: "100%",
    height: 180,
    borderRadius: radius.sm,
    marginTop: spacing.sm,
    backgroundColor: colors.border,
  },
  analysis: {
    marginTop: spacing.md,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  analysisHead: { fontSize: 13, fontWeight: "700", color: colors.accentDark },
  analysisText: { fontSize: 13, color: colors.text, marginTop: 2, lineHeight: 19 },
  analysisStep: { fontSize: 14, fontWeight: "600", color: colors.text },
  analysisTip: {
    fontSize: 13,
    color: colors.accentDark,
    marginTop: spacing.md,
    fontStyle: "italic",
    lineHeight: 19,
  },
  actionLink: { fontSize: 13, fontWeight: "600", color: colors.textMuted },
});
