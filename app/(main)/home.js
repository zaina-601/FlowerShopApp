import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { styles as globalStyles } from '../../styles'; // Using our shared global styles

export default function HomeScreen() {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // This useEffect handles fetching flowers and re-fetching when the search query changes.
  useEffect(() => {
    const fetchFlowers = async () => {
      setLoading(true);
      const flowersCollection = collection(db, "flowers");
      let q; // This will hold our final query

      const trimmedQuery = searchQuery.trim();

      if (trimmedQuery === '') {
        // If the search bar is empty, fetch all flowers
        q = query(flowersCollection);
      } else {
        // If there's a search term, build a "starts with" query.
        // This query finds names that start with the search term (e.g., "Rose" matches "Roses").
        const endStr = trimmedQuery.slice(0, -1) + String.fromCharCode(trimmedQuery.charCodeAt(trimmedQuery.length - 1) + 1);
        q = query(
          flowersCollection,
          where('name', '>=', trimmedQuery),
          where('name', '<', endStr)
        );
      }

      try {
        const querySnapshot = await getDocs(q);
        const flowersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFlowers(flowersList);
      } catch (error) {
        console.error("Error fetching flowers: ", error);
      } finally {
        setLoading(false);
      }
    };

    // This debouncing logic is excellent! It waits 300ms after the user stops typing to start the search.
    const debounceFetch = setTimeout(() => {
      fetchFlowers();
    }, 300);

    // This cleanup function cancels the timeout if the user types again, preventing extra searches.
    return () => clearTimeout(debounceFetch);
  }, [searchQuery]); // The effect re-runs whenever the user types in the search bar.

  return (
    <ScrollView style={globalStyles.homeContainer} keyboardShouldPersistTaps="handled">
      <View style={globalStyles.banner}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&h=400&fit=crop' }}
          style={globalStyles.bannerImage}
        />
        <View style={globalStyles.bannerOverlay}>
          <Text style={globalStyles.bannerTitle}>Welcome to Flower Shop</Text>
          <Text style={globalStyles.bannerSubtitle}>Fresh flowers delivered daily</Text>
        </View>
      </View>

      <View style={globalStyles.section}>
        {/* The Search Bar Input */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search for flowers by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <Text style={globalStyles.sectionTitle}>Featured Flowers</Text>

        {/* This logic shows a loading spinner, a "no results" message, or the flower grid */}
        {loading ? (
          <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 50 }} />
        ) : flowers.length === 0 ? (
          <Text style={styles.noResultsText}>No flowers found matching your search.</Text>
        ) : (
          <View style={globalStyles.flowersGrid}>
            {flowers.map((flower) => (
              <Link key={flower.id} href={`/${flower.id}`} asChild>
                <TouchableOpacity style={globalStyles.flowerCard}>
                  <Image source={{ uri: flower.imageUrl }} style={globalStyles.flowerImage} />
                  <View style={globalStyles.flowerInfo}>
                    <Text style={globalStyles.flowerName}>{flower.name}</Text>
                    <Text style={globalStyles.flowerDescription} numberOfLines={2}>{flower.description}</Text>
                    <Text style={globalStyles.flowerPrice}>${flower.price.toFixed(2)}</Text>
                  </View>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// Local styles specific to this screen
const styles = StyleSheet.create({
  searchInput: {
    ...globalStyles.input, // Reuse your global input style
    marginBottom: 20,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});