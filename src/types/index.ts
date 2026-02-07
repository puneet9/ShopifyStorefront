export interface ProductVariant {
  id: string;
  title: string;
  price: string;
  available: boolean;
  image?: {
    src: string;
  };
}

export interface Product {
  id: string;
  title: string;
  description: string;
  image: {
    src: string;
  };
  variants: ProductVariant[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  productTitle: string;
  variantTitle: string;
  price: string;
  image: {
    src: string;
  };
  quantity: number;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  bodyHtml: string;
  images: Array<{
    id: string;
    src: string;
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: string;
    available: boolean;
    image_id: string | null;
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
