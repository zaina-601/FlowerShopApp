import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { styles as globalStyles } from '../../styles';

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const ordersCollectionRef = collection(db, 'orders');

    const q = query(
      ordersCollectionRef,
      where("userId", "==", userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(fetchedOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#2E7D32" style={globalStyles.loadingContainer} />;
  }

  if (orders.length === 0) {
    return (
      <View style={globalStyles.emptyStateContainer}>
        <Text style={globalStyles.emptyIcon}>🧾</Text>
        <Text style={globalStyles.emptyTitle}>No Order History</Text>
        <Text style={globalStyles.emptyMessage}>Your past orders will appear here after you place your first one.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderId}>Order ID: {item.id}</Text>
      <View style={styles.row}>
        <Text style={styles.orderDate}>
          {new Date(item.createdAt.seconds * 1000).toLocaleDateString()}
        </Text>
        <Text style={[
            styles.orderStatus,
            item.status === 'Placed' ? styles.statusPlaced : styles.statusDelivered
          ]}>
            {item.status}
          </Text>
      </View>
      <Text style={styles.orderTotal}>Total: ${item.total}</Text>
      <View style={styles.itemsList}>
        <Text style={styles.itemsHeader}>Items:</Text>
        {item.items.map(product => (
            <Text key={product.id} style={styles.itemText}>- {product.name} (x{product.quantity})</Text>
        ))}
      </View>
    </View>
  );

  return (
    <FlatList
      data={orders}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
    list: {
        padding: 10,
        backgroundColor: '#F1F8E9',
    },
    orderCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
    },
    orderId: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 8,
        fontWeight: '500'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderDate: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    orderTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginTop: 8,
    },
    orderStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        overflow: 'hidden',
    },
    statusPlaced: {
        backgroundColor: '#e0f2fe',
        color: '#0284c7',
    },
    statusDelivered: {
        backgroundColor: '#dcfce7',
        color: '#16a34a',
    },
    itemsList: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        paddingTop: 10,
    },
    itemsHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 5,
    },
    itemText: {
        fontSize: 14,
        color: '#6b7280',
    }
});