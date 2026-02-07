import { CartItem, ProductVariant } from '../src/types';

// Helper function to calculate total price
export const calculateTotalPrice = (items: CartItem[]): string => {
  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.price);
    return sum + price * item.quantity;
  }, 0);

  return total.toFixed(2);
};

// Helper function to add item to cart
export const addItemToCart = (
  items: CartItem[],
  productId: string,
  productTitle: string,
  variant: ProductVariant
): CartItem[] => {
  const existingItem = items.find(
    (item) => item.productId === productId && item.variantId === variant.id
  );

  if (existingItem) {
    return items.map((item) =>
      item.productId === productId && item.variantId === variant.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }

  return [
    ...items,
    {
      productId,
      variantId: variant.id,
      productTitle,
      variantTitle: variant.title,
      price: variant.price,
      image: variant.image || { url: '' },
      quantity: 1,
    },
  ];
};

// Helper function to remove item from cart
export const removeItemFromCart = (
  items: CartItem[],
  productId: string,
  variantId: string
): CartItem[] => {
  return items.filter(
    (item) => !(item.productId === productId && item.variantId === variantId)
  );
};

// Helper function to update quantity
export const updateItemQuantity = (
  items: CartItem[],
  productId: string,
  variantId: string,
  quantity: number
): CartItem[] => {
  if (quantity <= 0) {
    return removeItemFromCart(items, productId, variantId);
  }

  return items.map((item) =>
    item.productId === productId && item.variantId === variantId
      ? { ...item, quantity }
      : item
  );
};
