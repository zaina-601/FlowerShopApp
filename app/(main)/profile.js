import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { signOut, sendEmailVerification } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth } from '../../firebaseConfig';
import { styles as globalStyles } from '../../styles';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const user = auth.currentUser;
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              Alert.alert("Logout Error", error.message);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleResendVerification = async () => {
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user);
        Alert.alert("Email Sent", "A new verification email has been sent to your inbox. Please check your spam folder as well.");
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    } else {
      Alert.alert("Already Verified", "Your email address has already been verified.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={80} color="#2E7D32" />
        <Text style={styles.headerEmail}>{user?.email}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>User ID</Text>
            <Text style={styles.infoValue} selectable>{user?.uid}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Account Status</Text>
            <Text style={[styles.infoValue, user?.emailVerified ? styles.verified : styles.notVerified]}>
              {user?.emailVerified ? "Verified" : "Not Verified"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Actions</Text>
        {!user?.emailVerified && (
          <TouchableOpacity style={styles.actionButton} onPress={handleResendVerification}>
            <Ionicons name="mail-unread-outline" size={24} color="#3b82f6" />
            <Text style={styles.actionButtonText}>Resend Verification Email</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerEmail: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 10,
  },
  infoSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 16,
    color: '#374151',
  },
  infoValue: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  verified: {
    color: '#16a34a', // Green
  },
  notVerified: {
    color: '#ef4444', // Red
  },
  actionsSection: {
    paddingHorizontal: 20,
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    marginLeft: 15,
    fontWeight: '600',
  },
  logoutButton: {
  },
  logoutButtonText: {
    color: '#ef4444',
  },
});