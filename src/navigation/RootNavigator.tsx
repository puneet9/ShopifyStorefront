/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HeaderBackButton } from '@react-navigation/elements';
import { Image, StatusBar } from 'react-native';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import { CollectionStackParamList, RootTabParamList } from '../types';
import { getStyles } from '../styles/RootNavigator.styles';
import { colors } from '../context/ThemeContext';
import { ShopTabIcon, CartTabIcon } from '../context/TabIcons';

const CollectionStack = createNativeStackNavigator<CollectionStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const CollectionStackNavigator = () => {
  const styles = getStyles(colors);
  return (
    <CollectionStack.Navigator
      screenOptions={({ navigation, route }) => ({
        headerShown: true,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: colors.text,
          fontSize: 18,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerLeft: () =>
          route.name === 'ProductDetails' ? (
            <HeaderBackButton
              tintColor={colors.text}
              onPress={() => navigation.goBack()}
            />
          ) : null,
        headerRight: () => null,
      })}
    >
      <CollectionStack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{
          title: 'Shop',
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <Image
              source={require('../assets/reactiveLogo.jpeg')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          ),
        }}
      />
      <CollectionStack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={({ route }) => ({
          title: route.params?.product?.title || 'Product Details',
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: route.params?.product?.title || 'Product Details',
          headerBackTitle: 'Back',
          headerRight: () => null,
        })}
      />
    </CollectionStack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
      />
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.background,
          },
        }}
      >
        <Tab.Screen
          name="Collection"
          component={CollectionStackNavigator}
          options={{
            title: 'Shop',
            tabBarLabel: 'Shop',
            tabBarIcon: ShopTabIcon,
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={({ navigation }) => ({
            title: 'Cart',
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              color: colors.text,
            },
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerLeft: () => (
              <HeaderBackButton
                tintColor={colors.text}
                onPress={() => navigation.goBack()}
              />
            ),
            headerRight: () => null,
            tabBarLabel: 'Cart',
            tabBarIcon: CartTabIcon,
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
    </>
  );
};

export const RootNavigator = () => {
  return <AppNavigator />;
};
