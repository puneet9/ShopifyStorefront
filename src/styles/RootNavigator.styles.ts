import { StyleSheet } from 'react-native';
import { ThemeColors } from '../context/ThemeContext';

export const getStyles = (colors: ThemeColors) => StyleSheet.create({
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  tabIcon: {
    fontSize: 24,
    lineHeight: 24,
  },
  tabBadge: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  tabBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  shopTabIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  shopTabIconFocused: {
    opacity: 1,
  },
  shopTabIconUnfocused: {
    opacity: 0.5,
  },
  headerLogo: {
    width: 32,
    height: 32,
    borderRadius: 6,
  },
  languageToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    paddingHorizontal: 8,
  },
  languageText: {
    fontSize: 13,
    fontWeight: '600',
  },
  languageSeparator: {
    fontSize: 12,
    marginHorizontal: 4,
  },
  languageTextActive: {
    color: colors.primary,
  },
  languageTextInactive: {
    color: colors.textSecondary,
  },
});
