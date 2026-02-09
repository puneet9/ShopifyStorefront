import { StyleSheet } from 'react-native';
import { ThemeColors } from '../context/ThemeContext';

export const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroWrapper: {
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  heroWrapperNegativeMargin: {
    marginHorizontal: 16,
  },
  heroContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
    aspectRatio: 16 / 9,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  productItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 4,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.placeholder,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingTop: 12,
    color: colors.text,
    lineHeight: 20,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 4,
    color: colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  productInfo: {
    paddingVertical: 8,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
