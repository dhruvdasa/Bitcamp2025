import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TrendReportScreen() {
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);

    try {
      const keys = await AsyncStorage.getAllKeys();
      const journalKeys = keys
        .filter(key => key.startsWith('entry-'))
        .sort()
        .slice(-5); // last 5 entries

      const entries = await AsyncStorage.multiGet(journalKeys);
      const logs = entries
        .map(([_, value]) => {
          const data = JSON.parse(value);
          return {
            entry: data.entry,
            timestamp: data.timestamp,
            moodScore: data.moodScore ?? 0,
            supportiveMessage: data.supportiveMessage ?? '',
          };
        });

      const res = await fetch('https://backend.shreyasbachu1355.workers.dev/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs }),
      });

      const data = await res.json();
      setReport(data.report || 'No report generated.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Unable to fetch trend report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Weekly Trend Report</Text>

      <TouchableOpacity style={styles.button} onPress={fetchReport}>
        <Text style={styles.buttonText}>📈 Generate Report</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#2f5d50" style={{ marginTop: 20 }} />}

      {report ? (
        <ScrollView style={styles.reportContainer}>
          <Text style={styles.reportText}>{report}</Text>
        </ScrollView>
      ) : null}
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#eafaf1',
      padding: 20,
      paddingTop: 60,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#2f5d50',
    },
    button: {
      backgroundColor: '#2f5d50',
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    reportContainer: {
      marginTop: 20,
      backgroundColor: '#ffffff',
      padding: 14,
      borderRadius: 10,
      maxHeight: '70%',
    },
    reportText: {
      fontSize: 16,
      color: '#333333',
    },
  });
  