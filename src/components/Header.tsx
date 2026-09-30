import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Language } from "../types";
import { t } from "../i18n/strings";
import { useTheme } from "../theme/ThemeContext";

interface HeaderProps {
  language: Language;
  onStats: () => void;
  onSettings: () => void;
  onNewGame: () => void;
}

export function Header({ language, onStats, onSettings, onNewGame }: HeaderProps) {
  const p = useTheme();
  const strings = t(language);

  const IconButton = ({ icon, onPress, label }: { icon: string; onPress: () => void; label: string }) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => [styles.icon, { backgroundColor: pressed ? p.surfaceAlt : "transparent" }]}
    >
      <Text style={styles.iconText}>{icon}</Text>
    </Pressable>
  );

  return (
    <View style={[styles.header, { borderBottomColor: p.border }]}>
      <View style={[styles.side, { justifyContent: "flex-start" }]}>
        <Pressable
          onPress={onNewGame}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.newGame,
            { borderColor: p.borderStrong, backgroundColor: pressed ? p.surfaceAlt : "transparent" },
          ]}
        >
          <Text style={[styles.newGameText, { color: p.textMuted }]}>{strings.newGame}</Text>
        </Pressable>
      </View>
      <Text style={[styles.title, { color: p.accent }]}>{strings.title}</Text>
      <View style={[styles.side, { justifyContent: "flex-end" }]}>
        <IconButton icon="📊" onPress={onStats} label={strings.statistics} />
        <IconButton icon="⚙️" onPress={onSettings} label={strings.settings} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  side: { flex: 1, flexDirection: "row", alignItems: "center", gap: 2 },
  title: { fontSize: 20, fontWeight: "900", letterSpacing: 3 },
  icon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  iconText: { fontSize: 19 },
  newGame: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6 },
  newGameText: { fontSize: 10, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.4 },
});
