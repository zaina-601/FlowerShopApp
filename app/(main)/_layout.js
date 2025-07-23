import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons'; // Using a nice icon library

export default function MainLayout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: '#E8F5E9' },
        headerTintColor: '#2E7D32',
        drawerStyle: { backgroundColor: '#F1F8E9' },
        drawerActiveTintColor: '#2E7D32',
        drawerInactiveTintColor: '#666',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: 'Home',
          title: 'Flower Shop',
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="cart"
        options={{
          drawerLabel: 'Cart',
          title: 'Shopping Cart',
          drawerIcon: ({ color, size }) => <Ionicons name="cart-outline" size={size} color={color} />,
        }}
      />

      <Drawer.Screen
        name="wishlist"
        options={{
          drawerLabel: 'Wishlist',
          title: 'My Wishlist',
          drawerIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="order-history"
        options={{
          drawerLabel: 'Order History',
          title: 'My Orders',
          drawerIcon: ({ color, size }) => <Ionicons name="receipt-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Profile',
          title: 'My Profile',
          drawerIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'Settings',
          title: 'Settings',
          drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />

      {/* This hides the product details page from the drawer menu */}
      <Drawer.Screen name="[id]" options={{ drawerItemStyle: { display: 'none' }, title: 'Details' }} />
    </Drawer>
  );
}