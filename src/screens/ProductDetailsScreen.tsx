import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCart } from '../context/CartContext';
import { Product, ProductVariant } from '../types';
import { CollectionStackParamList } from '../types';

type Props = NativeStackScreenProps<
  CollectionStackParamList,
  'ProductDetails'
>;

const ProductDetailsScreen: React.FC<Props> = ({ route }) => {
  const { product } = route.params;
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0]
  );
  const [expandedVariants, setExpandedVariants] = useState(false);

  const handleAddToCart = useCallback(() => {
    addItem(product.id, product.title, selectedVariant);
  }, [addItem, product.id, product.title, selectedVariant]);

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

  const defaultVariant = product.variants[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: selectedVariant.image?.src || product.image.src }}
            style={styles.image}
            accessibilityIgnoresInvertColors
          />
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          <Text
            style={styles.title}
            accessibilityRole="header"
            accessibilityLevel={1}
          >
            {product.title}
          </Text>

          <Text style={styles.price} accessibilityRole="header">
            ${selectedVariant.price}
          </Text>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel} accessibilityRole="header">
              Description
            </Text>
            <Text
              style={styles.description}
              selectable
              accessibilityLiveRegion="polite"
            >
              {product.description.replace(/<[^>]*>/g, '')}
            </Text>
          </View>

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
          ]}
          onPress={handleAddToCart}
          disabled={!selectedVariant.available}
          accessibilityRole="button"
          accessibilityLabel={`Add ${product.title} to cart`}
          accessibilityHint="Double tap to add this product to your shopping cart"
        >
          <Text style={styles.addToCartText}>
            {selectedVariant.available ? 'Add to Cart' : 'Out of Stock'}
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
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetailsScreen;
