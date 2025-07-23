import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { doc, getDoc, setDoc, serverTimestamp, runTransaction } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { styles as globalStyles } from '../../styles';
import { Ionicons } from '@expo/vector-icons';

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlisting, setIsWishlisting] = useState(false);

  useEffect(() => {
    if (product) {
      navigation.setOptions({ title: product.name });
    }
  }, [product, navigation]);

  useEffect(() => {
    if (id) {
      const getProduct = async () => {
        setLoading(true);
        const docRef = doc(db, 'flowers', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
        setLoading(false);
      };
      getProduct();
    }
  }, [id]);

  const handleAddToWishlist = async () => {
    if (!auth.currentUser) {
      Alert.alert("Please Login", "You must be logged in to save items to your wishlist.");
      return;
    }
    setIsWishlisting(true);
    const userId = auth.currentUser.uid;
    const wishlistItemRef = doc(db, 'wishlists', userId, 'items', product.id);

    try {
      await setDoc(wishlistItemRef, product);
      Alert.alert("Added to Wishlist", `${product.name} has been saved to your wishlist.`);
    } catch (error) {
      console.error("Error adding to wishlist: ", error);
      Alert.alert("Error", "Could not add item to your wishlist.");
    } finally {
      setIsWishlisting(false);
    }
  };

  const handleAddToCart = async () => {
    if (!auth.currentUser) {
      Alert.alert("Please Login", "You must be logged in to add items to your cart.",
        [{ text: "OK", onPress: () => router.push('/login') }]
      );
      return;
    }
    setAddingToCart(true);
    const userId = auth.currentUser.uid;
    const cartItemRef = doc(db, 'carts', userId, 'items', product.id);
    try {
      await runTransaction(db, async (transaction) => {
        const itemDoc = await transaction.get(cartItemRef);
        if (!itemDoc.exists()) {
          transaction.set(cartItemRef, { ...product, quantity: 1, addedAt: serverTimestamp() });
        } else {
          const newQuantity = itemDoc.data().quantity + 1;
          transaction.update(cartItemRef, { quantity: newQuantity });
        }
      });
      Alert.alert("Added to Cart", `${product.name} has been added to your cart.`);
    } catch (error) {
      console.error("Error adding to cart: ", error);
      Alert.alert("Error", "Could not add item to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={globalStyles.loadingContainer} color="#2E7D32" />;
  }

  if (!product) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>Product not found.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>

        {/* --- NEW: The "Add to Wishlist" button --- */}
        <TouchableOpacity
          style={[styles.wishlistButton, isWishlisting && styles.buttonDisabled]}
          onPress={handleAddToWishlist}
          disabled={isWishlisting}
        >
          <Ionicons name="heart-outline" size={20} color="#2E7D32" />
          <Text style={styles.wishlistButtonText}>
            {isWishlisting ? 'Adding to Wishlist...' : 'Add to Wishlist'}
          </Text>
        </TouchableOpacity>

        {/* The existing "Add to Cart" button */}
        <TouchableOpacity
          style={[styles.button, addingToCart && styles.buttonDisabled]}
          onPress={handleAddToCart}
          disabled={addingToCart}
        >
          <Ionicons name="cart-outline" size={20} color="white" />
          <Text style={styles.buttonText}>
            {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// --- NEW: Added styles for the wishlist button ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 350 },
  detailsContainer: { padding: 20 },
  name: { fontSize: 28, fontWeight: 'bold', color: '#2E7D32', marginBottom: 8 },
  category: { fontSize: 16, color: '#757575', marginBottom: 16, fontStyle: 'italic' },
  description: { fontSize: 16, color: '#333', lineHeight: 24, marginBottom: 20 },
  price: { fontSize: 24, fontWeight: 'bold', color: '#FF6B35', marginBottom: 20 },
  button: { ...globalStyles.button, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  buttonDisabled: { ...globalStyles.buttonDisabled },
  buttonText: { ...globalStyles.buttonText, marginLeft: 10 },
  wishlistButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2E7D32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  wishlistButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});