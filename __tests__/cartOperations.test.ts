const calculateTotalPrice = (items: CartItem[]): string => {
  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.price);
    return sum + price * item.quantity;
  }, 0);

  return total.toFixed(2);
};

const addItemToCart = (
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

const removeItemFromCart = (
  items: CartItem[],
  productId: string,
  variantId: string
): CartItem[] => {
  return items.filter(
    (item) => !(item.productId === productId && item.variantId === variantId)
  );
};

const updateItemQuantity = (
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
import { CartItem, ProductVariant } from '../src/types';

describe('Cart Operations', () => {
  const mockVariant: ProductVariant = {
    id: 'variant-1',
    title: 'Small',
    price: '29.99',
    available: true,
    image: { url: 'https://example.com/image.jpg' },
  };

  const mockVariant2: ProductVariant = {
    id: 'variant-2',
    title: 'Large',
    price: '39.99',
    available: true,
    image: { url: 'https://example.com/image2.jpg' },
  };

  const mockCartItem: CartItem = {
    productId: 'product-1',
    variantId: 'variant-1',
    productTitle: 'Test Product',
    variantTitle: 'Small',
    price: '29.99',
    image: { url: 'https://example.com/image.jpg' },
    quantity: 1,
  };

  describe('calculateTotalPrice', () => {
    it('should return 0.00 for empty cart', () => {
      expect(calculateTotalPrice([])).toBe('0.00');
    });

    it('should calculate single item total correctly', () => {
      const items: CartItem[] = [mockCartItem];
      expect(calculateTotalPrice(items)).toBe('29.99');
    });

    it('should calculate multiple items total correctly', () => {
      const items: CartItem[] = [
        mockCartItem,
        { ...mockCartItem, variantId: 'variant-2', price: '39.99' },
      ];
      expect(calculateTotalPrice(items)).toBe('69.98');
    });

    it('should calculate total with quantities correctly', () => {
      const items: CartItem[] = [
        { ...mockCartItem, quantity: 2 },
        { ...mockCartItem, variantId: 'variant-2', price: '39.99', quantity: 3 },
      ];
      expect(calculateTotalPrice(items)).toBe('179.95');
    });

    it('should handle decimal prices correctly', () => {
      const items: CartItem[] = [
        { ...mockCartItem, price: '19.99', quantity: 3 },
      ];
      expect(calculateTotalPrice(items)).toBe('59.97');
    });
  });

  describe('addItemToCart', () => {
    it('should add new item to empty cart', () => {
      const result = addItemToCart([], 'product-1', 'Test Product', mockVariant);
      expect(result).toHaveLength(1);
      expect(result[0].productId).toBe('product-1');
      expect(result[0].quantity).toBe(1);
    });

    it('should add different variant as new item', () => {
      const items: CartItem[] = [mockCartItem];
      const result = addItemToCart(items, 'product-1', 'Test Product', mockVariant2);
      expect(result).toHaveLength(2);
      expect(result[1].variantId).toBe('variant-2');
    });

    it('should increment quantity for existing item', () => {
      const items: CartItem[] = [mockCartItem];
      const result = addItemToCart(items, 'product-1', 'Test Product', mockVariant);
      expect(result).toHaveLength(1);
      expect(result[0].quantity).toBe(2);
    });

    it('should increment quantity multiple times', () => {
      let items: CartItem[] = [];
      items = addItemToCart(items, 'product-1', 'Test Product', mockVariant);
      items = addItemToCart(items, 'product-1', 'Test Product', mockVariant);
      items = addItemToCart(items, 'product-1', 'Test Product', mockVariant);
      expect(items[0].quantity).toBe(3);
    });
  });

  describe('removeItemFromCart', () => {
    it('should remove item from cart', () => {
      const items: CartItem[] = [mockCartItem];
      const result = removeItemFromCart(items, 'product-1', 'variant-1');
      expect(result).toHaveLength(0);
    });

    it('should only remove specified item', () => {
      const items: CartItem[] = [
        mockCartItem,
        { ...mockCartItem, variantId: 'variant-2' },
      ];
      const result = removeItemFromCart(items, 'product-1', 'variant-1');
      expect(result).toHaveLength(1);
      expect(result[0].variantId).toBe('variant-2');
    });

    it('should not affect cart if item not found', () => {
      const items: CartItem[] = [mockCartItem];
      const result = removeItemFromCart(items, 'product-2', 'variant-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('updateItemQuantity', () => {
    it('should update item quantity', () => {
      const items: CartItem[] = [mockCartItem];
      const result = updateItemQuantity(items, 'product-1', 'variant-1', 5);
      expect(result[0].quantity).toBe(5);
    });

    it('should remove item when quantity is 0', () => {
      const items: CartItem[] = [mockCartItem];
      const result = updateItemQuantity(items, 'product-1', 'variant-1', 0);
      expect(result).toHaveLength(0);
    });

    it('should remove item when quantity is negative', () => {
      const items: CartItem[] = [mockCartItem];
      const result = updateItemQuantity(items, 'product-1', 'variant-1', -1);
      expect(result).toHaveLength(0);
    });

    it('should not affect other items', () => {
      const items: CartItem[] = [
        mockCartItem,
        { ...mockCartItem, productId: 'product-2' },
      ];
      const result = updateItemQuantity(items, 'product-1', 'variant-1', 3);
      expect(result).toHaveLength(2);
      expect(result[0].quantity).toBe(3);
      expect(result[1].quantity).toBe(1);
    });
  });
});
