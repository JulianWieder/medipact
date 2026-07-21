// Einstieg der medipact-Logbuch-App: Auth-Gate + einfache Stack-Navigation
// (bewusst ohne react-navigation – drei Screens brauchen keinen Navigator).
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, BackHandler, View } from "react-native";

import { loadTokens } from "./src/api";
import CasesScreen from "./src/screens/CasesScreen";
import LoginScreen from "./src/screens/LoginScreen";
import LogbookScreen from "./src/screens/LogbookScreen";
import { colors } from "./src/theme";

type Route =
  | { name: "login" }
  | { name: "cases" }
  | { name: "logbook"; id: number; title: string };

export default function App() {
  const [route, setRoute] = useState<Route | null>(null);

  useEffect(() => {
    void (async () => {
      const hasSession = await loadTokens();
      setRoute(hasSession ? { name: "cases" } : { name: "login" });
    })();
  }, []);

  // Android-Hardware-Back: vom Logbuch zurück zur Übersicht.
  const goBack = useCallback(() => {
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
          onOpen={(id, title) => setRoute({ name: "logbook", id, title })}
          onLoggedOut={() => setRoute({ name: "login" })}
        />
      )}
      {route.name === "logbook" && (
        <LogbookScreen
          mediationId={route.id}
          title={route.title}
          onBack={() => setRoute({ name: "cases" })}
        />
      )}
    </View>
  );
}
