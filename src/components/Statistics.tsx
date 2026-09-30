import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { EvaluatedGuess, GameStatus, Language, Statistics as StatsType } from "../types";
import { t } from "../i18n/strings";
import { winningGuessNumber } from "../game/gameLogic";
import { localeUpper } from "../utils/turkish";
import { useTheme } from "../theme/ThemeContext";

interface StatisticsProps {
  language: Language;
  stats: StatsType;
  gameStatus: GameStatus;
  secretWord: string;
  guesses: EvaluatedGuess[];
  onNewGame: () => void;
}

export function Statistics({ language, stats, gameStatus, secretWord, guesses, onNewGame }: StatisticsProps) {
  const p = useTheme();
  const strings = t(language);
  const winPercent = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
  const maxCount = Math.max(1, ...Object.values(stats.guessDistribution));
  const highlight = gameStatus === "won" ? winningGuessNumber(guesses) : null;
  const finished = gameStatus !== "playing";

  const summary = [
    { value: stats.played, label: strings.played },
    { value: winPercent, label: strings.winPercent },
    { value: stats.currentStreak, label: strings.currentStreak },
    { value: stats.maxStreak, label: strings.maxStreak },
  ];

  return (
    <View style={styles.wrap}>
      {finished && (
        <View
          style={[
            styles.banner,
            {
              backgroundColor: gameStatus === "won" ? "rgba(34,197,94,0.14)" : "rgba(248,113,113,0.12)",
              borderColor: gameStatus === "won" ? "rgba(34,197,94,0.4)" : "rgba(248,113,113,0.35)",
            },
          ]}
        >
          <Text style={[styles.bannerTitle, { color: p.text }]}>
            {gameStatus === "won" ? strings.youWon : strings.youLost}
          </Text>
          <Text style={[styles.bannerSub, { color: p.textMuted }]}>
            {gameStatus === "won" && highlight
              ? strings.guessedIn(highlight)
              : `${strings.theWordWas} ${localeUpper(secretWord, language)}`}
          </Text>
        </View>
      )}

      <View style={styles.summary}>
        {summary.map((s) => (
          <View key={s.label} style={styles.stat}>
            <Text style={[styles.statValue, { color: p.text }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: p.textMuted }]} numberOfLines={1} adjustsFontSizeToFit>
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.distTitle, { color: p.textMuted }]}>{strings.guessDistribution}</Text>
      <View style={styles.dist}>
        {[1, 2, 3, 4, 5, 6].map((n) => {
          const count = stats.guessDistribution[n] ?? 0;
          const pct = Math.max(8, (count / maxCount) * 100);
          return (
            <View key={n} style={styles.distRow}>
              <Text style={[styles.distIndex, { color: p.textMuted }]}>{n}</Text>
              <View style={styles.distTrack}>
                <View
                  style={[
                    styles.distBar,
                    { width: `${pct}%`, backgroundColor: highlight === n ? p.correct : p.absent },
                  ]}
                >
                  <Text style={[styles.distCount, { color: highlight === n ? p.correctText : p.text }]}>{count}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {finished && (
        <Pressable onPress={onNewGame} accessibilityRole="button" style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
          <LinearGradient
            colors={[p.accent, p.accent2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.newGame}
          >
            <Text style={styles.newGameText}>{strings.newGame}</Text>
          </LinearGradient>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 16 },
  banner: { borderRadius: 16, borderWidth: 1, padding: 14, alignItems: "center", gap: 4 },
  bannerTitle: { fontSize: 19, fontWeight: "800" },
  bannerSub: { fontSize: 14 },
  summary: { flexDirection: "row" },
  stat: { flex: 1, alignItems: "center", gap: 2 },
  statValue: { fontSize: 26, fontWeight: "800" },
  statLabel: { fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4 },
  distTitle: { fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  dist: { gap: 5 },
  distRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  distIndex: { width: 12, fontSize: 13, fontWeight: "600" },
  distTrack: { flex: 1 },
  distBar: { minWidth: 26, borderRadius: 5, paddingHorizontal: 8, paddingVertical: 3, alignItems: "flex-end" },
  distCount: { fontSize: 13, fontWeight: "700" },
  newGame: { borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  newGameText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
