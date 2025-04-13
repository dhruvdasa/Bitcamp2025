import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import BackButton from '../assets/Backbutton'

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function JournalCalendarScreen() {
  const navigation = useNavigation();
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [entriesForDay, setEntriesForDay] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadMarkedDates();
    }, [])
  );

  const getMoodColor = (score) => {
      if (score <= -0.6) return '#FF6B6B'; // red
      if (score <= -0.2) return '#FFAA64'; // orange
      if (score <= 0.2) return '#FFE066'; // yellow
      if (score <= 0.6) return '#A2D2FF'; // light blue
      return '#88E0A4'; // green
    };

  const loadMarkedDates = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const journalKeys = keys.filter((key) => key.startsWith('entry-'));

    const dates = {};

    for (let key of journalKeys) {
        const date = key.split('-').slice(1, 4).join('-'); // e.g. "2025-04-13"
        const raw = await AsyncStorage.getItem(key);
        if (!raw) continue;

        const entry = JSON.parse(raw);
        const mood = entry.moodScore ?? 0; // fallback to neutral
        const moodColor = getMoodColor(mood);

        if (!dates[date]) {
        dates[date] = { dots: [] };
        }

        dates[date].dots.push({ color: moodColor });
        dates[date].marked = true;
    }

    setMarkedDates(dates);
  };

  const loadEntriesForDate = async (dateStr) => {
    const keys = await AsyncStorage.getAllKeys();
    const matchingKeys = keys.filter((key) => key.startsWith(`entry-${dateStr}`));
    const rawEntries = await AsyncStorage.multiGet(matchingKeys);
    const parsed = rawEntries.map(([_, val]) => JSON.parse(val));

    // Sort by timestamp
    parsed.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    setEntriesForDay(parsed);
    setSelectedDate(dateStr);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Your Journal Calendar</Text>

      <Calendar
        markedDates={markedDates}
        markingType={'multi-dot'}
        onDayPress={(day) => {
          loadEntriesForDate(day.dateString);
        }}
      />

      {/* 🔙 Back to Home */}
      <BackButton navigation={navigation} to="Home" />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Journal')}
      >
        <Text style={styles.buttonText}>➕ New Entry</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TrendReport')}>
         <Text style={styles.buttonText}>📊 Weekly Report</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>🗓️ {selectedDate}</Text>
          <ScrollView style={styles.entryScroll}>
            {entriesForDay.map((entry, i) => {
              const time = new Date(entry.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              return (
                <View key={i} style={[styles.entryBlock, { backgroundColor: getMoodColor(entry.moodScore)}]}>
                  <Text style={styles.entryTime}>{time}</Text>
                  <Text style={styles.entryText}>📝 {entry.entry}</Text>
                  <Text style={styles.responseText}>💬 {entry.supportiveMessage || '—'}</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
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
    paddingTop: 60,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2f5d50',
  },
  button: {
    backgroundColor: '#2f5d50',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000099',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    maxHeight: '70%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2f5d50',
  },
  entryScroll: {
    marginTop: 10,
  },
  entryBlock: {
    marginBottom: 16,
    backgroundColor: '#f0f9f5',
    padding: 12,
    borderRadius: 10,
  },
  entryTime: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  entryText: {
    fontSize: 16,
    marginBottom: 4,
  },
  responseText: {
    fontSize: 15,
    color: '#3d5347',
    fontStyle: 'italic',
  },
});
