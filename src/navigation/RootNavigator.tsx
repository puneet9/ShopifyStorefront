import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import { useCart } from '../context/CartContext';
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
  const { items } = useCart();
  const itemCount = items.length;

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
              <View style={{ position: 'relative' }}>
                <Text style={{ fontSize: 20, color }}>🛒</Text>
                {itemCount > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      right: -8,
                      top: -8,
                      backgroundColor: '#FF6B6B',
                      borderRadius: 10,
                      width: 20,
                      height: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 2,
                      borderColor: '#fff',
                    }}
                  >
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      {itemCount}
                    </Text>
                  </View>
                )}
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
