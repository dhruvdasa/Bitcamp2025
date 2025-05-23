// --- Journal.js ---
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from 'react-native';
import { usePetals } from '../contexts/PetalContext';
import JournalCalendar from '../components/JournalCalendar';
import BackButton from '../assets/Backbutton'

export default function JournalScreen({ navigation }) {

  
  const [entry, setEntry] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const { add } = usePetals();

  const submitEntry = async () => {
    if (!entry.trim())
      return Alert.alert("Empty Entry", "Please write something before submitting.");

    setLoading(true);
    const timestamp = new Date().toISOString();
    const date = timestamp.split('T')[0];           // e.g., "2025-04-12"
    const time = timestamp.split('T')[1].slice(0, 8); // e.g., "22:31:00"

    try {
      const res = await fetch('https://backend.shreyasbachu1355.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry, timestamp }),
      });

      const data = await res.json();
      const fullResponse = data.message || 'No analysis returned.';

      const supportiveMatch = fullResponse.match(/\*Supportive Message:\*(.*?)($|\*|$)/s);
      const supportiveMessage = supportiveMatch ? supportiveMatch[1].trim() : fullResponse;

      
      const moodMatch = fullResponse.match(/\*Mood Score:\*\s*([+-]?\d+(\.\d+)?)/);      
      const moodScore = moodMatch ? parseFloat(moodMatch[1]) : 0;

      setResponse(supportiveMessage || 'No analysis returned.');

      const storageKey = `entry-${date}-${time}`;
      const savedData = {
        entry,
        moodScore,
        timestamp,
        fullResponse,
        supportiveMessage,
      };

      await AsyncStorage.setItem(storageKey, JSON.stringify(savedData));
      console.log('Entry saved:', storageKey);

      await add(1); // 🌸 Reward petal for journaling
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong submitting your journal.');
    } finally {
      setLoading(false);
      setEntry('');
    }
  };

  const clearAllEntries = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const journalKeys = keys.filter(key => key.startsWith('entry-'));
      await AsyncStorage.multiRemove(journalKeys);
      Alert.alert('Success', 'All journal entries cleared!');
      console.log('Cleared keys:', journalKeys);
    } catch (err) {
      console.error('Error clearing AsyncStorage:', err);
      Alert.alert('Error', 'Could not clear saved logs.');
    }
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    console.log("Selected date:", day.dateString);
    // You can optionally filter/display logs from AsyncStorage for this day
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1 }}>
        {/* 🔝 Top header area with background + back button */}
        <View style={styles.header}>
          <BackButton navigation={navigation} to="Home" />
        </View>
        
        <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Diary')}
      >
        <Text style={styles.buttonText}>➕ New Entry</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TrendReport')}>
         <Text style={styles.buttonText}>📊 Weekly Report</Text>
      </TouchableOpacity>

        {/* 📜 Scrollable content starts below the header */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>


               <JournalCalendar
                  onDateSelect={handleDateSelect}
                  selectedDate={selectedDate}
                />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
      header: {
        height: 100,
        backgroundColor: '#14532D', // 🌱 soft mint or pick any aesthetic tone
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        zIndex: 10,
        elevation: 5,
      },
      scrollContainer: {
        flexGrow: 1,
        paddingBottom: 0,
      },
      container: {
        flex: 1,
        backgroundColor: '#fffaf3',
        paddingHorizontal: 20,
        paddingTop: 30, // space below header
      },
    
    title: {
      paddingTop: 10,
      fontSize: 26,
      fontWeight: '700',
      marginBottom: 20,
      color: '#14532D',
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#14532D',
      padding: 15,
      borderRadius: 10,
      marginTop: 20,
      alignItems: 'center',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    input: {
      backgroundColor: '#fffaf3',
      borderRadius: 12,
      borderColor: '#ddd',
      borderWidth: 1.5,
      padding: 20,
      fontSize: 16,
      minHeight: 180,
      textAlignVertical: 'top',
      marginBottom: 20,
      color: '#333',
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
    },
    response: {
      marginTop: 40,
      fontSize: 16,
      color: '#2f5d50',
      fontStyle: 'italic',
      backgroundColor: '#CDE7B0',
      padding: 14,
      borderRadius: 10,
      borderColor: '#14532D',
      borderWidth: 1,
    },

       
  });
  
  