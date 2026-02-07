import axios from 'axios';
import { ShopifyProduct, Product, ProductVariant } from '../types';

const API_URL =
  'https://gist.githubusercontent.com/agorovyi/40dcd166a38b4d1e9156ad66c87111b7/raw/36f1c815dd83ed8189e55e6e6619b5d7c7c4e7d6/testProducts.json';

interface ProductsResponse {
  products: ShopifyProduct[];
}

// Mock data for testing when API is unavailable
const MOCK_PRODUCTS: ShopifyProduct[] = [
  {
    id: '1',
    title: 'Classic T-Shirt',
    bodyHtml: '<p>Comfortable and durable classic t-shirt made from 100% organic cotton. Perfect for everyday wear.</p>',
    images: [
      {
        id: '1',
        src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      },
    ],
    variants: [
      {
        id: 'v1',
        title: 'Small',
        price: '29.99',
        available: true,
        image_id: '1',
      },
      {
        id: 'v2',
        title: 'Medium',
        price: '29.99',
        available: true,
        image_id: '1',
      },
      {
        id: 'v3',
        title: 'Large',
        price: '29.99',
        available: true,
        image_id: '1',
      },
      {
        id: 'v4',
        title: 'XL',
        price: '29.99',
        available: false,
        image_id: '1',
      },
    ],
  },
  {
    id: '2',
    title: 'Denim Jacket',
    bodyHtml: '<p>Premium denim jacket with timeless style. Features multiple pockets and adjustable cuffs.</p>',
    images: [
      {
        id: '2',
        src: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop',
      },
    ],
    variants: [
      {
        id: 'v5',
        title: 'Small',
        price: '89.99',
        available: true,
        image_id: '2',
      },
      {
        id: 'v6',
        title: 'Medium',
        price: '89.99',
        available: true,
        image_id: '2',
      },
      {
        id: 'v7',
        title: 'Large',
        price: '89.99',
        available: true,
        image_id: '2',
      },
    ],
  },
  {
    id: '3',
    title: 'Sneakers',
    bodyHtml: '<p>Lightweight and comfortable sneakers perfect for running and casual wear.</p>',
    images: [
      {
        id: '3',
        src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      },
    ],
    variants: [
      {
        id: 'v8',
        title: 'Size 7',
        price: '79.99',
        available: true,
        image_id: '3',
      },
      {
        id: 'v9',
        title: 'Size 8',
        price: '79.99',
        available: true,
        image_id: '3',
      },
      {
        id: 'v10',
        title: 'Size 9',
        price: '79.99',
        available: true,
        image_id: '3',
      },
      {
        id: 'v11',
        title: 'Size 10',
        price: '79.99',
        available: false,
        image_id: '3',
      },
    ],
  },
  {
    id: '4',
    title: 'Summer Shorts',
    bodyHtml: '<p>Breathable shorts perfect for summer. Made from quick-dry material.</p>',
    images: [
      {
        id: '4',
        src: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=500&fit=crop',
      },
    ],
    variants: [
      {
        id: 'v12',
        title: 'Small',
        price: '34.99',
        available: true,
        image_id: '4',
      },
      {
        id: 'v13',
        title: 'Medium',
        price: '34.99',
        available: true,
        image_id: '4',
      },
      {
        id: 'v14',
        title: 'Large',
        price: '34.99',
        available: true,
        image_id: '4',
      },
    ],
  },
  {
    id: '5',
    title: 'Wool Sweater',
    bodyHtml: '<p>Cozy wool sweater perfect for fall and winter. Available in multiple colors.</p>',
    images: [
      {
        id: '5',
        src: 'https://images.unsplash.com/photo-1580318684555-73cf9e9b1fe8?w=500&h=500&fit=crop',
      },
    ],
    variants: [
      {
        id: 'v15',
        title: 'Small',
        price: '59.99',
        available: true,
        image_id: '5',
      },
      {
        id: 'v16',
        title: 'Medium',
        price: '59.99',
        available: true,
        image_id: '5',
      },
      {
        id: 'v17',
        title: 'Large',
        price: '59.99',
        available: true,
        image_id: '5',
      },
    ],
  },
  {
    id: '6',
    title: 'Canvas Backpack',
    bodyHtml: '<p>Durable canvas backpack with multiple compartments. Great for travel and daily use.</p>',
    images: [
      {
        id: '6',
        src: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
      },
    ],
    variants: [
      {
        id: 'v18',
        title: 'Standard',
        price: '49.99',
        available: true,
        image_id: '6',
      },
      {
        id: 'v19',
        title: 'Large',
        price: '54.99',
        available: true,
        image_id: '6',
      },
    ],
  },
];

const transformProduct = (shopifyProduct: ShopifyProduct): Product => {
  const mainImage = shopifyProduct.images[0] || { src: '' };

  const variants: ProductVariant[] = shopifyProduct.variants.map(
    (variant) => {
      const variantImage = shopifyProduct.images.find(
        (img) => img.id === variant.image_id
      ) || mainImage;

      return {
        id: variant.id.toString(),
        title: variant.title,
        price: variant.price,
        available: variant.available,
        image: {
          src: variantImage.src,
        },
      };
    }
  );

  return {
    id: shopifyProduct.id.toString(),
    title: shopifyProduct.title,
    description: shopifyProduct.bodyHtml,
    image: mainImage,
    variants,
  };
};

export const productService = {
  async fetchProducts(): Promise<Product[]> {
    try {
      const response = await axios.get<ProductsResponse>(API_URL);
      return response.data.products.map(transformProduct);
    } catch (error) {
      console.warn('API fetch failed, using mock data:', error);
      // Fallback to mock data if API is unavailable
      return MOCK_PRODUCTS.map(transformProduct);
    }
  },
};
