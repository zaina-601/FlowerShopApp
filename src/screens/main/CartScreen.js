import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CartScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Cart is Empty</Text>
        <Text style={styles.emptyMessage}>
          Add some beautiful flowers to your cart!
        </Text>
      </View>
    </View>
  );
}

