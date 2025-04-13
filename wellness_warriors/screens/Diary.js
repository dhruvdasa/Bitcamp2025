import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Alert} from 'react-native';
import BackButton from '../assets/Backbutton'

export default function Diary({navigation}){

    const [entry, setEntry] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);


    const submitEntry = async () => {
    if (!entry.trim()) return Alert.alert("Empty Entry", "Please write something before submitting.");

    setLoading(true);
    const timestamp = new Date().toISOString();
    const date = timestamp.split('T')[0];           // "2025-04-12"
    const time = timestamp.split('T')[1].slice(0, 8); // "22:31:00"

    try {
      const res = await fetch('https://backend.shreyasbachu1355.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry, timestamp })
      });

      const data = await res.json();

      const fullResponse = data.message || 'No analysis returned.';

      console.log('🔍 Gemini full response:\n', fullResponse);

      const supportiveMatch = fullResponse.match(/\*Supportive Message:\*(.*?)($|\*|$)/s);
      const supportiveMessage = supportiveMatch ? supportiveMatch[1].trim() : fullResponse;

      
      const moodMatch = fullResponse.match(/\*Mood Score:\*\s*([+-]?\d+(\.\d+)?)/);      
      const moodScore = moodMatch ? parseFloat(moodMatch[1]) : 0;

      setResponse(supportiveMessage || 'No analysis returned.');
      const message = data.message
    
      const storageKey = `entry-${date}-${time}`;
      const savedData = {
        entry,
        moodScore,
        timestamp,
        fullResponse,
        supportiveMessage, // AI response
      };

      await AsyncStorage.setItem(storageKey, JSON.stringify(savedData));
      console.log('Entry saved:', storageKey);

      setResponse(supportiveMessage);
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1 }}>
        {/* 🔝 Top header area with background + back button */}
        <View style={styles.header}>
          <BackButton navigation={navigation} to="Journal" />
        </View>
  
        {/* 📜 Scrollable content starts below the header */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <Text style={styles.title}>📝 Write Your Journal</Text>
  
              <TextInput
                style={styles.input}
                placeholder="How are you feeling today?"
                value={entry}
                onChangeText={setEntry}
                multiline
                textAlignVertical="top"
              />
  
              <Button
                title={loading ? 'Analyzing...' : 'Submit Entry'}
                onPress={submitEntry}
              />
              <Button
                title="🗑️ Clear All Logs (Demo Only)"
                color="red"
                onPress={clearAllEntries}
              />
  
              {response ? (
                <Text style={styles.response}>{response}</Text>
              ) : null}
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
