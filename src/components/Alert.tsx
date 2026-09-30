import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import type { Palette } from "../theme/theme";

type AlertProps = {
    visible: boolean;
    title: string;
    message: string;
    cancelText: string;
    confirmText: string;
    palette: Palette;
    onCancel: () => void;
    onConfirm: () => void;
};

export function CustomAlert({
    visible,
    title,
    message,
    cancelText,
    confirmText,
    palette,
    onCancel,
    onConfirm,
}: AlertProps) {
    const styles = createStyles(palette);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>{title}</Text>

                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.actions}>
                        <Pressable
                            style={[styles.button, styles.cancelButton]}
                            onPress={onCancel}
                        >
                            <Text style={styles.cancelText}>{cancelText}</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.button, styles.confirmButton]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.confirmText}>{confirmText}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const createStyles = (palette: Palette) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: palette.overlay,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
        },

        container: {
            width: "100%",
            maxWidth: 380,
            backgroundColor: palette.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: palette.border,
            padding: 24,
        },

        title: {
            fontSize: 20,
            fontWeight: "700",
            color: palette.text,
            marginBottom: 10,
        },

        message: {
            fontSize: 16,
            lineHeight: 23,
            color: palette.textMuted,
            marginBottom: 24,
        },

        actions: {
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 10,
        },

        button: {
            minWidth: 90,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 10,
            alignItems: "center",
        },

        cancelButton: {
            backgroundColor: palette.surfaceAlt,
            borderWidth: 1,
            borderColor: palette.border,
        },

        confirmButton: {
            backgroundColor: palette.danger,
        },

        cancelText: {
            color: palette.text,
            fontSize: 15,
            fontWeight: "600",
        },

        confirmText: {
            color: palette.surface,
            fontSize: 15,
            fontWeight: "600",
        },
    });
