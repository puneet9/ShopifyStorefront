import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import { CollectionStackParamList, RootTabParamList } from '../types';

const CollectionStack = createNativeStackNavigator<CollectionStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const CollectionStackNavigator = () => {
  return (
    <CollectionStack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
        },
      }}
    >
      <CollectionStack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{
          title: 'Shop',
          headerShown: true,
        }}
      />
      <CollectionStack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={({ route }) => ({
          title: route.params?.product?.title || 'Product Details',
          headerBackTitle: 'Back',
        })}
      />
    </CollectionStack.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#999',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
          },
        }}
      >
        <Tab.Screen
          name="Collection"
          component={CollectionStackNavigator}
          options={{
            title: 'Shop',
            tabBarLabel: 'Shop',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>🛍️</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            title: 'Cart',
            tabBarLabel: 'Cart',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>🛒</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

// Text component import for icons
import { Text } from 'react-native';
