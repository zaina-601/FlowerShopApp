import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { styles as globalStyles } from '../../styles';

export default function HomeScreen() {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFlowers = async () => {
      setLoading(true);
      const flowersCollection = collection(db, "flowers");
      let q;

      const trimmedQuery = searchQuery.trim();

      if (trimmedQuery === '') {
        q = query(flowersCollection);
      } else {
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

    const debounceFetch = setTimeout(() => {
      fetchFlowers();
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [searchQuery]);

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

const styles = StyleSheet.create({
  searchInput: {
    ...globalStyles.input,
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