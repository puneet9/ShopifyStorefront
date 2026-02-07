import axios from 'axios';
import { ShopifyProduct, Product, ProductVariant } from '../types';

const API_URL =
  'https://cdn.shopify.com/s/files/1/0533/2089/files/products.json?v=1613490589';

interface ProductsResponse {
  products: ShopifyProduct[];
}

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
      console.error('Error fetching products:', error);
      throw error;
    }
  },
};
