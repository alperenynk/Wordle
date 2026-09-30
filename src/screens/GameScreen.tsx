import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { GameState, Language, Settings, Statistics as StatsType } from "../types";
import { useGame } from "../hooks/useGame";
import { buildKeyboardStates } from "../game/gameLogic";
import { haptic } from "../utils/haptics";
import { t } from "../i18n/strings";
import { useTheme } from "../theme/ThemeContext";
import { CustomAlert } from "../components/Alert";
import { Header } from "../components/Header";
import { Board } from "../components/Board";
import { Keyboard } from "../components/Keyboard";
import { AppModal } from "../components/AppModal";
import { Statistics } from "../components/Statistics";
import { Settings as SettingsPanel } from "../components/Settings";
import { HelpContent } from "../components/HelpContent";
import { Toast } from "../components/Toast";
import { Confetti } from "../components/Confetti";

type ModalKind = "stats" | "settings" | null;
type AlertType = "newGame" | "language" | null;


interface GameScreenProps {
  session: { language: Language; game: GameState; stats: StatsType };
  settings: Settings;
  onUpdateSettings: (patch: Partial<Settings>) => void;
  onChangeLanguage: (language: Language) => void;
}

export function GameScreen({ session, settings, onUpdateSettings, onChangeLanguage }: GameScreenProps) {
  const p = useTheme();
  const language = session.language;
  const strings = t(language);
  const g = useGame(session);
  const { game } = g;


  const [alertType, setAlertType] = useState<AlertType>(null);
  const [pendingLanguage, setPendingLanguage] = useState<Language | null>(null);

  const [modal, setModal] = useState<ModalKind>(null);
  const [celebrate, setCelebrate] = useState(false);
  // A game restored already finished must not replay the result modal / confetti.
  const resultHandled = useRef(g.resultReady);

  useEffect(() => {
    if (!g.resultReady) {
      resultHandled.current = false;
      return;
    }
    if (resultHandled.current) return;
    resultHandled.current = true;
    const won = game.status === "won";
    haptic(won ? "success" : "error", settings.hapticsEnabled);
    if (won) setCelebrate(true);
    const timer = setTimeout(() => setModal("stats"), won ? 1100 : 600);
    return () => clearTimeout(timer);
  }, [g.resultReady, game.status, settings.hapticsEnabled]);

  const handleLetter = useCallback(
    (letter: string) => {
      haptic("key", settings.hapticsEnabled);
      g.typeLetter(letter);
    },
    [g, settings.hapticsEnabled]
  );

  const handleBackspace = useCallback(() => {
    haptic("key", settings.hapticsEnabled);
    g.backspace();
  }, [g, settings.hapticsEnabled]);

  const handleEnter = useCallback(() => {
    const result = g.submitGuess();
    if (result === "invalid") haptic("error", settings.hapticsEnabled);
    else if (result === "accepted") haptic("submit", settings.hapticsEnabled);
  }, [g, settings.hapticsEnabled]);

  function handleNewGame() {
    setCelebrate(false);
    g.startNewGame("random");
  }

  function handleNewGameFromModal() {
    setModal(null);
    handleNewGame();
  }

  function requestNewGame() {
    const inProgress =
      game.status === "playing" &&
      (game.guesses.length > 0 || game.currentGuess.length > 0);

    if (!inProgress) {
      handleNewGame();
      return;
    }

    setAlertType("newGame");
  }

  function requestLanguageChange(next: Language) {
    if (next === language) return;

    const inProgress =
      game.status === "playing" &&
      (game.guesses.length > 0 || game.currentGuess.length > 0);

    if (!inProgress) {
      setModal(null);
      onChangeLanguage(next);
      return;
    }

    setPendingLanguage(next);
    setAlertType("language");
  }

  // Keyboard colours only reflect rows whose flip animation has finished.
  const settledGuesses =
    game.revealingRowIndex !== null ? game.guesses.slice(0, game.revealingRowIndex) : game.guesses;
  const keyStates = buildKeyboardStates(settledGuesses);
  const locked = game.status !== "playing" || game.revealingRowIndex !== null;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: p.bg }]} edges={["top", "left", "right", "bottom"]}>
      <Header
        language={language}
        onStats={() => setModal("stats")}
        onSettings={() => setModal("settings")}
        onNewGame={requestNewGame}
      />

      <View style={styles.main}>
        <Board
          key={g.gameKey}
          language={language}
          guesses={game.guesses}
          currentGuess={game.currentGuess}
          revealingRowIndex={game.revealingRowIndex}
          status={game.status}
          invalidShake={game.invalidShake}
          animationsEnabled={settings.animationsEnabled}
          onShakeEnd={g.clearShake}
        />
        <Keyboard
          language={language}
          keyStates={keyStates}
          disabled={locked}
          onLetter={handleLetter}
          onEnter={handleEnter}
          onBackspace={handleBackspace}
        />
      </View>

      <Toast message={g.toast} onDismiss={g.dismissToast} />
      <Confetti active={celebrate} />

      <AppModal visible={modal === "stats"} title={strings.statistics} onClose={() => setModal(null)}>
        <Statistics
          language={language}
          stats={g.stats}
          gameStatus={game.status}
          secretWord={game.secretWord}
          guesses={game.guesses}
          onNewGame={handleNewGameFromModal}
        />
      </AppModal>
      <AppModal visible={modal === "settings"} title={strings.settings} onClose={() => setModal(null)}>
        <SettingsPanel settings={settings} onUpdate={onUpdateSettings} onChangeLanguage={requestLanguageChange} />
      </AppModal>
      <CustomAlert
        visible={alertType !== null}
        title={
          alertType === "newGame"
            ? strings.newGame
            : strings.language
        }
        message={
          alertType === "newGame"
            ? strings.confirmNewGame
            : strings.confirmLanguageChange
        }
        cancelText={strings.cancel}
        confirmText={
          alertType === "newGame"
            ? strings.newGame
            : strings.ok
        }
        palette={p}
        onCancel={() => {
          setAlertType(null);
          setPendingLanguage(null);
        }}
        onConfirm={() => {
          if (alertType === "newGame") {
            setAlertType(null);
            handleNewGame();
            return;
          }

          if (alertType === "language" && pendingLanguage) {
            const next = pendingLanguage;

            setAlertType(null);
            setPendingLanguage(null);
            setModal(null);

            onChangeLanguage(next);
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  main: { flex: 1 },
});
