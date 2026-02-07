import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types';

const CartScreen: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } =
    useCart();

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
    <SafeAreaView style={styles.container}>
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
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalPrice}>${getTotalPrice()}</Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutButton}
            accessibilityRole="button"
            accessibilityLabel="Checkout"
            accessibilityHint="Proceed to checkout"
          >
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearCart}
            accessibilityRole="button"
            accessibilityLabel="Clear cart"
          >
            <Text style={styles.clearText}>Clear Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    borderBottomColor: '#e0e0e0',
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
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
    color: '#000',
    marginBottom: 4,
  },
  variantName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  actionsContainer: {
    justifyContent: 'space-between',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  quantityInput: {
    flex: 1,
    textAlign: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 12,
    fontWeight: '600',
  },
  removeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  checkoutButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  clearText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CartScreen;
