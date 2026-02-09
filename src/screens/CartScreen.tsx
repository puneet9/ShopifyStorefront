import React, { useCallback, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types';
import { getStyles } from '../styles/CartScreen.styles';
import { colors } from '../context/ThemeContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';

const CartScreen: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } =
    useCart();
  const insets = useSafeAreaInsets();
  const styles = getStyles(colors);
  const { showToast } = useToast();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleQuantityChange = useCallback(
    (item: CartItem, newQuantity: string) => {
      const quantity = parseInt(newQuantity, 10);
      if (!isNaN(quantity)) {
        updateQuantity(item.productId, item.variantId, quantity);
      }
    },
    [updateQuantity]
  );

  const handleIncrement = useCallback(
    (item: CartItem) => {
      updateQuantity(item.productId, item.variantId, item.quantity + 1);
    },
    [updateQuantity]
  );

  const handleDecrement = useCallback(
    (item: CartItem) => {
      if (item.quantity > 1) {
        updateQuantity(item.productId, item.variantId, item.quantity - 1);
      }
    },
    [updateQuantity]
  );

  const handleRemoveItem = useCallback(
    (item: CartItem) => {
      removeItem(item.productId, item.variantId);
    },
    [removeItem]
  );

  const handleClearCart = useCallback(() => setShowClearConfirm(true), []);
  const handleClearConfirm = useCallback(() => {
    clearCart();
    setShowClearConfirm(false);
    showToast({
      message: 'Cart cleared',
      type: 'success',
    });
  }, [clearCart, showToast]);

  const handleCheckout = useCallback(() => {
    clearCart();
    showToast({
      message: 'Thank you for your purchase!',
      type: 'success',
    });
  }, [clearCart, showToast]);

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View
      style={styles.cartItem}
      accessible={true}
      accessibilityLabel={`${item.productTitle}, ${item.variantTitle}, quantity ${item.quantity}, $${(parseFloat(item.price) * item.quantity).toFixed(2)}`}
    >
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image.url }}
          style={styles.image}
          accessibilityIgnoresInvertColors
        />
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text
          style={styles.productName}
          numberOfLines={2}
        >
          {item.productTitle}
        </Text>
        <Text style={styles.variantName} numberOfLines={1}>
          {item.variantTitle}
        </Text>
        <Text style={styles.price}>
          ${parseFloat(item.price).toFixed(2)}
        </Text>
      </View>

      {/* Quantity & Remove */}
      <View style={styles.actionsContainer}>
        <View style={styles.quantityControl}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleDecrement(item)}
            accessibilityRole="button"
            accessibilityLabel={`Decrease quantity for ${item.productTitle}`}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.quantityInput}
            value={item.quantity.toString()}
            onChangeText={(value) => handleQuantityChange(item, value)}
            keyboardType="number-pad"
            maxLength={3}
            accessibilityLabel="Quantity"
            placeholderTextColor={colors.textSecondary}
            accessibilityRole="adjustable"
          />
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleIncrement(item)}
            accessibilityRole="button"
            accessibilityLabel={`Increase quantity for ${item.productTitle}`}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item)}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${item.productTitle} from cart`}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Your cart is empty</Text>
      <Text style={styles.emptySubtext}>
        Browse products to add items to your cart
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <FlatList
          data={items}
          renderItem={renderCartItem}
          keyExtractor={(item) => `${item.productId}-${item.variantId}`}
          ListEmptyComponent={renderEmptyCart}
          contentContainerStyle={styles.listContent}
          accessibilityRole="list"
          accessibilityLabel="Shopping cart items"
        />

        {/* Footer with Total */}
        {items.length > 0 && (
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalPrice}>${getTotalPrice()}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
              accessibilityRole="button"
              accessibilityLabel="Checkout"
              accessibilityHint="Proceed to checkout"
            >
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearCart}
              accessibilityRole="button"
              accessibilityLabel="Clear cart"
            >
              <Text style={styles.clearText}>Clear Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>

      <ConfirmModal
        visible={showClearConfirm}
        title="Clear Cart"
        message="Are you sure you want to remove all items from your cart?"
        confirmLabel="Clear Cart"
        cancelLabel="Cancel"
        onConfirm={handleClearConfirm}
        onCancel={() => setShowClearConfirm(false)}
        confirmDanger
      />
    </SafeAreaView>
  );
};

export default CartScreen;
