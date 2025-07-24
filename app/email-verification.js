import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { sendEmailVerification, signOut, reload } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth } from '../firebaseConfig';
import { styles } from '../styles';

export default function EmailVerificationScreen() {
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;
  const router = useRouter();

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      await sendEmailVerification(user);
      Alert.alert('Success', 'A new verification email has been sent!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setLoading(true);
    try {
      await reload(auth.currentUser);

      if (auth.currentUser.emailVerified) {
        Alert.alert('Success', 'Email verified! Welcome to Flower Shop!');
        router.replace('/home');
      } else {
        Alert.alert('Not Verified', 'Please check your inbox and click the verification link.');
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
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.verificationContainer}>
      <Text style={styles.icon}>📧</Text>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.message}>We've sent a verification link to:</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <Text style={styles.instructions}>
        Please click the link in the email to activate your account.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleCheckVerification}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Checking...' : "I've Verified My Email"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={handleResendEmail}
        disabled={loading}
      >
        <Text style={styles.secondaryButtonText}>Resend Verification Email</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={handleLogout}>
        <Text style={styles.linkText}>Use a Different Account</Text>
      </TouchableOpacity>
    </View>
  );
}