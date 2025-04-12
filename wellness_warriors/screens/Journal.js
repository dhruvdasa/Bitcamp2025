import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Alert} from 'react-native';

export default function JournalScreen() {
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

      const supportiveMatch = fullResponse.match(/\*Supportive Message:\*(.*?)($|\*|$)/s);
      const supportiveMessage = supportiveMatch ? supportiveMatch[1].trim() : fullResponse;

      setResponse(supportiveMessage || 'No analysis returned.');
      const message = data.message
    
      const storageKey = `entry-${date}-${time}`;
      const savedData = {
        entry,
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      
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
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#eafaf1',
      padding: 20,
      justifyContent: 'center',
    },
    title: {
      fontSize: 22,
      fontWeight: '600',
      marginBottom: 12,
      color: '#2f5d50',
      textAlign: 'center',
    },
    input: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 14,
      fontSize: 16,
      minHeight: 120,
      marginBottom: 12,
      borderColor: '#ccc',
      borderWidth: 1,
    },
    response: {
      marginTop: 20,
      fontSize: 16,
      color: '#3d5347',
      fontStyle: 'italic',
    },
  });