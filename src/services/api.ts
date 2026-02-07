import axios from 'axios';
import { Product, ProductVariant } from '../types';

const API_URL = 'https://gist.githubusercontent.com/agorovyi/40dcd166a38b4d1e9156ad66c87111b7/raw/36f1c815dd83ed8189e55e6e6619b5d7c7c4e7d6/testProducts.json';

const transformProduct = (shopifyProduct: any): Product => {
  const mainImage = shopifyProduct.images?.[0];
  const imageUrl = mainImage?.url || 'https://via.placeholder.com/500?text=No+Image';

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

export const productService = {
  async fetchProducts(): Promise<Product[]> {
    try {
      const response = await axios.get(API_URL);
      const products = Array.isArray(response.data) ? response.data : response.data.products || [];

      if (!products || products.length === 0) {
        console.warn('No products in API response');
        return [];
      }

      const transformedProducts = products.map((p: any) => {
        const transformed = transformProduct(p);
        console.log('Transformed product:', {
          id: transformed.id,
          title: transformed.title,
          variantsCount: transformed.variants.length,
          firstVariant: transformed.variants[0],
        });
        return transformed;
      }).filter((p: Product) => p.id);
      
      console.log('Total transformed products:', transformedProducts.length);
      return transformedProducts;
    } catch (error) {
      console.error('API fetch error:', error);
      return [];
    }
  },
};
