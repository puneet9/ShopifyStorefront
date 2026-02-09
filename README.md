# Shopify Storefront Product Browser

A React Native e-commerce application built with **pure React Native + TypeScript** (no Expo) that displays products from the Shopify Storefront API. Users can browse products, view details with variant selection, and manage a shopping cart.

## How to Run

### Prerequisites
- Node.js >= 20
- Android Studio (for Android)
- Xcode (for iOS, macOS only)
- CocoaPods (`sudo gem install cocoapods`)

### Installation
```bash
npm install
```

### iOS
```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

### Android
```bash
npx react-native run-android
```

### Run Tests
```bash
npm test
```

---

## Implementation Overview

- **Screens**: `ProductListScreen`, `ProductDetailsScreen`, `CartScreen`
- **Navigation**: Bottom tabs with a nested stack for product list/details
- **State**: React Context for cart operations with AsyncStorage persistence
- **Data**: Axios fetch with retry and simple in-memory caching
- **Lists**: `FlatList` with column layout and tuning props

## Testing

```bash
npm test
```
