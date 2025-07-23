import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { styles as globalStyles } from '../../styles';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function WishlistScreen() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const wishlistItemsRef = collection(db, 'wishlists', userId, 'items');
    const unsubscribe = onSnapshot(wishlistItemsRef, (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWishlistItems(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userId]);

  const handleRemoveItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, 'wishlists', userId, 'items', itemId));
    } catch (error) {
      console.error("Error removing from wishlist: ", error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#2E7D32" style={globalStyles.loadingContainer} />;
  }

  if (wishlistItems.length === 0) {
    return (
      <View style={globalStyles.emptyStateContainer}>
        <Text style={globalStyles.emptyIcon}>❤️</Text>
        <Text style={globalStyles.emptyTitle}>Your Wishlist is Empty</Text>
        <Text style={globalStyles.emptyMessage}>Save your favorite flowers here!</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <Link href={`/${item.id}`} asChild>
        <TouchableOpacity style={styles.itemContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            <Text style={styles.itemCategory}>{item.category}</Text>
        </View>
        <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={styles.removeButton}>
            <Ionicons name="trash-outline" size={22} color="#ef4444" />
        </TouchableOpacity>
        </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlistItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  list: {
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  itemPrice: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
    marginVertical: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  removeButton: {
    padding: 10,
    marginLeft: 10,
  },
});