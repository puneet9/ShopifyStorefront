import React, { useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmDanger?: boolean;
}

const baseStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  btnSpacing: {
    marginRight: 12,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  btnTextCancel: {
    fontSize: 15,
    fontWeight: '600',
  },
  btnTextConfirm: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  confirmDanger,
}) => {
  const { colors } = useTheme();
  const themedStyles = useMemo(
    () => ({
      card: [baseStyles.card, { backgroundColor: colors.surface, borderColor: colors.border }],
      title: [baseStyles.title, { color: colors.text }],
      message: [baseStyles.message, { color: colors.textSecondary }],
      btnCancel: [baseStyles.btn, { backgroundColor: colors.placeholder }],
      btnConfirm: [baseStyles.btn, { backgroundColor: confirmDanger ? colors.error : colors.primary }],
      btnTextCancel: [baseStyles.btnTextCancel, { color: colors.text }],
      btnTextConfirm: [baseStyles.btnTextConfirm, { color: confirmDanger ? '#FFF' : '#000' }],
    }),
    [colors, confirmDanger]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={baseStyles.overlay}>
          <View style={themedStyles.card} onStartShouldSetResponder={() => true}>
            <Text style={themedStyles.title}>{title}</Text>
            <Text style={themedStyles.message}>{message}</Text>
            <View style={baseStyles.row}>
              <TouchableOpacity
                style={[themedStyles.btnCancel, baseStyles.btnSpacing]}
                onPress={onCancel}
                accessibilityRole="button"
                accessibilityLabel={cancelLabel}
              >
                <Text style={themedStyles.btnTextCancel}>{cancelLabel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={themedStyles.btnConfirm}
                onPress={onConfirm}
                accessibilityRole="button"
                accessibilityLabel={confirmLabel}
              >
                <Text style={themedStyles.btnTextConfirm}>{confirmLabel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
