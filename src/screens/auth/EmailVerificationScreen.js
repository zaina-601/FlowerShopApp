import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { getAuth, sendEmailVerification, signOut, reload } from 'firebase/auth';

export default function EmailVerificationScreen() {
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      await sendEmailVerification(user);
      Alert.alert('Success', 'Verification email sent!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setLoading(true);
    try {
      await reload(user);
      if (user.emailVerified) {
        Alert.alert('Success', 'Email verified! Welcome to Flower Shop!');
      } else {
        Alert.alert('Not Verified', 'Please check your email and click the verification link.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>📧</Text>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.message}>
          We've sent a verification link to:
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.instructions}>
          Please check your email and click the verification link to continue.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleCheckVerification}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Checking...' : 'I\'ve Verified My Email'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleResendEmail}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>
            Resend Verification Email
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={handleLogout}
        >
          <Text style={styles.linkText}>Use Different Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}