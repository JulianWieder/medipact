// Formular für einen Logbuch-Eintrag. Die Felder kommen aus der WFM-Vorlage
// (phase="logbuch", step_key="logbuch_eintrag") – wie im Web-Composer.
// Werte werden als {block_id: wert} in mediation_log_entries.content gespeichert.
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { API_URL, ApiError, api, authHeaders } from "../api";
import { blockLabel, entryTypes, isoToGerman, parseGermanDate } from "../logbuch";
import { colors, radius, spacing } from "../theme";
import { Block, BlockValue, LogEntry, UploadValue } from "../types";
import { Button, Chip, ErrorText } from "../ui";

type Props = {
  mediationId: number;
  blocks: Block[];
  editing: LogEntry | null;
  isBusiness: boolean;
  onSaved: (entry: LogEntry, wasNew: boolean) => void;
  onCancel: () => void;
  onQuotaExhausted: (message: string) => void;
  onUploadCounted: () => void;
};

export default function EntryComposer({
  mediationId,
  blocks,
  editing,
  isBusiness,
  onSaved,
  onCancel,
  onQuotaExhausted,
  onUploadCounted,
}: Props) {
  const inputBlocks = useMemo(() => blocks.filter((b) => b.type !== "textausgabe"), [blocks]);
  const dateBlockId = useMemo(
    () => inputBlocks.find((b) => b.type === "datum")?.id ?? null,
    [inputBlocks],
  );
  const hasUploadBlock = useMemo(
    () => inputBlocks.some((b) => b.type === "datei_upload"),
    [inputBlocks],
  );

  const [entryType, setEntryType] = useState(editing?.entry_type ?? "vorkommnis");
  // Sensibel-Checkbox wie im Web: checked = "private", unchecked = "personal";
  // ein geteilter ("shared") Eintrag bleibt beim Bearbeiten geteilt.
  const [sensitive, setSensitive] = useState((editing?.visibility ?? "personal") === "private");
  const [values, setValues] = useState<Record<string, BlockValue>>(() => {
    const init: Record<string, BlockValue> = { ...(editing?.content ?? {}) };
    if (dateBlockId && editing?.occurred_at && init[dateBlockId] == null) {
      init[dateBlockId] = editing.occurred_at.slice(0, 10);
    }
    return init;
  });
  const [attachments, setAttachments] = useState<UploadValue[]>(() => {
    // Anhänge, die die App unter anhang_N im content abgelegt hat.
    const out: UploadValue[] = [];
    for (const [k, v] of Object.entries(editing?.content ?? {})) {
      if (k.startsWith("anhang_") && typeof v === "object" && v != null && "url" in v) {
        out.push(v as UploadValue);
      }
    }
    return out;
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setValue = (id: string, v: BlockValue) => setValues((s) => ({ ...s, [id]: v }));

  // ── Upload (Kamera-Rolle oder Datei) ──
  const uploadAsset = async (uri: string, name: string, mime: string, blockId?: string) => {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      // React Native akzeptiert {uri, name, type} als multipart-Datei.
      form.append("file", { uri, name, type: mime } as unknown as Blob);
      const res = await fetch(`${API_URL}/mediations/${mediationId}/logbuch/upload`, {
        method: "POST",
        headers: authHeaders(),
        body: form,
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        if (res.status === 402) {
          onQuotaExhausted(body?.detail ?? "Upload-Kontingent aufgebraucht.");
        } else {
          setError(body?.detail ?? `Upload fehlgeschlagen (${res.status})`);
        }
        return;
      }
      const value: UploadValue = { url: body.url, name: body.name };
      if (blockId) setValue(blockId, value);
      else setAttachments((s) => [...s, value]);
      onUploadCounted();
    } catch {
      setError("Upload fehlgeschlagen – Server nicht erreichbar.");
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async (blockId?: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
    if (result.canceled || !result.assets?.length) return;
    const a = result.assets[0];
    await uploadAsset(
      a.uri,
      a.fileName ?? `foto_${Date.now()}.jpg`,
      a.mimeType ?? "image/jpeg",
      blockId,
    );
  };

  const pickDocument = async (blockId?: string) => {
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (result.canceled || !result.assets?.length) return;
    const a = result.assets[0];
    await uploadAsset(a.uri, a.name, a.mimeType ?? "application/octet-stream", blockId);
  };

  const askUpload = (blockId?: string) => {
    Alert.alert("Anhang hinzufügen", "Was möchten Sie hochladen?", [
      { text: "Foto aus der Galerie", onPress: () => void pickImage(blockId) },
      { text: "Datei / Dokument", onPress: () => void pickDocument(blockId) },
      { text: "Abbrechen", style: "cancel" },
    ]);
  };

  // ── Speichern ──
  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const content: Record<string, BlockValue> = { ...values };
      attachments.forEach((a, i) => {
        content[`anhang_${i + 1}`] = a;
      });

      let occurred: string | null = null;
      if (dateBlockId) {
        const raw = content[dateBlockId];
        if (typeof raw === "string" && raw.trim()) {
          const iso = parseGermanDate(raw);
          if (!iso) {
            setError("Bitte das Datum als TT.MM.JJJJ eingeben.");
            setSaving(false);
            return;
          }
          content[dateBlockId] = iso;
          occurred = iso;
        }
      }

      const wasShared = (editing?.visibility ?? "personal") === "shared";
      const visibility = sensitive ? "private" : wasShared ? "shared" : "personal";
      const payload = { entry_type: entryType, occurred_at: occurred, content, visibility };
      const entry = editing
        ? await api<LogEntry>(`/mediations/${mediationId}/logbuch/entries/${editing.id}`, {
            method: "PATCH",
            body: payload,
          })
        : await api<LogEntry>(`/mediations/${mediationId}/logbuch/entries`, {
            method: "POST",
            body: payload,
          });
      onSaved(entry, !editing);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Eintrag konnte nicht gespeichert werden.");
    } finally {
      setSaving(false);
    }
  };

  const renderBlock = (b: Block) => {
    const cfg = b.config ?? {};
    const label = blockLabel(b);
    const v = values[b.id];

    if (b.type === "datum") {
      const display =
        typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? isoToGerman(v) : ((v as string) ?? "");
      return (
        <View key={b.id} style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          {cfg.help ? <Text style={styles.help}>{String(cfg.help)}</Text> : null}
          <TextInput
            style={styles.input}
            value={display}
            onChangeText={(t) => setValue(b.id, t)}
            placeholder="TT.MM.JJJJ"
            placeholderTextColor={colors.textSoft}
            keyboardType="numbers-and-punctuation"
          />
        </View>
      );
    }

    if (b.type === "skala") {
      const min = Number(cfg.min ?? 1);
      const max = Number(cfg.max ?? 10);
      const nums: number[] = [];
      for (let i = min; i <= max; i++) nums.push(i);
      return (
        <View key={b.id} style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: spacing.sm }}>
            {nums.map((n) => (
              <Chip
                key={n}
                label={String(n)}
                active={Number(v) === n}
                onPress={() => setValue(b.id, n)}
              />
            ))}
          </View>
          {(cfg.minLabel || cfg.maxLabel) && (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.help}>{String(cfg.minLabel ?? "")}</Text>
              <Text style={styles.help}>{String(cfg.maxLabel ?? "")}</Text>
            </View>
          )}
        </View>
      );
    }

    if (b.type === "datei_upload") {
      const u = typeof v === "object" && v != null ? (v as UploadValue) : null;
      return (
        <View key={b.id} style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          {u ? <Text style={styles.help}>📎 {u.name}</Text> : null}
          <Button
            title={u ? "Andere Datei wählen" : "Datei hochladen"}
            variant="ghost"
            loading={uploading}
            onPress={() => askUpload(b.id)}
            style={{ marginTop: spacing.sm }}
          />
        </View>
      );
    }

    // Default: Freitext ("frage" und unbekannte Typen).
    return (
      <View key={b.id} style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={typeof v === "string" ? v : ""}
          onChangeText={(t) => setValue(b.id, t)}
          placeholder={cfg.placeholder ? String(cfg.placeholder) : undefined}
          placeholderTextColor={colors.textSoft}
          multiline
        />
      </View>
    );
  };

  return (
    <View style={styles.composer}>
      <Text style={styles.title}>{editing ? "Eintrag bearbeiten" : "Neuer Eintrag"}</Text>

      <Text style={styles.label}>Art des Eintrags</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: spacing.sm }}>
        {entryTypes(isBusiness).map((t) => (
          <Chip
            key={t.key}
            label={`${t.icon} ${t.label}`}
            active={entryType === t.key}
            onPress={() => setEntryType(t.key)}
          />
        ))}
      </View>

      {inputBlocks.map(renderBlock)}

      {!isBusiness && (
        <Pressable
          onPress={() => setSensitive((s) => !s)}
          style={styles.sensitiveRow}
          hitSlop={8}
        >
          <View style={[styles.checkbox, sensitive && styles.checkboxOn]}>
            {sensitive ? <Text style={styles.checkboxTick}>✓</Text> : null}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>🔒 Sensibel – nur für mich</Text>
            <Text style={styles.help}>
              Streng vertraulich: sieht niemals Mediator oder Gegenseite – auch nach einer
              Umwandlung nicht.
            </Text>
          </View>
        </Pressable>
      )}

      {!hasUploadBlock && (
        <View style={styles.field}>
          <Text style={styles.label}>Anhänge (optional)</Text>
          {attachments.map((a, i) => (
            <Text key={i} style={styles.help}>
              📎 {a.name}
            </Text>
          ))}
          <Button
            title="+ Foto oder Datei anhängen"
            variant="ghost"
            loading={uploading}
            onPress={() => askUpload()}
            style={{ marginTop: spacing.sm }}
          />
        </View>
      )}

      <ErrorText message={error} />
      <Button
        title={editing ? "Änderungen speichern" : "Eintrag speichern"}
        onPress={save}
        loading={saving}
        style={{ marginTop: spacing.md }}
      />
      <Button title="Abbrechen" variant="ghost" onPress={onCancel} style={{ marginTop: spacing.sm }} />
    </View>
  );
}

const styles = StyleSheet.create({
  composer: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: spacing.md },
  field: { marginTop: spacing.lg },
  label: { fontSize: 14, fontWeight: "600", color: colors.text },
  help: { fontSize: 12, color: colors.textSoft, marginTop: 2 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.bg,
    marginTop: spacing.sm,
  },
  multiline: { minHeight: 80, textAlignVertical: "top" },
  sensitiveRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: spacing.lg,
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
  },
  checkboxOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  checkboxTick: { color: "#fff", fontSize: 14, fontWeight: "700", lineHeight: 18 },
});
