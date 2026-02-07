import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  AccessibilityInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { productService } from '../services/api';
import { Product } from '../types';
import { CollectionStackParamList } from '../types';

type Props = NativeStackScreenProps<
  CollectionStackParamList,
  'ProductList'
>;

const ProductListScreen: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const windowWidth = Dimensions.get('window').width;
  const itemWidth = windowWidth / 2 - 8;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.fetchProducts();
      console.log('Products loaded:', data.length, 'products');
      if (data.length === 0) {
        setError('No products available');
      }
      setProducts(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to load products: ${errorMsg}`);
      console.error('Product fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetails', {
        productId: product.id,
        product,
      });
    },
    [navigation]
  );

  const renderProductItem = ({ item }: { item: Product }) => {
    const defaultVariant = item.variants[0];
    const price = defaultVariant?.price || 'N/A';

    return (
      <TouchableOpacity
        style={[styles.productItem, { width: itemWidth }]}
        onPress={() => handleProductPress(item)}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, ${price}`}
        accessibilityHint="Double tap to view product details"
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image.url }}
            style={styles.image}
            accessibilityIgnoresInvertColors
          />
        </View>
        <Text
          style={styles.title}
          numberOfLines={2}
          accessibilityLiveRegion="polite"
        >
          {item.title}
        </Text>
        <Text style={styles.price}>
          ${price}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchProducts}
            accessibilityRole="button"
            accessibilityLabel="Retry loading products"
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.contentContainer}
        accessibilityRole="list"
        accessibilityLabel="Product list"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  productItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingTop: 8,
    color: '#000',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 8,
    color: '#000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProductListScreen;
