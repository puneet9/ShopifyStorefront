import { StyleSheet } from 'react-native';
import { ThemeColors } from '../context/ThemeContext';

export const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.placeholder,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.placeholder,
  },
  imageFallbackText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.placeholder,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    color: colors.text,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.primary,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  descriptionParagraph: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  variantsContainer: {
    marginBottom: 24,
    marginTop: 8,
  },
  variantsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  variantsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  expandIcon: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  expandIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  variantItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 10,
    marginBottom: 10,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  variantItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  variantTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  variantTitleSelected: {
    color: '#FFFFFF',
  },
  variantTitleUnavailable: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addToCartButton: {
    borderRadius: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 64,
    height: 64,
  },
  addToCartGradient: {
    paddingVertical: 0,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    minHeight: 64,
    height: 64,
    justifyContent: 'center',
  },
  addToCartButtonLoading: {
    opacity: 0.8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
