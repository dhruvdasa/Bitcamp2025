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
import BackButton from '../assets/Backbutton'
import { Platform } from 'react-native';



export default function TrendReportScreen({ navigation }) {
    const [report, setReport] = useState('');
    const [loading, setLoading] = useState(false);
  
    const fetchReport = async () => {
      setLoading(true);
      try {
        const keys = await AsyncStorage.getAllKeys();
        const journalKeys = keys
          .filter(key => key.startsWith('entry-'))
          .sort()
          .slice(-5);
  
        const entries = await AsyncStorage.multiGet(journalKeys);
        const logs = entries.map(([_, value]) => {
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
      <View style={styles.wrapper}>
        {/* Top Header */}
        <View style={styles.header}>
          <BackButton navigation={navigation} to="JournalCalendar" />
        </View>
  
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>📊 Weekly Trend Report</Text>
  
            <TouchableOpacity style={styles.button} onPress={fetchReport}>
              <Text style={styles.buttonText}>📈 Generate Report</Text>
            </TouchableOpacity>
  
            {loading && (
              <ActivityIndicator
                size="large"
                color="#2f5d50"
                style={{ marginTop: 20 }}
              />
            )}
  
            {report ? (
              <View style={styles.reportContainer}>
                <Text style={styles.reportText}>{report}</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </View>
    );
  }

const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: '#fffaf3',
    },
    header: {
      height: 100,
      backgroundColor: '#14532D',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? 50 : 20,
      zIndex: 10,
      elevation: 5,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingBottom: 30,
    },
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 30,
    },
    title: {
      paddingTop: 30,
      fontSize: 26,
      fontWeight: '700',
      marginBottom: 20,
      color: '#2f5d50',
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#2f5d50',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
      marginBottom: 20,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '600',
    },
    reportContainer: {
      marginTop: 10,
      backgroundColor: '#ffffff',
      padding: 16,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    reportText: {
      fontSize: 16,
      color: '#3d5347',
      lineHeight: 22,
    },
  });
  