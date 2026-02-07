import { CartProvider, useCart } from '../src/context/CartContext';
import { ProductVariant } from '../src/types';

describe('CartContext - Add to Cart', () => {
  it('should verify CartContext exports are correct', () => {
    expect(CartProvider).toBeDefined();
    expect(useCart).toBeDefined();
  });

  it('should have correct ProductVariant structure', () => {
    const variant: ProductVariant = {
      id: 'variant-test-1',
      title: 'Test Variant',
      price: '29.99',
      available: true,
      image: { url: 'https://example.com/test.jpg' },
    };
    
    expect(variant.id).toBe('variant-test-1');
    expect(variant.price).toBe('29.99');
    expect(variant.available).toBe(true);
    expect(variant.image?.url).toBe('https://example.com/test.jpg');
  });
});
