import axios from 'axios';
import { Product, ProductVariant } from '../types';
import { config } from '../config/env';
import { withNetworkCheck } from '../utils/network';

const transformProduct = (shopifyProduct: any): Product => {
  if (!shopifyProduct) {
    throw new Error('Product data is null or undefined');
  }

  const mainImage = shopifyProduct.images?.[0];
  const imageUrl = mainImage?.url ?? '';

  const variants: ProductVariant[] = (shopifyProduct.variants || []).map((variant: any) => {
    const variantImage = shopifyProduct.images?.find((img: any) => img.id === variant.image?.id);
    const variantImageUrl = variantImage?.url || imageUrl;

    let price = '0.00';
    if (variant.price) {
      if (typeof variant.price === 'object' && variant.price.amount) {
        price = variant.price.amount;
      } else if (typeof variant.price === 'string') {
        price = variant.price;
      }
    }

    return {
      id: variant.id,
      title: variant.title || 'Default',
      price: price,
      available: variant.availableForSale !== false,
      image: {
        url: variantImageUrl,
      },
    };
  });

  const rawDescription = shopifyProduct.descriptionHtml || shopifyProduct.description || '';
  const description = typeof rawDescription === 'string' 
    ? rawDescription.replace(/<[^>]*>/g, '').trim() 
    : '';

  return {
    id: shopifyProduct.id || '',
    title: shopifyProduct.title || 'Untitled',
    description: description || 'No description',
    image: {
      url: imageUrl,
    },
    variants: variants.length > 0 ? variants : [
      {
        id: 'default',
        title: 'Default',
        price: '0.00',
        available: true,
        image: { url: imageUrl },
      },
    ],
  };
};

const CACHE_TTL_MS = 5 * 60 * 1000;
let cachedProducts: Product[] | null = null;
let lastFetchedAt = 0;

export const productService = {
  async fetchProducts(options: { forceRefresh?: boolean } = {}): Promise<Product[]> {
    const { forceRefresh = false } = options;
    const now = Date.now();

    if (!forceRefresh && cachedProducts && now - lastFetchedAt < CACHE_TTL_MS) {
      return cachedProducts;
    }

    try {
      const response = await withNetworkCheck(
        () => axios.get(config.api.baseUrl, { timeout: 10000 }),
        { timeout: 10000, retryCount: 1 }
      );

      const products = Array.isArray(response.data) 
        ? response.data 
        : response.data.products || [];

      if (!products || products.length === 0) {
        return [];
      }

      const transformed = products
        .map((p: any) => {
          try {
            return transformProduct(p);
          } catch {
            return null;
          }
        })
        .filter((p: Product | null): p is Product => p !== null);

      cachedProducts = transformed;
      lastFetchedAt = now;

      return transformed;
    } catch (error) {
      if (cachedProducts) {
        return cachedProducts;
      }
      throw error;
    }
  },
};
