import axios from 'axios';
import { Product, ProductVariant } from '../types';

const API_URL =
  'https://gist.githubusercontent.com/agorovyi/40dcd166a38b4d1e9156ad66c87111b7/raw/36f1c815dd83ed8189e55e6e6619b5d7c7c4e7d6/testProducts.json';

// Transform Shopify API product to app Product type
const transformProduct = (shopifyProduct: any): Product => {
  // Get main image URL
  const mainImage = shopifyProduct.images?.[0];
  const imageUrl = mainImage?.url || 'https://via.placeholder.com/500?text=No+Image';

  // Transform variants
  const variants: ProductVariant[] = (shopifyProduct.variants || []).map((variant: any) => {
    // Get variant image or use main image
    const variantImage = shopifyProduct.images?.find((img: any) => img.id === variant.image?.id);
    const variantImageUrl = variantImage?.url || imageUrl;

    // Extract price - Shopify API uses price.amount
    let price = '0.00';
    if (variant.price) {
      if (typeof variant.price === 'object') {
        price = variant.price.amount || '0.00';
      } else {
        price = variant.price.toString();
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

  // Clean description - remove HTML tags
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

export const productService = {
  async fetchProducts(): Promise<Product[]> {
    try {
      const response = await axios.get(API_URL);
      const products = Array.isArray(response.data) ? response.data : response.data.products || [];

      if (!products || products.length === 0) {
        console.warn('No products in API response');
        return [];
      }

      return products.map(transformProduct).filter((p: Product) => p.id);
    } catch (error) {
      console.error('API fetch error:', error);
      return [];
    }
  },
};
