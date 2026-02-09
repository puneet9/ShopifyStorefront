import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, ProductVariant } from '../types';
import { StorageError } from '../types/errors';

interface CartContextType {
  items: CartItem[];
  addItem: (
    productId: string,
    productTitle: string,
    variant: ProductVariant
  ) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number
  ) => void;
  getTotalPrice: () => string;
  clearCart: () => void;
}

const CART_STORAGE_KEY = '@shopify_storefront_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          try {
            const parsedCart = JSON.parse(storedCart);
            if (Array.isArray(parsedCart)) {
              setItems(parsedCart);
            } else {
              throw new Error('Invalid cart data format');
            }
          } catch (parseError) {
            throw new StorageError('Failed to parse cart data', 'load', parseError);
          }
        }
      } catch {
        return;
      } finally {
        setIsLoaded(true);
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const saveCart = async () => {
        try {
          await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch {
          return;
        }
      };
      
      saveCart();
    }
  }, [items, isLoaded]);

  const addItem = useCallback(
    (productId: string, productTitle: string, variant: ProductVariant) => {
      setItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.productId === productId && item.variantId === variant.id
        );

        if (existingItem) {
          return prevItems.map((item) =>
            item.productId === productId && item.variantId === variant.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [
          ...prevItems,
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
      });
    },
    []
  );

  const removeItem = useCallback(
    (productId: string, variantId: string) => {
      setItems((prevItems) =>
        prevItems.filter(
          (item) => !(item.productId === productId && item.variantId === variantId)
        )
      );
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, variantId);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeItem]
  );

  const getTotalPrice = useCallback(() => {
    const total = items.reduce((sum, item) => {
      const price = parseFloat(item.price);
      return sum + price * item.quantity;
    }, 0);

    return total.toFixed(2);
  }, [items]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    getTotalPrice,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
