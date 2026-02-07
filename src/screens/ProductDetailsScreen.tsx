import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCart } from '../context/CartContext';
import { Product, ProductVariant } from '../types';
import { CollectionStackParamList } from '../types';

type Props = NativeStackScreenProps<
  CollectionStackParamList,
  'ProductDetails'
>;

const ProductDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { product } = route.params;
  const { addItem } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedSuccessfully, setAddedSuccessfully] = useState(false);
  
  // Ensure we have at least one variant
  const defaultVariant = product.variants && product.variants.length > 0 
    ? product.variants[0] 
    : {
        id: 'default',
        title: 'Default',
        price: '0.00',
        available: true,
        image: product.image,
      };
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    defaultVariant
  );
  const [expandedVariants, setExpandedVariants] = useState(false);

  const handleAddToCart = useCallback(() => {
    if (isAddingToCart) return;
    
    try {
      setIsAddingToCart(true);
      console.log('Adding to cart:', {
        productId: product.id,
        productTitle: product.title,
        variant: selectedVariant,
      });
      addItem(product.id, product.title, selectedVariant);
      
      // Show success feedback
      setAddedSuccessfully(true);
      
      // Alert user with option to go to cart
      Alert.alert(
        'Success!',
        'Item added to cart. View your cart?',
        [
          {
            text: 'Continue Shopping',
            onPress: () => {
              setAddedSuccessfully(false);
              setIsAddingToCart(false);
            },
            style: 'default',
          },
          {
            text: 'Go to Cart',
            onPress: () => {
              setAddedSuccessfully(false);
              setIsAddingToCart(false);
              // Navigate to cart screen (parent tab navigator)
              navigation.getParent()?.navigate('Cart' as any);
            },
            style: 'default',
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart. Please try again.');
      setIsAddingToCart(false);
    }
  }, [addItem, product.id, product.title, selectedVariant, isAddingToCart, navigation]);

  const toggleVariants = useCallback(() => {
    setExpandedVariants(!expandedVariants);
  }, [expandedVariants]);

  const renderVariantItem = ({ item }: { item: ProductVariant }) => {
    const isSelected = item.id === selectedVariant.id;
    const isUnavailable = !item.available;

    return (
      <TouchableOpacity
        style={[
          styles.variantItem,
          isSelected && styles.variantItemSelected,
        ]}
        onPress={() => !isUnavailable && setSelectedVariant(item)}
        disabled={isUnavailable}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected, disabled: isUnavailable }}
        accessibilityLabel={`${item.title}${isUnavailable ? ', unavailable' : ''}, $${item.price}`}
      >
        <Text
          style={[
            styles.variantTitle,
            isSelected && styles.variantTitleSelected,
            isUnavailable && styles.variantTitleUnavailable,
          ]}
        >
          {item.title}
        </Text>
        {isUnavailable && (
          <Text style={styles.unavailableBadge}>Unavailable</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: selectedVariant.image?.url || product.image.url }}
            style={styles.image}
            accessibilityIgnoresInvertColors
          />
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          <Text
            style={styles.title}
          >
            {product.title}
          </Text>

          <Text style={styles.price}>
            ${selectedVariant.price}
          </Text>

          {/* Description */}
          {product.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>
                Description
              </Text>
              <Text
                style={styles.description}
                selectable
                accessibilityLiveRegion="polite"
              >
                {product.description}
              </Text>
            </View>
          )}

          {/* Variant Selection */}
          {product.variants.length > 1 && (
            <View style={styles.variantsContainer}>
              <TouchableOpacity
                style={styles.variantsHeader}
                onPress={toggleVariants}
                accessibilityRole="button"
                accessibilityState={{ expanded: expandedVariants }}
                accessibilityLabel={`Variant options, ${expandedVariants ? 'expanded' : 'collapsed'}`}
              >
                <Text style={styles.variantsLabel}>
                  Select Variant
                </Text>
                <Text
                  style={[
                    styles.expandIcon,
                    expandedVariants && styles.expandIconRotated,
                  ]}
                >
                  ▼
                </Text>
              </TouchableOpacity>

              {expandedVariants && (
                <View
                  style={styles.variantsList}
                  accessibilityRole="list"
                  accessibilityLabel="Available variants"
                >
                  <FlatList
                    data={product.variants}
                    renderItem={renderVariantItem}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    nestedScrollEnabled={false}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            !selectedVariant.available && styles.addToCartButtonDisabled,
            isAddingToCart && styles.addToCartButtonLoading,
            addedSuccessfully && styles.addToCartButtonSuccess,
          ]}
          onPress={handleAddToCart}
          disabled={!selectedVariant.available || isAddingToCart}
          accessibilityRole="button"
          accessibilityLabel={`Add ${product.title} to cart`}
          accessibilityHint="Double tap to add this product to your shopping cart"
        >
          <Text style={styles.addToCartText}>
            {addedSuccessfully
              ? '✓ Added to Cart!'
              : isAddingToCart
              ? 'Adding...'
              : selectedVariant.available
              ? 'Add to Cart'
              : 'Out of Stock'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#000',
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  variantsContainer: {
    marginBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  variantsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  variantsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  expandIcon: {
    fontSize: 12,
    color: '#666',
  },
  expandIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  variantsList: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  variantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  variantItemSelected: {
    borderColor: '#000',
    backgroundColor: '#f5f5f5',
  },
  variantTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },
  variantTitleSelected: {
    fontWeight: '700',
  },
  variantTitleUnavailable: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  unavailableBadge: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addToCartButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  addToCartButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addToCartButtonLoading: {
    backgroundColor: '#666',
    opacity: 0.8,
  },
  addToCartButtonSuccess: {
    backgroundColor: '#4CAF50',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetailsScreen;
