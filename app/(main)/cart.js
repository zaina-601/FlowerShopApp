import React, { useState, useEffect } from 'react';
// --- FIX #1: Added Alert to the import list ---
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { collection, onSnapshot, doc, deleteDoc, addDoc, writeBatch } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { styles as globalStyles } from '../../styles';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const cartItemsRef = collection(db, 'carts', userId, 'items');
    const unsubscribe = onSnapshot(cartItemsRef, (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCartItems(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleRemoveItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, 'carts', userId, 'items', itemId));
    } catch (error) {
      console.error("Error removing item: ", error);
    }
  };

  const handleCheckout = async () => {
    // --- FIX #2: Add the userId directly to the order object ---
    const order = {
      userId: userId, // Keep track of who placed the order
      items: cartItems,
      total: calculateTotal(),
      createdAt: new Date(),
      status: 'Placed',
    };

    try {
      // Create a new order in the top-level 'orders' collection
      await addDoc(collection(db, 'orders'), order);

      // Clear the cart
      const batch = writeBatch(db);
      cartItems.forEach(item => {
        const docRef = doc(db, 'carts', userId, 'items', item.id);
        batch.delete(docRef);
      });
      await batch.commit();

      Alert.alert("Order Placed!", "Your order has been successfully placed.", [
        { text: 'OK', onPress: () => router.push('/order-history') }
      ]);
    } catch (error) {
      console.error("Error placing order: ", error);
      Alert.alert("Error", "There was an issue placing your order.");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#2E7D32" style={globalStyles.loadingContainer} />;
  }

  if (!userId || cartItems.length === 0) {
    return (
      <View style={globalStyles.emptyStateContainer}>
        <Text style={globalStyles.emptyIcon}>🛒</Text>
        <Text style={globalStyles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={globalStyles.emptyMessage}>
          Explore our shop and add some beautiful flowers!
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
      </View>
      <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
        {/* --- FIX #3: Added the onPress prop to the button --- */}
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Styles remain the same ---
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
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  itemPrice: {
    fontSize: 14,
    color: '#FF6B35',
    marginVertical: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 18,
    color: '#FF5252',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 10,
  },
  checkoutButton: {
    ...globalStyles.button,
  },
  checkoutButtonText: {
    ...globalStyles.buttonText,
  },
});