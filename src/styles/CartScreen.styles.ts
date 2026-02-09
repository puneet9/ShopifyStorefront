import { StyleSheet } from 'react-native';
import { ThemeColors } from '../context/ThemeContext';

export const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexGrow: 1,
  },
  cartItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: colors.placeholder,
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  variantName: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  actionsContainer: {
    justifyContent: 'space-between',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: 8,
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  quantityInput: {
    width: 40,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    padding: 0,
  },
  removeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-end',
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.error,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  clearButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  clearText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
});