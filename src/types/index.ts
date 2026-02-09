export interface ProductVariant {
  id: string;
  title: string;
  price: string;
  available: boolean;
  image?: {
    url: string;
  };
}

export interface Product {
  id: string;
  title: string;
  description: string;
  image: {
    url: string;
  };
  variants: ProductVariant[];
}

/** Returns the first available-for-sale variant, or the first variant if none available */
export function getFirstAvailableVariant(product: Product): ProductVariant | undefined {
  const available = product.variants.find((v) => v.available);
  return available ?? product.variants[0];
}

export interface CartItem {
  productId: string;
  variantId: string;
  productTitle: string;
  variantTitle: string;
  price: string;
  image: {
    url: string;
  };
  quantity: number;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  bodyHtml?: string;
  descriptionHtml?: string;
  images: Array<{
    id: string;
    url: string;
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: string | { amount: string; currencyCode: string };
    availableForSale: boolean;
    image?: {
      id: string;
      url: string;
    };
  }>;
}

export type CollectionStackParamList = {
  ProductList: undefined;
  ProductDetails: {
    productId: string;
    product: Product;
  };
};

export type RootTabParamList = {
  Collection: undefined;
  Cart: undefined;
};

export type RootStackParamList = {
  Root: undefined;
};
