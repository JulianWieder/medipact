// Einstieg der Kalender-App: löst „welcher Kalender gehört mir?" auf und
// zeigt dann direkt den Betreuungskalender.
//
// Die Logbuch-App fragt zuerst eine Liste ab und lässt wählen. Hier wäre das
// eine Hürde ohne Nutzen: wer die Kalender-App öffnet, will sehen, wann das
// Kind bei wem ist – nicht eine Liste mit einem Eintrag. Deshalb dieselbe
// Auflösung wie im Web über `/kalender/mein` (backend/routers/kalender.py),
// und die Antwort entscheidet: Kalender, leerer Zustand oder Fehler.
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ApiError, api, logout } from "../api";
import { colors, radius, spacing } from "../theme";
import { Button, Card, ErrorText } from "../ui";
import CareCalendarScreen from "./CareCalendarScreen";

type MeinKalender = {
  mediation_id: number | null;
  rolle: string | null;
  titel: string | null;
  offene_anfragen?: number;
  wartet_auf_mich?: number;
  // Umgewandelt in eine Mediation: Der App-Zugang endet hier bewusst. Ein
  // Verfahren führt man nicht auf einem Handy-Kalender weiter – dort hängen
  // Fristen, Zahlungen und die Eingaben der Gegenseite dran.
  gesperrt?: boolean;
  fall_titel?: string | null;
};

export default function KalenderStartScreen({
  onLoggedOut,
}: {
  onLoggedOut: () => void;
}) {
  const [daten, setDaten] = useState<MeinKalender | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const [laden, setLaden] = useState(true);

  const holen = useCallback(async () => {
    setLaden(true);
    setFehler(null);
    try {
      setDaten(await api<MeinKalender>("/kalender/mein"));
    } catch (e) {
      // 401 heißt: der Refresh-Token ist auch abgelaufen. Dann zurück zum
      // Login statt eine Fehlermeldung zu zeigen, die niemand auflösen kann.
      if (e instanceof ApiError && e.status === 401) {
        await logout();
        onLoggedOut();
        return;
      }
      setFehler(
        e instanceof ApiError ? e.message : "Server nicht erreichbar.",
      );
    } finally {
      setLaden(false);
    }
  }, [onLoggedOut]);

  useEffect(() => {
    void holen();
  }, [holen]);

  const abmelden = useCallback(async () => {
    await logout();
    onLoggedOut();
  }, [onLoggedOut]);

  // Der Kalender füllt den ganzen Bildschirm – es gibt keine Leiste, in die
  // ein „Konto"-Menü passen würde. Der Zurück-Pfeil öffnet deshalb diese
  // Auswahl.
  //
  // „Konto löschen" muss hier stehen, nicht nur auf der Website: Beide Stores
  // verlangen, dass die Löschung AUS DER APP heraus erreichbar ist. Die
  // eigentliche Löschung läuft dann im Browser – das ist zulässig und
  // deutlich sicherer, als einen unwiderruflichen Vorgang hinter einem
  // Fehltipper auf einem Handy zu verstecken.
  const kontoMenue = useCallback(() => {
    Alert.alert("Konto", undefined, [
      { text: "Abbrechen", style: "cancel" },
      { text: "Abmelden", onPress: () => void abmelden() },
      {
        text: "Konto löschen",
        style: "destructive",
        onPress: () => {
          void Linking.openURL("https://medipact.de/konto-loeschen");
        },
      },
    ]);
  }, [abmelden]);

  if (laden) {
    return (
      <View style={styles.mitte}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (fehler != null) {
    return (
      <ScrollView contentContainerStyle={styles.leer}>
        <Text style={styles.titel}>Kalender</Text>
        <ErrorText message={fehler} />
        <Button title="Erneut versuchen" onPress={holen} />
        <Pressable onPress={abmelden} style={styles.abmelden}>
          <Text style={styles.abmeldenText}>Abmelden</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (daten?.gesperrt) {
    return (
      <ScrollView contentContainerStyle={styles.leer}>
        <Text style={styles.titel}>Läuft jetzt im Verfahren weiter</Text>
        <Card>
          <Text style={styles.text}>
            Aus deinem Logbuch ist eine Mediation geworden
            {daten.fall_titel ? ` („${daten.fall_titel}“)` : ""}. Deine
            Betreuungszeiten und Absprachen sind vollständig mit umgezogen.
          </Text>
          <Text style={[styles.text, styles.textLeise]}>
            Geändert wird ab jetzt auf medipact.de im Verfahren – dort sehen
            beide Seiten denselben Stand.
          </Text>
        </Card>
        <Pressable onPress={abmelden} style={styles.abmelden}>
          <Text style={styles.abmeldenText}>Abmelden</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (daten?.mediation_id == null) {
    return (
      <ScrollView contentContainerStyle={styles.leer}>
        <Text style={styles.titel}>Noch kein Kalender</Text>
        <Card>
          <Text style={styles.text}>
            Der Betreuungskalender gehört zu einem Konflikt-Logbuch. Es ist
            kostenlos und in einem Schritt angelegt – das geht auf
            medipact.de unter „Logbuch anlegen".
          </Text>
          <Text style={[styles.text, styles.textLeise]}>
            Sobald das steht, öffnet sich hier beim nächsten Start direkt der
            Kalender.
          </Text>
        </Card>
        <Button title="Nochmal nachsehen" onPress={holen} />
        <Pressable onPress={abmelden} style={styles.abmelden}>
          <Text style={styles.abmeldenText}>Abmelden</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <CareCalendarScreen
      mediationId={daten.mediation_id}
      title={daten.titel ?? "Kalender"}
      // Es gibt nichts, wohin „zurück" führen könnte – der Kalender IST die
      // App. Der Pfeil öffnet stattdessen das Konto-Menü.
      onBack={kontoMenue}
    />
  );
}

const styles = StyleSheet.create({
  mitte: { flex: 1, justifyContent: "center", backgroundColor: colors.bg },
  leer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.lg,
    backgroundColor: colors.bg,
  },
  titel: { fontSize: 20, fontWeight: "600", color: colors.text },
  text: { fontSize: 15, lineHeight: 22, color: colors.textMuted },
  textLeise: { marginTop: spacing.md, color: colors.textSoft },
  abmelden: {
    alignSelf: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  abmeldenText: { fontSize: 14, color: colors.textSoft },
});
