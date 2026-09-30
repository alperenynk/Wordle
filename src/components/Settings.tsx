import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import type { Language, Settings as SettingsType } from "../types";
import { t } from "../i18n/strings";
import { useTheme } from "../theme/ThemeContext";
import { HelpContent } from "./HelpContent";

interface SettingsProps {
  settings: SettingsType;
  onUpdate: (patch: Partial<SettingsType>) => void;
  onChangeLanguage: (language: Language) => void;
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const p = useTheme();
  return (
    <View style={[styles.segment, { backgroundColor: p.surfaceAlt }]}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.segmentBtn, active && { backgroundColor: p.surface }]}
          >
            <Text style={[styles.segmentText, { color: active ? p.text : p.textMuted }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Settings({ settings, onUpdate, onChangeLanguage }: SettingsProps) {
  const p = useTheme();
  const strings = t(settings.language);

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: p.text }]}>{strings.language}</Text>
        <Segmented<Language>
          value={settings.language}
          onChange={onChangeLanguage}
          options={[
            { value: "tr", label: "🇹🇷 Türkçe" },
            { value: "en", label: "🇬🇧 English" },
          ]}
        />
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: p.text }]}>{strings.theme}</Text>
        <Segmented<SettingsType["theme"]>
          value={settings.theme}
          onChange={(theme) => onUpdate({ theme })}
          options={[
            { value: "dark", label: strings.dark },
            { value: "light", label: strings.light },
          ]}
        />
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: p.text }]}>{strings.animations}</Text>
        <Switch
          value={settings.animationsEnabled}
          onValueChange={(animationsEnabled) => onUpdate({ animationsEnabled })}
          trackColor={{ false: p.absent, true: p.accent }}
        />
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: p.text }]}>{strings.sound}</Text>
        <Switch
          value={settings.hapticsEnabled}
          onValueChange={(hapticsEnabled) => onUpdate({ hapticsEnabled })}
          trackColor={{ false: p.absent, true: p.accent }}
        />
      </View>
      <View style={[styles.divider, { backgroundColor: p.border }]} />

      <Text style={[styles.sectionTitle, { color: p.textMuted }]}>
        {strings.howToPlay}
      </Text>
      <HelpContent language={settings.language} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 18 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  label: { fontSize: 15, fontWeight: "600" },
  segment: { flexDirection: "row", borderRadius: 10, padding: 3, gap: 2 },
  segmentBtn: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8 },
  segmentText: { fontSize: 13, fontWeight: "700" },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 4 },
  sectionTitle: { fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
});
