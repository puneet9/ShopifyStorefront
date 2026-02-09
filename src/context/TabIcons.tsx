import React from 'react';
import { Image, View, Text } from 'react-native';
import { colors } from './ThemeContext';
import { getStyles } from '../styles/RootNavigator.styles';
import { useCart } from './CartContext';
import { Badge } from './Badge';

export const ShopTabIcon = ({ focused }: { focused: boolean }) => {
  const styles = getStyles(colors);

  return (
      <Image
        source={require('../assets/reactiveLogo.jpeg')}
        style={[styles.shopTabIcon, focused ? styles.shopTabIconFocused : styles.shopTabIconUnfocused]}
        resizeMode="contain"
      />
  );
};

export const CartTabIcon = ({ color }: { color: string }) => {
  const { items } = useCart();
  const styles = getStyles(colors);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.iconWrapper}>
      <Text style={[styles.tabIcon, { color }]}>🛒</Text>
      <Badge count={itemCount} containerStyle={styles.tabBadge} textStyle={styles.tabBadgeText} />
    </View>
  );
};
