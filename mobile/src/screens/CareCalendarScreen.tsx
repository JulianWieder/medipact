// Betreuungskalender (Trennung): geplante vs. tatsächliche Betreuungszeiten.
// Mobile Spiegel von app/dashboard/logbuch/[id]/BetreuungsKalender.tsx –
// als Monats-LISTE statt Raster (auf kleinen Screens besser lesbar).
// API: /mediations/{id}/logbuch/betreuung/* (backend routers/betreuung.py).
// Inkl. Betreuungszeiten-TAUSCH bei geteilten Terminen: ein Elternteil
// schlägt neue Zeiten vor, die Gegenseite nimmt an oder lehnt ab.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ApiError, api } from "../api";
import { isoToGerman, parseGermanDate } from "../logbuch";
import { colors, radius, spacing } from "../theme";
import { Button, Card, Chip, ErrorText } from "../ui";

type CareRule = {
  id: number;
  label: string | null;
  caregiver: string | null;
  start_weekday: number;
  start_time: string;
  end_weekday: number;
  end_time: string;
  interval_weeks: number;
  visibility: string;
};

type CareItem = {
  key: string;
  source: "regel" | "einzeltermin";
  rule_id: number | null;
  entry_id: number | null;
  date: string;
  label: string | null;
  caregiver: string | null;
  planned_start: string | null;
  planned_end: string | null;
  actual_start: string | null;
  actual_end: string | null;
  status: string;
  note: string | null;
  visibility: string;
  swap_status: string | null;
  swap_requested_by: number | null;
  swap_proposed_start: string | null;
  swap_proposed_end: string | null;
  swap_message: string | null;
};

type TermineResponse = { items: CareItem[]; rules: CareRule[]; me: number | null };

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const WEEKDAYS_LONG = [
  "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag",
];

function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function fmtTime(ts: string | null): string {
  if (!ts) return "–";
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function fmtDayShort(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" });
}
function fmtSpan(startTs: string | null, endTs: string | null): string {
  if (!startTs && !endTs) return "–";
  const sameDay = startTs && endTs && startTs.slice(0, 10) === endTs.slice(0, 10);
  const end = endTs
    ? sameDay
      ? fmtTime(endTs)
      : `${new Date(endTs).toLocaleDateString("de-DE", { weekday: "short" })} ${fmtTime(endTs)}`
    : "…";
  return `${fmtTime(startTs)} – ${end}`;
}
function diffMinutes(planned: string | null, actual: string | null): number | null {
  if (!planned || !actual) return null;
  return Math.round((new Date(actual).getTime() - new Date(planned).getTime()) / 60000);
}
function diffLabel(mins: number | null, kind: string): string | null {
  if (mins == null || Math.abs(mins) < 5) return null;
  const h = Math.floor(Math.abs(mins) / 60);
  const m = Math.abs(mins) % 60;
  const dur = h > 0 ? `${h} Std.${m ? ` ${m} Min.` : ""}` : `${m} Min.`;
  return `${kind} ${dur} ${mins > 0 ? "später" : "früher"}`;
}
function validHHMM(v: string): boolean {
  return /^([01]?\d|2[0-3]):[0-5]\d$/.test(v.trim());
}
/** Deutsches Datum + "HH:MM" → ISO-Zeitstempel (oder null). */
function combineDe(dateDe: string, time: string): string | null {
  const d = parseGermanDate(dateDe);
  if (!d || !validHHMM(time)) return null;
  return `${d}T${time.trim()}:00`;
}

type Props = { mediationId: number; title: string; onBack: () => void };

export default function CareCalendarScreen({ mediationId, title, onBack }: Props) {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [data, setData] = useState<TermineResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [showTerminForm, setShowTerminForm] = useState(false);

  const range = useMemo(() => {
    const from = iso(month);
    const to = iso(new Date(month.getFullYear(), month.getMonth() + 1, 0));
    return { from, to };
  }, [month]);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await api<TermineResponse>(
        `/mediations/${mediationId}/logbuch/betreuung/termine?from=${range.from}&to=${range.to}`,
      );
      setData(res);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Server nicht erreichbar.");
    }
  }, [mediationId, range]);

  useEffect(() => {
    void load();
  }, [load]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const monthLabel = month.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
  const items = data?.items ?? [];
  const rules = data?.rules ?? [];
  const expanded = items.find((i) => i.key === expandedKey) ?? null;

  const tone = (it: CareItem): { border: string; bg: string; label: string } => {
    if (it.status === "ausgefallen")
      return { border: colors.danger, bg: colors.dangerSoft, label: "ausgefallen" };
    if (it.actual_start || it.actual_end) {
      const dev = Math.abs(diffMinutes(it.planned_start, it.actual_start) ?? 0) >= 15;
      return dev
        ? { border: colors.amber, bg: colors.amberSoft, label: "mit Abweichung" }
        : { border: colors.accent, bg: colors.accentSoft, label: "wie geplant" };
    }
    return { border: colors.border, bg: colors.card, label: "geplant" };
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12}>
          <Text style={{ color: colors.accentDark, fontSize: 16 }}>← Zurück</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          📅 {title}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        <ErrorText message={error} />

        {/* Monatsnavigation */}
        <View style={styles.monthRow}>
          <Button
            title="←"
            variant="ghost"
            onPress={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
          />
          <Text style={styles.monthLabel}>{monthLabel}</Text>
          <Button
            title="→"
            variant="ghost"
            onPress={() => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
          />
        </View>

        <View style={{ flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md }}>
          <Chip
            label="+ Wiederkehrend"
            active={showRuleForm}
            onPress={() => {
              setShowRuleForm((v) => !v);
              setShowTerminForm(false);
            }}
          />
          <Chip
            label="+ Einzeltermin"
            active={showTerminForm}
            onPress={() => {
              setShowTerminForm((v) => !v);
              setShowRuleForm(false);
            }}
          />
        </View>

        {showRuleForm && (
          <RuleForm
            mediationId={mediationId}
            onSaved={() => {
              setShowRuleForm(false);
              void load();
            }}
            onCancel={() => setShowRuleForm(false)}
          />
        )}
        {showTerminForm && (
          <TerminForm
            mediationId={mediationId}
            onSaved={() => {
              setShowTerminForm(false);
              void load();
            }}
            onCancel={() => setShowTerminForm(false)}
          />
        )}

        {/* Serienregeln */}
        {rules.length > 0 && (
          <Card style={{ marginBottom: spacing.md }}>
            <Text style={styles.sectionTitle}>Wochenmuster</Text>
            {rules.map((r) => (
              <View key={r.id} style={styles.ruleRow}>
                <Text style={{ color: colors.text, fontSize: 13, flex: 1 }}>
                  {r.label || r.caregiver || "Betreuung"} ·{" "}
                  {WEEKDAYS[r.start_weekday]} {r.start_time} – {WEEKDAYS[r.end_weekday]} {r.end_time}
                  {(r.interval_weeks ?? 1) > 1 ? ` · jede ${r.interval_weeks}. Woche` : ""}
                </Text>
                <Pressable
                  hitSlop={8}
                  onPress={async () => {
                    try {
                      await api(`/mediations/${mediationId}/logbuch/betreuung/rules/${r.id}`, {
                        method: "DELETE",
                      });
                      void load();
                    } catch {
                      /* bleibt stehen */
                    }
                  }}
                >
                  <Text style={{ color: colors.textSoft, fontSize: 13 }}>✕</Text>
                </Pressable>
              </View>
            ))}
          </Card>
        )}

        {/* Termin-Liste des Monats */}
        {data == null ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.xl }} />
        ) : items.length === 0 ? (
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>
            Keine Betreuungstermine in diesem Monat. Legen Sie ein Wochenmuster
            („+ Wiederkehrend“) oder einen Einzeltermin an.
          </Text>
        ) : (
          items.map((it) => {
            const t = tone(it);
            const isOpen = it.key === expandedKey;
            return (
              <Pressable
                key={it.key}
                onPress={() => setExpandedKey(isOpen ? null : it.key)}
                style={[styles.itemRow, { borderColor: t.border, backgroundColor: t.bg }]}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: "700" }}>
                    {fmtDayShort(it.date)}
                    {it.caregiver ? ` · ${it.caregiver}` : it.label ? ` · ${it.label}` : ""}
                    {it.swap_status === "angefragt" ? " 🔁" : ""}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>{t.label}</Text>
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 2 }}>
                  Plan: {fmtSpan(it.planned_start, it.planned_end)}
                  {(it.actual_start || it.actual_end) &&
                    `  ·  Ist: ${fmtSpan(it.actual_start, it.actual_end)}`}
                </Text>
                {isOpen && expanded && (
                  <IstForm
                    mediationId={mediationId}
                    me={data?.me ?? null}
                    item={expanded}
                    onSaved={() => {
                      setExpandedKey(null);
                      void load();
                    }}
                  />
                )}
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

// ── Ist-Zeiten + Tausch zu einem Termin ─────────────────────────────────────
function IstForm({
  mediationId,
  me,
  item,
  onSaved,
}: {
  mediationId: number;
  me: number | null;
  item: CareItem;
  onSaved: () => void;
}) {
  const [status, setStatus] = useState(item.status || "geplant");
  const [startDate, setStartDate] = useState(
    isoToGerman(item.actual_start ?? item.date),
  );
  const [startTime, setStartTime] = useState(
    fmtTime(item.actual_start) !== "–" ? fmtTime(item.actual_start) : fmtTime(item.planned_start),
  );
  const [endDate, setEndDate] = useState(
    isoToGerman(item.actual_end ?? item.planned_end ?? item.date),
  );
  const [endTime, setEndTime] = useState(
    fmtTime(item.actual_end) !== "–" ? fmtTime(item.actual_end) : fmtTime(item.planned_end),
  );
  const [note, setNote] = useState(item.note ?? "");
  const [swapOpen, setSwapOpen] = useState(false);
  const [swapStartDate, setSwapStartDate] = useState(isoToGerman(item.planned_start ?? item.date));
  const [swapStartTime, setSwapStartTime] = useState(fmtTime(item.planned_start));
  const [swapEndDate, setSwapEndDate] = useState(isoToGerman(item.planned_end ?? item.date));
  const [swapEndTime, setSwapEndTime] = useState(fmtTime(item.planned_end));
  const [swapMessage, setSwapMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const devStart = diffLabel(diffMinutes(item.planned_start, item.actual_start), "Beginn");
  const devEnd = diffLabel(diffMinutes(item.planned_end, item.actual_end), "Ende");
  const mineRequest = item.swap_requested_by != null && item.swap_requested_by === me;

  /** Für Serien-Vorkommen ohne Erfassung zuerst einen Override anlegen. */
  const ensureEntryId = async (): Promise<number> => {
    if (item.entry_id) return item.entry_id;
    const created = await api<{ id: number }>(
      `/mediations/${mediationId}/logbuch/betreuung/termine`,
      {
        method: "POST",
        body: {
          rule_id: item.rule_id,
          date: item.date,
          status: item.status || "geplant",
          visibility: item.visibility,
        },
      },
    );
    return created.id;
  };

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const ausgefallen = status === "ausgefallen";
      const body = {
        status,
        actual_start: ausgefallen ? null : combineDe(startDate, startTime),
        actual_end: ausgefallen ? null : combineDe(endDate, endTime),
        note: note || null,
      };
      const entryId = await ensureEntryId();
      await api(`/mediations/${mediationId}/logbuch/betreuung/termine/${entryId}`, {
        method: "PATCH",
        body,
      });
      onSaved();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Speichern fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  };

  const requestSwap = async () => {
    setBusy(true);
    setError(null);
    try {
      const entryId = await ensureEntryId();
      await api(`/mediations/${mediationId}/logbuch/betreuung/termine/${entryId}/tausch`, {
        method: "POST",
        body: {
          proposed_start: combineDe(swapStartDate, swapStartTime),
          proposed_end: combineDe(swapEndDate, swapEndTime),
          message: swapMessage || null,
        },
      });
      onSaved();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Tausch-Anfrage fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  };

  const answerSwap = async (akzeptieren: boolean) => {
    if (!item.entry_id) return;
    setBusy(true);
    setError(null);
    try {
      await api(
        `/mediations/${mediationId}/logbuch/betreuung/termine/${item.entry_id}/tausch/antwort`,
        { method: "POST", body: { akzeptieren } },
      );
      onSaved();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Antwort fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ marginTop: spacing.md }}>
      {(devStart || devEnd) && (
        <Text style={{ color: colors.amber, fontSize: 12, fontWeight: "700", marginBottom: spacing.sm }}>
          Abweichung: {[devStart, devEnd].filter(Boolean).join(" · ")}
        </Text>
      )}

      <View style={{ flexDirection: "row", gap: spacing.sm, marginBottom: spacing.sm }}>
        {[
          { key: "geplant", label: "Offen" },
          { key: "stattgefunden", label: "Stattgefunden" },
          { key: "ausgefallen", label: "Ausgefallen" },
        ].map((s) => (
          <Chip key={s.key} label={s.label} active={status === s.key} onPress={() => setStatus(s.key)} />
        ))}
      </View>

      {status !== "ausgefallen" && (
        <>
          <Text style={styles.fieldLabel}>Tatsächlicher Beginn (TT.MM.JJJJ / HH:MM)</Text>
          <View style={styles.timeRow}>
            <TextInput style={[styles.input, { flex: 1.4 }]} value={startDate} onChangeText={setStartDate} placeholder="TT.MM.JJJJ" />
            <TextInput style={[styles.input, { flex: 1 }]} value={startTime} onChangeText={setStartTime} placeholder="HH:MM" />
          </View>
          <Text style={styles.fieldLabel}>Tatsächliches Ende</Text>
          <View style={styles.timeRow}>
            <TextInput style={[styles.input, { flex: 1.4 }]} value={endDate} onChangeText={setEndDate} placeholder="TT.MM.JJJJ" />
            <TextInput style={[styles.input, { flex: 1 }]} value={endTime} onChangeText={setEndTime} placeholder="HH:MM" />
          </View>
        </>
      )}

      <Text style={styles.fieldLabel}>Notiz (z. B. Grund der Abweichung)</Text>
      <TextInput
        style={[styles.input, { minHeight: 40 }]}
        value={note}
        onChangeText={setNote}
        placeholder="Übergabe verspätet, kurzfristig abgesagt …"
        multiline
      />

      <ErrorText message={error} />
      <Button title={busy ? "Speichert …" : "Speichern"} onPress={save} style={{ marginTop: spacing.sm }} />

      {/* ── Tausch ── */}
      {item.visibility !== "shared" ? (
        <Text style={{ color: colors.textSoft, fontSize: 11, marginTop: spacing.sm }}>
          🔁 Tausch geht nur bei geteilten Terminen (Sichtbarkeit „Geteilt“).
        </Text>
      ) : item.swap_status === "angefragt" ? (
        <Card style={{ marginTop: spacing.sm, borderColor: colors.amber, backgroundColor: colors.amberSoft }}>
          <Text style={{ color: colors.amber, fontSize: 12, fontWeight: "700" }}>
            🔁 Tausch-Anfrage {mineRequest ? "(von Ihnen)" : "der Gegenseite"}
          </Text>
          <Text style={{ color: colors.amber, fontSize: 12, marginTop: 2 }}>
            Vorschlag: {fmtSpan(item.swap_proposed_start, item.swap_proposed_end)}
          </Text>
          {item.swap_message ? (
            <Text style={{ color: colors.amber, fontSize: 12, fontStyle: "italic", marginTop: 2 }}>
              „{item.swap_message}“
            </Text>
          ) : null}
          {!mineRequest ? (
            <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm }}>
              <Button title="Annehmen" onPress={() => void answerSwap(true)} />
              <Button title="Ablehnen" variant="ghost" onPress={() => void answerSwap(false)} />
            </View>
          ) : (
            <Text style={{ color: colors.amber, fontSize: 11, marginTop: 2 }}>
              Wartet auf Antwort der Gegenseite.
            </Text>
          )}
        </Card>
      ) : !swapOpen ? (
        <Button
          title="🔁 Tausch anfragen"
          variant="ghost"
          onPress={() => setSwapOpen(true)}
          style={{ marginTop: spacing.sm }}
        />
      ) : (
        <View style={{ marginTop: spacing.sm }}>
          <Text style={styles.fieldLabel}>Neuer Beginn</Text>
          <View style={styles.timeRow}>
            <TextInput style={[styles.input, { flex: 1.4 }]} value={swapStartDate} onChangeText={setSwapStartDate} placeholder="TT.MM.JJJJ" />
            <TextInput style={[styles.input, { flex: 1 }]} value={swapStartTime} onChangeText={setSwapStartTime} placeholder="HH:MM" />
          </View>
          <Text style={styles.fieldLabel}>Neues Ende</Text>
          <View style={styles.timeRow}>
            <TextInput style={[styles.input, { flex: 1.4 }]} value={swapEndDate} onChangeText={setSwapEndDate} placeholder="TT.MM.JJJJ" />
            <TextInput style={[styles.input, { flex: 1 }]} value={swapEndTime} onChangeText={setSwapEndTime} placeholder="HH:MM" />
          </View>
          <TextInput
            style={[styles.input, { marginTop: spacing.sm }]}
            value={swapMessage}
            onChangeText={setSwapMessage}
            placeholder="Nachricht (optional)"
          />
          <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm }}>
            <Button title={busy ? "Sendet …" : "Anfrage senden"} onPress={requestSwap} />
            <Button title="Abbrechen" variant="ghost" onPress={() => setSwapOpen(false)} />
          </View>
        </View>
      )}
    </View>
  );
}

// ── Serienregel anlegen ─────────────────────────────────────────────────────
function RuleForm({
  mediationId,
  onSaved,
  onCancel,
}: {
  mediationId: number;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState("");
  const [caregiver, setCaregiver] = useState("");
  const [startWeekday, setStartWeekday] = useState(4);
  const [startTime, setStartTime] = useState("17:00");
  const [endWeekday, setEndWeekday] = useState(6);
  const [endTime, setEndTime] = useState("18:00");
  const [interval, setIntervalWeeks] = useState(2);
  const [validFrom, setValidFrom] = useState("");
  const [shared, setShared] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!validHHMM(startTime) || !validHHMM(endTime)) {
      setError("Uhrzeiten bitte als HH:MM angeben.");
      return;
    }
    const from = validFrom.trim() ? parseGermanDate(validFrom) : null;
    if (validFrom.trim() && !from) {
      setError("Datum bitte als TT.MM.JJJJ angeben.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await api(`/mediations/${mediationId}/logbuch/betreuung/rules`, {
        method: "POST",
        body: {
          label: label || null,
          caregiver: caregiver || null,
          start_weekday: startWeekday,
          start_time: startTime.trim(),
          end_weekday: endWeekday,
          end_time: endTime.trim(),
          interval_weeks: interval,
          valid_from: from,
          anchor_date: from,
          visibility: shared ? "shared" : "personal",
        },
      });
      onSaved();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Regel konnte nicht angelegt werden.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card style={{ marginBottom: spacing.md }}>
      <Text style={styles.sectionTitle}>Wiederkehrende Betreuung</Text>
      <TextInput style={styles.input} value={label} onChangeText={setLabel} placeholder="Bezeichnung, z. B. Wochenende bei Papa" />
      <TextInput style={[styles.input, { marginTop: spacing.sm }]} value={caregiver} onChangeText={setCaregiver} placeholder="Wer betreut? (Papa / Mama / Name)" />

      <Text style={styles.fieldLabel}>Beginn (Wochentag + HH:MM)</Text>
      <WeekdayPicker value={startWeekday} onChange={setStartWeekday} />
      <TextInput style={styles.input} value={startTime} onChangeText={setStartTime} placeholder="HH:MM" />

      <Text style={styles.fieldLabel}>Ende (Wochentag + HH:MM)</Text>
      <WeekdayPicker value={endWeekday} onChange={setEndWeekday} />
      <TextInput style={styles.input} value={endTime} onChangeText={setEndTime} placeholder="HH:MM" />

      <Text style={styles.fieldLabel}>Rhythmus</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
        {[1, 2, 3, 4].map((n) => (
          <Chip
            key={n}
            label={n === 1 ? "jede Woche" : `jede ${n}.`}
            active={interval === n}
            onPress={() => setIntervalWeeks(n)}
          />
        ))}
      </View>

      <Text style={styles.fieldLabel}>
        Erster Termin ab (TT.MM.JJJJ{interval > 1 ? " – legt die Wochen fest" : ", optional"})
      </Text>
      <TextInput style={styles.input} value={validFrom} onChangeText={setValidFrom} placeholder="TT.MM.JJJJ" />

      <View style={{ marginTop: spacing.sm }}>
        <Chip
          label={shared ? "🤝 Geteilt (Gegenseite sieht die Termine)" : "📓 Nur für mich"}
          active={shared}
          onPress={() => setShared((v) => !v)}
        />
      </View>

      <ErrorText message={error} />
      <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.md }}>
        <Button title={busy ? "Speichert …" : "Regel speichern"} onPress={save} />
        <Button title="Abbrechen" variant="ghost" onPress={onCancel} />
      </View>
    </Card>
  );
}

// ── Einzeltermin anlegen ────────────────────────────────────────────────────
function TerminForm({
  mediationId,
  onSaved,
  onCancel,
}: {
  mediationId: number;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [date, setDate] = useState(isoToGerman(iso(new Date())));
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("18:00");
  const [caregiver, setCaregiver] = useState("");
  const [note, setNote] = useState("");
  const [shared, setShared] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    const d = parseGermanDate(date);
    if (!d) {
      setError("Datum bitte als TT.MM.JJJJ angeben.");
      return;
    }
    if (!validHHMM(startTime) || !validHHMM(endTime)) {
      setError("Uhrzeiten bitte als HH:MM angeben.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await api(`/mediations/${mediationId}/logbuch/betreuung/termine`, {
        method: "POST",
        body: {
          date: d,
          planned_start: `${d}T${startTime.trim()}:00`,
          planned_end: combineDe(endDate.trim() || date, endTime),
          caregiver: caregiver || null,
          note: note || null,
          status: "geplant",
          visibility: shared ? "shared" : "personal",
        },
      });
      onSaved();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Termin konnte nicht angelegt werden.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card style={{ marginBottom: spacing.md }}>
      <Text style={styles.sectionTitle}>Einzeltermin</Text>
      <Text style={styles.fieldLabel}>Geplanter Beginn (TT.MM.JJJJ / HH:MM)</Text>
      <View style={styles.timeRow}>
        <TextInput style={[styles.input, { flex: 1.4 }]} value={date} onChangeText={setDate} placeholder="TT.MM.JJJJ" />
        <TextInput style={[styles.input, { flex: 1 }]} value={startTime} onChangeText={setStartTime} placeholder="HH:MM" />
      </View>
      <Text style={styles.fieldLabel}>Geplantes Ende</Text>
      <View style={styles.timeRow}>
        <TextInput style={[styles.input, { flex: 1.4 }]} value={endDate} onChangeText={setEndDate} placeholder={date || "TT.MM.JJJJ"} />
        <TextInput style={[styles.input, { flex: 1 }]} value={endTime} onChangeText={setEndTime} placeholder="HH:MM" />
      </View>
      <TextInput style={[styles.input, { marginTop: spacing.sm }]} value={caregiver} onChangeText={setCaregiver} placeholder="Wer betreut?" />
      <TextInput style={[styles.input, { marginTop: spacing.sm }]} value={note} onChangeText={setNote} placeholder="Notiz, z. B. Osterferien 1. Hälfte" />
      <View style={{ marginTop: spacing.sm }}>
        <Chip
          label={shared ? "🤝 Geteilt" : "📓 Nur für mich"}
          active={shared}
          onPress={() => setShared((v) => !v)}
        />
      </View>
      <ErrorText message={error} />
      <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.md }}>
        <Button title={busy ? "Speichert …" : "Termin speichern"} onPress={save} />
        <Button title="Abbrechen" variant="ghost" onPress={onCancel} />
      </View>
    </Card>
  );
}

function WeekdayPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginBottom: spacing.sm }}>
      {WEEKDAYS_LONG.map((w, i) => (
        <Chip key={w} label={WEEKDAYS[i]} active={value === i} onPress={() => onChange(i)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingTop: 56,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: "700", color: colors.text },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  monthLabel: { fontSize: 16, fontWeight: "700", color: colors.text },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: colors.text, marginBottom: spacing.sm },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  itemRow: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  timeRow: { flexDirection: "row", gap: spacing.sm },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: colors.text,
  },
});
