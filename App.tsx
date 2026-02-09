/**
 * Shopify Storefront Product Browser
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from './src/context/CartContext';
import { I18nProvider } from './src/context/I18nContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { ToastProvider } from './src/context/ToastContext';
import { RootNavigator } from './src/navigation/RootNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <I18nProvider>
          <ToastProvider>
            <CartProvider>
              <RootNavigator />
            </CartProvider>
          </ToastProvider>
        </I18nProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
