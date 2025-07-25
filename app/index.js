import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { styles } from '../styles';

export default function StartPage() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#2E7D32" />
    </View>
  );
}