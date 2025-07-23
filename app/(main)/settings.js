import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSwitch = () => {
    setIsDarkMode(previousState => !previousState);
    Alert.alert("Coming Soon!", "Full dark mode support will be added in a future update.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Display Settings</Text>

      <View style={styles.card}>
        <View style={styles.settingRow}>
          <Ionicons name="moon-outline" size={24} color="#4b5563" />
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            trackColor={{ false: "#d1d5db", true: "#A5D6A7" }}
            thumbColor={isDarkMode ? "#2E7D32" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isDarkMode}
          />
        </View>
      </View>

      <Text style={[styles.title, { marginTop: 40 }]}>About</Text>
      <View style={styles.card}>
        <View style={styles.settingRow}>
            <Ionicons name="information-circle-outline" size={24} color="#4b5563" />
            <Text style={styles.settingLabel}>App Version</Text>
            <Text style={styles.versionText}>1.0.0</Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F1F8E9',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 15,
  },
  versionText: {
    fontSize: 16,
    color: '#6b7280',
  },
});