import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { productService } from '../services/api';
import { Product, getFirstAvailableVariant } from '../types';
import { CollectionStackParamList } from '../types';
import { getStyles } from '../styles/ProductListScreen.styles';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<
  CollectionStackParamList,
  'ProductList'
>;

const ProductListScreen: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const { width: screenWidth } = Dimensions.get('window');
  const cardGap = 12;
  const horizontalPadding = 16;
  const itemWidth = (screenWidth - horizontalPadding * 2 - cardGap) / 2;

  const fetchProducts = useCallback(async (
    options: { forceRefresh?: boolean; showLoading?: boolean } = {}
  ) => {
    const { forceRefresh = false, showLoading = true } = options;
    try {
      if (showLoading) setLoading(true);
      setError(null);
      const data = await productService.fetchProducts({ forceRefresh });
      if (data.length === 0) {
        setError('No products available');
      }
      setProducts(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to load products: ${errorMsg}`);
      console.error('Product fetch error:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts({ forceRefresh: true, showLoading: false });
    setRefreshing(false);
  }, [fetchProducts]);

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetails', {
        productId: product.id,
        product,
      });
    },
    [navigation]
  );

  const renderListHeader = useCallback(
    () => (
      <>
        <View style={[styles.heroWrapper, styles.heroWrapperNegativeMargin]}>
          <View style={styles.heroContainer}>
            <Image
              source={{
                uri:
                  products[0]?.image?.url ||
                  'https://cdn.shopify.com/s/files/1/0654/2458/8973/files/107112-hoodie-mockup_1180x400.png.jpg?v=1719328890',
              }}
              style={styles.heroImage}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
            />
          </View>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Shop Collection
          </Text>
          <Text style={styles.sectionDescription}>
            Uniting comfort and style with premium materials.
          </Text>
        </View>
      </>
    ),
    [products, styles]
  );

  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => {
      const defaultVariant = getFirstAvailableVariant(item);
      const price = defaultVariant?.price || '0';
      const priceNumber = Number.parseFloat(price);
      const displayPrice = Number.isFinite(priceNumber) ? priceNumber.toFixed(2) : '0.00';

      return (
        <TouchableOpacity
          style={[styles.productItem, { width: itemWidth }]}
          onPress={() => handleProductPress(item)}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`${item.title}, $${displayPrice}`}
          accessibilityHint="Double tap to view product details"
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.image.url }}
              style={styles.image}
              accessibilityIgnoresInvertColors
            />
          </View>
          <View style={styles.productInfo}>
            <Text
              style={styles.title}
              numberOfLines={2}
              accessibilityLiveRegion="polite"
            >
              {item.title}
            </Text>
            <Text style={styles.price}>${displayPrice}</Text>
          </View>
        </TouchableOpacity>
      );
    },
    [styles, itemWidth, handleProductPress]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchProducts()}
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={styles.scrollContent}
        initialNumToRender={6}
        windowSize={7}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews
        accessibilityRole="list"
        accessibilityLabel="Product list"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
};

export default ProductListScreen;
