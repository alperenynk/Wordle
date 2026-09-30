import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { GameState, Language, Settings, Statistics } from "./src/types";
import {
  DEFAULT_SETTINGS,
  loadGameState,
  loadSettings,
  loadStatistics,
  saveSettings,
} from "./src/storage/storage";
import { buildFreshState, createInitialGame } from "./src/game/gameSession";
import { getUtcDateKey } from "./src/game/wordSelection";
import { getPalette } from "./src/theme/theme";
import { ThemeContext } from "./src/theme/ThemeContext";
import { GameScreen } from "./src/screens/GameScreen";

interface Session {
  language: Language;
  game: GameState;
  stats: Statistics;
}

export default function App() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [session, setSession] = useState<Session | null>(null);

  // Load persisted settings, statistics and the in-progress game once at launch.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loadedSettings = await loadSettings();
      const [stats, persisted] = await Promise.all([
        loadStatistics(loadedSettings.language),
        loadGameState(loadedSettings.language),
      ]);
      if (cancelled) return;
      setSettings(loadedSettings);
      setSession({
        language: loadedSettings.language,
        stats,
        game: createInitialGame(loadedSettings.language, persisted),
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      void saveSettings(next);
      return next;
    });
  }, []);

  // Switching language resets the current game (per spec). A daily puzzle already
  // finished today for that language is kept, so the daily can't be replayed by toggling.
  const changeLanguage = useCallback(
    async (language: Language) => {
      const [stats, persisted] = await Promise.all([loadStatistics(language), loadGameState(language)]);
      const finishedDailyToday =
        persisted &&
        persisted.mode === "daily" &&
        persisted.dailyDateKey === getUtcDateKey() &&
        persisted.status !== "playing";
      const game = finishedDailyToday ? createInitialGame(language, persisted) : buildFreshState(language, "daily");
      updateSettings({ language });
      setSession({ language, stats, game });
    },
    [updateSettings]
  );

  const palette = getPalette(settings.theme);

  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={palette}>
        <StatusBar style={settings.theme === "dark" ? "light" : "dark"} />
        {session ? (
          <GameScreen
            // Remount per language so hook state (game, stats) starts from the new session.
            key={session.language}
            session={session}
            settings={settings}
            onUpdateSettings={updateSettings}
            onChangeLanguage={changeLanguage}
          />
        ) : (
          <View style={{ flex: 1, backgroundColor: palette.bg, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color={palette.accent} />
          </View>
        )}
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
}
