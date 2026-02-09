import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCart } from '../context/CartContext';
import { ProductVariant, getFirstAvailableVariant } from '../types';
import { CollectionStackParamList } from '../types';
import { getStyles } from '../styles/ProductDetailsScreen.styles';
import { colors } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

type Props = NativeStackScreenProps<
  CollectionStackParamList,
  'ProductDetails'
>;

const ProductDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { product } = route.params;
  const { addItem } = useCart();
  const { showToast, showError } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedSuccessfully, setAddedSuccessfully] = useState(false);
  const [variantsExpanded, setVariantsExpanded] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    () => getFirstAvailableVariant(product) ?? product.variants[0] ?? null
  );
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const styles = getStyles(colors);

  useEffect(() => {
    const firstAvailable = getFirstAvailableVariant(product);
    setSelectedVariant(firstAvailable ?? product.variants[0] ?? null);
  }, [product]);

  const handleAddToCart = useCallback(() => {
    if (isAddingToCart || !selectedVariant) return;

    try {
      setIsAddingToCart(true);
      addItem(product.id, product.title, selectedVariant);
      setAddedSuccessfully(true);

      showToast({
        message: 'Added to cart',
        type: 'success',
        action: {
          label: 'Go to Cart',
          onPress: () => navigation.getParent()?.navigate('Cart' as any),
        },
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError(error as Error);
    } finally {
      setIsAddingToCart(false);
      setAddedSuccessfully(false);
    }
  }, [isAddingToCart, selectedVariant, addItem, product.id, product.title, navigation, showToast, showError]);

  const handleVariantSelect = useCallback((variant: ProductVariant) => {
    if (!variant.available) return;
    setSelectedVariant(variant);
  }, []);

  const renderDescription = (text: string) => {
    const cleaned = text.replace(/<[^>]*>/g, '').trim();
    if (!cleaned) return null;

    return cleaned
      .split(/\n\s*\n+/)
      .map((para, index) => (
        <Text key={index} style={styles.descriptionParagraph} selectable>
          {para.trim()}
        </Text>
      ));
  };

  const getGradientColors = () => {
    if (addedSuccessfully) return [colors.success, '#2B8F65'];
    if (isAddingToCart) return ['#5E6C84', '#42526E'];
    if (!selectedVariant || !selectedVariant.available) return ['#DFE1E6', '#C1C7D0'];
    return [colors.primary, '#5B7A6C'];
  };

  const priceNumber = Number.parseFloat(
    selectedVariant?.price ?? getFirstAvailableVariant(product)?.price ?? '0'
  );
  const displayPrice = Number.isFinite(priceNumber) ? priceNumber.toFixed(2) : '0.00';

  const imageUriRaw = selectedVariant?.image?.url || product.image?.url || '';
  const imageUri = typeof imageUriRaw === 'string' ? imageUriRaw.trim() : '';

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (!imageUri) {
      setImageError(true);
      setIsImageLoading(false);
      return;
    }

    setImageError(false);
    setIsImageLoading(true);

    timeoutId = setTimeout(() => {
      setIsImageLoading(false);
    }, 8000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [imageUri]);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView style={styles.scrollView}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {imageUri ? (
            <>
              <Image
                key={imageUri}
                source={{ uri: imageUri }}
                style={styles.image}
                accessibilityIgnoresInvertColors
                onLoadStart={() => setIsImageLoading(true)}
                onLoadEnd={() => setIsImageLoading(false)}
                onError={() => {
                  setIsImageLoading(false);
                  setImageError(true);
                }}
              />
              {imageError && (
                <View style={styles.imageFallback}>
                  <Text style={styles.imageFallbackText}>
                    Image unavailable
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.imageFallback}>
              <Text style={styles.imageFallbackText}>
                Image unavailable
              </Text>
            </View>
          )}
          {isImageLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          <Text
            style={styles.title}
          >
            {product.title}
          </Text>

          <Text style={styles.price}>${displayPrice}</Text>

          {/* Expandable Variant Selection */}
          {product.variants.length > 0 && (
            <View style={styles.variantsContainer}>
              <TouchableOpacity
                style={styles.variantsHeader}
                onPress={() => setVariantsExpanded((prev) => !prev)}
                accessibilityRole="button"
                accessibilityLabel={variantsExpanded ? 'Collapse variants' : 'Expand variants'}
                accessibilityState={{ expanded: variantsExpanded }}
              >
                <Text style={styles.variantsLabel}>Select a Variant</Text>
                <Text style={[styles.expandIcon, variantsExpanded && styles.expandIconRotated]}>▼</Text>
              </TouchableOpacity>
              {variantsExpanded && (
                <View style={styles.optionsRow}>
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    const isAvailable = variant.available;
                    const title = variant.title === 'Default Title' ? 'Default' : variant.title;

                    return (
                      <TouchableOpacity
                        key={variant.id}
                        style={[
                          styles.variantItem,
                          isSelected && styles.variantItemSelected,
                        ]}
                        onPress={() => handleVariantSelect(variant)}
                        disabled={!isAvailable}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected, disabled: !isAvailable }}
                        accessibilityLabel={`${title}${isAvailable ? '' : ', Out of Stock'}`}
                      >
                        <Text
                          style={[
                            styles.variantTitle,
                            isSelected && styles.variantTitleSelected,
                            !isAvailable && styles.variantTitleUnavailable,
                          ]}
                        >
                          {title}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* Description */}
          {product.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>
                Description
              </Text>
              <View>{renderDescription(product.description)}</View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            isAddingToCart && styles.addToCartButtonLoading,
          ]}
          onPress={handleAddToCart}
          disabled={!selectedVariant || !selectedVariant.available || isAddingToCart}
          accessibilityRole="button"
          accessibilityLabel={`Add ${product.title} to cart`}
          accessibilityHint="Double tap to add this product to your shopping cart"
        >
          <LinearGradient
            colors={getGradientColors()}
            style={styles.addToCartGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.addToCartText}>
              {addedSuccessfully
                ? 'Added to cart'
                : isAddingToCart
                ? 'Adding...'
                : !selectedVariant
                ? 'Select a Variant'
                : selectedVariant.available
                ? 'Add to Cart'
                : 'Out of Stock'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetailsScreen;
