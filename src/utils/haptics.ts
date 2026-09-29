import * as Haptics from "expo-haptics";

export type HapticKind = "key" | "error" | "success" | "submit";

/** Fire-and-forget haptics; never throws (unsupported devices just no-op). */
export function haptic(kind: HapticKind, enabled: boolean): void {
  if (!enabled) return;
  try {
    switch (kind) {
      case "key":
        void Haptics.selectionAsync();
        break;
      case "submit":
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "error":
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case "success":
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
    }
  } catch {
    // ignore
  }
}
