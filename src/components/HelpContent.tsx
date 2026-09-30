import { StyleSheet, Text, View } from "react-native";
import type { Language } from "../types";
import { t } from "../i18n/strings";
import { useTheme } from "../theme/ThemeContext";

export function HelpContent({ language }: { language: Language }) {
  const p = useTheme();
  const strings = t(language);
  const rules = [
    { color: p.correct, text: strings.ruleCorrect },
    { color: p.present, text: strings.rulePresent },
    { color: p.absent, text: strings.ruleAbsent },
  ];
  return (
    <View style={styles.wrap}>
      <Text style={[styles.intro, { color: p.text }]}>{strings.rulesIntro}</Text>
      {rules.map((r) => (
        <View key={r.text} style={styles.rule}>
          <View style={[styles.swatch, { backgroundColor: r.color }]} />
          <Text style={[styles.ruleText, { color: p.text }]}>{r.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  intro: { fontSize: 15, lineHeight: 22 },
  rule: { flexDirection: "row", alignItems: "center", gap: 12 },
  swatch: { width: 22, height: 22, borderRadius: 5 },
  ruleText: { flex: 1, fontSize: 14, lineHeight: 20 },
});
