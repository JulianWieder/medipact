// Einstieg der medipact-Logbuch-App: Auth-Gate + einfache Stack-Navigation
// (bewusst ohne react-navigation – drei Screens brauchen keinen Navigator).
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, BackHandler, View } from "react-native";

import { loadTokens } from "./src/api";
import CareCalendarScreen from "./src/screens/CareCalendarScreen";
import CasesScreen from "./src/screens/CasesScreen";
import LoginScreen from "./src/screens/LoginScreen";
import LogbookScreen from "./src/screens/LogbookScreen";
import { colors } from "./src/theme";

type Route =
  | { name: "login" }
  | { name: "cases" }
  | {
      name: "logbook";
      id: number;
      title: string;
      mode: string; // "logbuch" | "mediation" (verknüpfter Fall)
      mediationType: string;
    }
  | {
      // Betreuungskalender (nur Trennung): Plan- vs. Ist-Zeiten + Tausch.
      name: "care";
      id: number;
      title: string;
      mode: string;
      mediationType: string;
    };

export default function App() {
  const [route, setRoute] = useState<Route | null>(null);

  useEffect(() => {
    void (async () => {
      const hasSession = await loadTokens();
      setRoute(hasSession ? { name: "cases" } : { name: "login" });
    })();
  }, []);

  // Android-Hardware-Back: Kalender → Logbuch → Übersicht.
  const goBack = useCallback(() => {
    if (route?.name === "care") {
      setRoute({ ...route, name: "logbook" });
      return true;
    }
    if (route?.name === "logbook") {
      setRoute({ name: "cases" });
      return true;
    }
    return false;
  }, [route]);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", goBack);
    return () => sub.remove();
  }, [goBack]);

  if (route == null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      {route.name === "login" && (
        <LoginScreen onLoggedIn={() => setRoute({ name: "cases" })} />
      )}
      {route.name === "cases" && (
        <CasesScreen
          onOpen={(id, title, mode, mediationType) =>
            setRoute({ name: "logbook", id, title, mode, mediationType })
          }
          onLoggedOut={() => setRoute({ name: "login" })}
        />
      )}
      {route.name === "logbook" && (
        <LogbookScreen
          mediationId={route.id}
          title={route.title}
          mode={route.mode}
          mediationType={route.mediationType}
          onBack={() => setRoute({ name: "cases" })}
          onOpenCare={() => setRoute({ ...route, name: "care" })}
        />
      )}
      {route.name === "care" && (
        <CareCalendarScreen
          mediationId={route.id}
          title={route.title}
          onBack={() => setRoute({ ...route, name: "logbook" })}
        />
      )}
    </View>
  );
}
