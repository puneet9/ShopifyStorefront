# 🛍️ Shopify Storefront Product Browser

A React Native e-commerce application built with TypeScript that allows users to browse products from the Shopify Storefront API, view product details, manage variants, and maintain a shopping cart.

## 📋 Features

### ✅ Core Features Implemented
- **Product Browsing**: 2-column grid layout for product display
- **Product Details**: Expandable variant selection with availability indicators
- **Shopping Cart**: Add/remove items, adjust quantities, view total price
- **State Management**: React Context for cart operations
- **Type Safety**: Full TypeScript typing for navigation, state, and components
- **Networking**: Axios for API calls with error handling
- **Accessibility**: VoiceOver (iOS) and TalkBack (Android) compatible

### 🎯 Navigation
- **Bottom Tab Navigator**: Shop and Cart tabs
- **Nested Navigation**: Collection tab with Product List and Product Details screens
- **Type-Safe Routing**: Full TypeScript support for route parameters

## 🚀 Quick Start

### Installation
```bash
cd /Users/pnine/Code/ProjReactive/ShopifyStorefront
npm install
```

### Running the App

**iOS:**
```bash
npx react-native run-ios
```

**Android:**
```bash
npx react-native run-android
```

### Running Tests
```bash
npm test
```

## 📁 Project Structure

```
src/
├── navigation/
│   └── RootNavigator.tsx          # Tab + Stack navigation
├── screens/
│   ├── ProductListScreen.tsx      # 2-column product grid
│   ├── ProductDetailsScreen.tsx   # Product details & variants
│   └── CartScreen.tsx             # Shopping cart
├── context/
│   └── CartContext.tsx            # State management
├── services/
│   └── api.ts                     # Shopify API service
├── types/
│   └── index.ts                   # TypeScript definitions
└── App.tsx
```

## �� Implementation Highlights

### Key Features
- ✅ 2-column responsive grid layout
- ✅ Variant selection with availability indicators
- ✅ Cart management (add, remove, update quantities)
- ✅ Real-time total price calculation
- ✅ Type-safe navigation
- ✅ Full accessibility support (VoiceOver/TalkBack)
- ✅ Comprehensive Jest tests

### Technologies
- **Navigation**: React Navigation (Tab + Stack)
- **State**: React Context API
- **Networking**: Axios with error handling
- **Styling**: React Native StyleSheet
- **Testing**: Jest with pure utility functions
- **Accessibility**: WCAG compliance

## 🧪 Testing

```bash
npm test -- __tests__/cartOperations.test.ts
```

Tests cover:
- Price calculations
- Adding items (new & duplicate)
- Removing items
- Updating quantities
- Edge cases

## 📚 API Integration

Fetches from: `https://cdn.shopify.com/s/files/1/0533/2089/files/products.json?v=1613490589`

Transforms Shopify response to app types with full error handling.

## 🎯 Skills Demonstrated

- React + TypeScript patterns
- React Native UI/UX best practices
- FlatList optimization
- Navigation architecture
- API integration
- State management
- Accessibility (WCAG)
- Testing with Jest
- Code quality & maintainability

## 🐛 Debugging

**Developer Menu:**
- iOS: `Cmd + D`
- Android: `Cmd + M` (Mac) or `Ctrl + M` (Windows/Linux)

## 📦 Dependencies

- @react-navigation/native
- @react-navigation/bottom-tabs
- @react-navigation/native-stack
- react-native-screens
- react-native-safe-area-context
- axios

## 📄 License

Provided for evaluation purposes.

---

Built with ❤️ using React Native + TypeScript
