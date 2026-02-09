import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './ThemeContext';
import { AppError, createError } from '../types/errors';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastConfig {
  message: string;
  type?: ToastType;
  action?: { label: string; onPress: () => void };
  duration?: number;
  persistent?: boolean; // Don't auto-dismiss
}

interface ToastContextType {
  showToast: (config: ToastConfig) => void;
  showError: (error: AppError | Error, retryAction?: () => void) => void;
  showNetworkError: (retryAction?: () => void) => void;
  showValidationError: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
  showError: () => {},
  showNetworkError: () => {},
  showValidationError: () => {},
});

const TOAST_DURATION = 3000;

const ToastBanner: React.FC<{
  message: string;
  type: ToastType;
  action?: { label: string; onPress: () => void };
  onDismiss: () => void;
  duration: number;
}> = ({ message, type, action, onDismiss, duration }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [anim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.delay(duration),
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss());
  }, [anim, duration, onDismiss]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });
  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const bgColor = type === 'error' ? colors.error : type === 'success' ? colors.success : colors.surface;
  const textColor = type === 'error' || type === 'success' ? '#FFFFFF' : colors.text;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top,
          backgroundColor: bgColor,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={[styles.message, { color: textColor }]} numberOfLines={2}>
        {message}
      </Text>
      {action && (
        <TouchableOpacity
          onPress={() => {
            onDismiss();
            action.onPress();
          }}
          style={styles.actionBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={[styles.actionText, { color: textColor }]}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 9999,
  },
  message: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  actionBtn: {
    paddingLeft: 16,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<(ToastConfig & { id: number }) | null>(null);

  const showToast = useCallback((config: ToastConfig) => {
    const id = Date.now();
    setToast({
      ...config,
      id,
      type: config.type ?? 'success',
      duration: config.duration ?? TOAST_DURATION,
    });
  }, []);

  const showError = useCallback((error: AppError | Error, retryAction?: () => void) => {
    const appError = createError(error);
    const message = appError.message;
    
    const toastConfig: ToastConfig = {
      message,
      type: 'error',
      duration: 5000,
    };

    if (retryAction) {
      toastConfig.action = {
        label: 'Retry',
        onPress: retryAction,
      };
    }

    showToast(toastConfig);
  }, [showToast]);

  const showNetworkError = useCallback((retryAction?: () => void) => {
    const toastConfig: ToastConfig = {
      message: 'Network connection failed. Please check your internet connection.',
      type: 'error',
      duration: 5000,
    };

    if (retryAction) {
      toastConfig.action = {
        label: 'Retry',
        onPress: retryAction,
      };
    }

    showToast(toastConfig);
  }, [showToast]);

  const showValidationError = useCallback((message: string) => {
    showToast({
      message,
      type: 'warning',
      duration: 3000,
    });
  }, [showToast]);

  const dismiss = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={{ 
      showToast,
      showError,
      showNetworkError,
      showValidationError
    }}>
      <View style={styles.wrapper}>
        {children}
        {toast && (
          <ToastBanner
            message={toast.message}
            type={toast.type || 'success'}
            action={toast.action}
            duration={toast.duration || TOAST_DURATION}
            onDismiss={dismiss}
          />
        )}
      </View>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
