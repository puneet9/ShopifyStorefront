import React, { createContext, useState, useCallback, useContext } from 'react';
import { CartItem, ProductVariant } from '../types';

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

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

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
            image: variant.image || { src: '' },
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
