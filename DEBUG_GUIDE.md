# Add to Cart Debugging Guide

## What's Been Fixed
1. ✅ API data transformation now correctly handles:
   - Image URLs from `images[].url` (not `images[].src`)
   - Prices from `variant.price.amount` (not `variant.price` string)
   - HTML description cleaning with `descriptionHtml`

2. ✅ TypeScript type safety:
   - All image properties use `url` (not `src`)
   - Product variant initialization with fallback
   - Proper null/undefined checks

3. ✅ CartContext:
   - `addItem()` function works correctly
   - Tests verify cart operations work
   - State updates are properly tracked

## Current Debugging Setup
The app now includes comprehensive logging at key points:

### In ProductDetailsScreen:
```typescript
console.log('Adding to cart:', {
  productId: product.id,
  productTitle: product.title,
  variant: selectedVariant,
});
```

### In CartContext:
```typescript
console.log('CartContext.addItem called with:', { productId, productTitle, variantId: variant.id });
console.log('Cart updated:', newItems.length, 'items');
```

### In productService:
```typescript
console.log('Products loaded:', data.length, 'products');
console.log('Transformed product:', { id, title, variantsCount, firstVariant });
```

## How to Test

### Option 1: Using Android Emulator
1. Ensure emulator is running: `emulator -avd Pixel_5_API_30`
2. Start the app: `npm run android`
3. Open Chrome DevTools: Press `R` in terminal to open remote debugger
4. Check Console tab for logged messages

### Option 2: Using Xcode Debugger (iOS)
```bash
npm run ios
```

### Option 3: Using React Native Debugger
1. Install: `npm install -g react-native-debugger`
2. Run: `react-native-debugger`
3. Press `D` in terminal after running `npm run android`
4. Check Network and Console tabs

## Expected Console Output When Adding to Cart

1. **Product List Load:**
   ```
   Products loaded: 4 products
   Transformed product: {
     id: "gid://shopify/Product/7634433605805",
     title: "Unisex Hoodie",
     variantsCount: 10,
     firstVariant: { id, title, price, available, image }
   }
   ```

2. **When Clicking a Product:**
   - NavigationStack pushes to ProductDetailsScreen
   - defaultVariant is initialized from product.variants[0]

3. **When Clicking "Add to Cart":**
   ```
   Adding to cart: {
     productId: "gid://shopify/Product/7634433605805",
     productTitle: "Unisex Hoodie",
     variant: { id, title, price, available, image }
   }
   CartContext.addItem called with: {
     productId: "gid://shopify/Product/7634433605805",
     productTitle: "Unisex Hoodie",
     variantId: "gid://shopify/ProductVariant/43098641498285"
   }
   Cart updated: 1 items
   ```

## Possible Issues to Check

1. **Products Not Loading:**
   - Check network: Is 10.0.2.2:8081 accessible from emulator?
   - Verify API URL in src/services/api.ts
   - Check console for "No products in API response"

2. **Variants Not Present:**
   - Look for "variantsCount: 0" in console
   - Check if API variants array is being parsed correctly

3. **Button Not Responding:**
   - Check if product is successfully passed to ProductDetailsScreen
   - Verify selectedVariant is defined (not undefined)
   - Check for any exceptions in console

4. **Cart Not Updating:**
   - Check if "CartContext.addItem called with" appears in logs
   - Verify "Cart updated: X items" appears
   - Check CartScreen to see if items list is rendering

## Next Steps

1. **Run the app in debug mode:**
   ```bash
   cd /Users/pnine/Code/ProjReactive/ShopifyStorefront
   npm run android
   ```

2. **In another terminal, watch for logs:**
   ```bash
   adb logcat | grep -i "Adding to cart\|CartContext\|Products loaded"
   ```

3. **Share the console output when:**
   - App starts (should see product load logs)
   - You click a product (should navigate to details)
   - You click "Add to Cart" (should see add to cart logs)

## File Locations
- API service: `src/services/api.ts`
- Cart context: `src/context/CartContext.tsx`
- Product details screen: `src/screens/ProductDetailsScreen.tsx`
- Tests: `__tests__/CartContext.test.tsx` (verifies structure)
