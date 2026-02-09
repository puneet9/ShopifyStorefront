import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CartProvider, useCart } from '../src/context/CartContext';
import { Text, Button } from 'react-native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)),
}));

// Test Component to consume Context
const TestCartComponent = () => {
  const { items, addItem, removeItem, getTotalPrice, updateQuantity } = useCart();

  return (
    <>
      <Text testID="total-price">{getTotalPrice()}</Text>
      <Text testID="item-count">{items.length}</Text>
      {items.map((item) => (
        <Text key={item.variantId} testID={`qty-${item.variantId}`}>
          {item.quantity}
        </Text>
      ))}
      <Button
        title="Add Item"
        onPress={() =>
          addItem('p1', 'Product 1', {
            id: 'v1',
            title: 'Variant 1',
            price: '10.00',
            available: true,
            image: { url: 'img' },
          })
        }
      />
      <Button
        title="Remove Item"
        onPress={() => removeItem('p1', 'v1')}
      />
      <Button
        title="Update Qty"
        onPress={() => updateQuantity('p1', 'v1', 3)}
      />
    </>
  );
};

describe('CartContext Logic', () => {
  it('adds items and calculates total price correctly', async () => {
    const { getByTestId, getByText } = render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    // Initial state
    await waitFor(() => {
      expect(getByTestId('total-price').props.children).toBe('0.00');
    });

    // Add Item
    fireEvent.press(getByText('Add Item'));
    await waitFor(() => {
      expect(getByTestId('total-price').props.children).toBe('10.00');
      expect(getByTestId('item-count').props.children).toBe(1);
    });

    // Add Same Item (should increase quantity, not list length)
    fireEvent.press(getByText('Add Item'));
    await waitFor(() => {
      expect(getByTestId('total-price').props.children).toBe('20.00');
      expect(getByTestId('item-count').props.children).toBe(1);
      expect(getByTestId('qty-v1').props.children).toBe(2);
    });
  });

  it('removes items correctly', async () => {
    const { getByTestId, getByText } = render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    // Add then Remove
    fireEvent.press(getByText('Add Item'));
    await waitFor(() => {
      expect(getByTestId('item-count').props.children).toBe(1);
    });
    
    fireEvent.press(getByText('Remove Item'));
    await waitFor(() => {
      expect(getByTestId('item-count').props.children).toBe(0);
      expect(getByTestId('total-price').props.children).toBe('0.00');
    });
  });
});
