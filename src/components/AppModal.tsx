import type { ReactNode } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeContext";

interface AppModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function AppModal({ visible, title, onClose, children }: AppModalProps) {
  const p = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={[styles.overlay, { backgroundColor: p.overlay }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        <SafeAreaView style={styles.center} pointerEvents="box-none">
          <View style={[styles.card, { backgroundColor: p.surface, borderColor: p.border }]}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: p.text }]}>{title}</Text>
              <Pressable onPress={onClose} hitSlop={10} accessibilityRole="button" accessibilityLabel="Close">
                <Text style={[styles.close, { color: p.textMuted }]}>✕</Text>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1 },
  center: { flex: 1, justifyContent: "center", paddingHorizontal: 18 },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    maxHeight: "88%",
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    overflow: "hidden",
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 18, paddingBottom: 6 },
  title: { fontSize: 18, fontWeight: "800" },
  close: { fontSize: 18, fontWeight: "600" },
  body: { padding: 18, paddingTop: 8 },
});
