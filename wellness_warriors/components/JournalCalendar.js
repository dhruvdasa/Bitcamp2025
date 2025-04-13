import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native'; // ✅ keep this one only
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


export default function JournalCalendar({ onDateSelect, selectedDate: externalDate, showModalOnPress = true }) {
  const navigation = useNavigation();
  const [markedDates, setMarkedDates] = useState({});
  const [internalSelectedDate, setInternalSelectedDate] = useState(null);
  const [entriesForDay, setEntriesForDay] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const selectedDate = externalDate || internalSelectedDate;

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
    const allDates = {};

    const journalKeys = keys.filter((key) => key.startsWith('entry-'));
    const sleepKeys = keys.filter((key) => key.startsWith('sleep-'));

    for (let key of journalKeys) {
      const date = key.split('-').slice(1, 4).join('-');
      const raw = await AsyncStorage.getItem(key);
      if (!raw) continue;

      const entry = JSON.parse(raw);
      const mood = entry.moodScore ?? 0;
      const moodColor = getMoodColor(mood);

      if (!allDates[date]) allDates[date] = { dots: [] };
      allDates[date].dots.push({ color: moodColor });
      allDates[date].marked = true;
    }

    for (let key of sleepKeys) {
      const date = key.split('-').slice(1, 4).join('-');
      const raw = await AsyncStorage.getItem(key);
      if (!raw) continue;
      if (!allDates[date]) allDates[date] = { dots: [] };
      allDates[date].dots.push({ color: 'blue' });
      allDates[date].marked = true;
    }

    setMarkedDates(allDates);
  };

  const loadEntriesForDate = async (dateStr) => {
    const keys = await AsyncStorage.getAllKeys();
    const journalKeys = keys.filter((key) => key.startsWith(`entry-${dateStr}`));
    const sleepKey = `sleep-${dateStr}`;

    const rawEntries = await AsyncStorage.multiGet(journalKeys);
    const parsed = rawEntries.map(([_, val]) => JSON.parse(val));
    parsed.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const extra = await AsyncStorage.getItem(sleepKey);
    if (extra) parsed.push({ isSleep: true, ...JSON.parse(extra) });

    setEntriesForDay(parsed);
    setInternalSelectedDate(dateStr);
    setModalVisible(true);
  };

  const handleDayPress = (day) => {
    if (showModalOnPress) {
      loadEntriesForDate(day.dateString);
    }
    if (onDateSelect) {
      onDateSelect(day); // allow both to fire if needed
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Your Wellness Calendar</Text>

      <Calendar
        markedDates={markedDates}
        markingType={'multi-dot'}
        onDayPress={handleDayPress}
        current={selectedDate || new Date().toISOString().split('T')[0]} // ✅ fallback to today
      />


      {!onDateSelect && (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Journal')}
          >
            <Text style={styles.buttonText}>➕ New Entry</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('TrendReport')}
          >
            <Text style={styles.buttonText}>📊 Weekly Report</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Entry Modal */}
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
              if (entry.isSleep) {
                return (
                  <View key={i} style={styles.entryBlock}>
                    <Text style={styles.entryTime}>Sleep Log:</Text>
                    <Text>🛌 Slept: {entry.sleepDuration?.toFixed(1)} hrs</Text>
                    <Text>💤 Quality: {entry.qualityRating || '—'}/10</Text>
                  </View>
                );
              }
              const time = new Date(entry.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              return (
                <View
                  key={i}
                  style={[
                    styles.entryBlock,
                    { backgroundColor: getMoodColor(entry.moodScore) },
                  ]}
                >
                  <Text style={styles.entryTime}>{time}</Text>
                  <Text style={styles.entryText}>📝 {entry.entry}</Text>
                  <Text style={styles.responseText}>
                    💬 {entry.supportiveMessage || '—'}
                  </Text>
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
    backgroundColor: '#eafaf1',
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2f5d50',
  },
  button: {
    backgroundColor: '#2f5d50',
    padding: 14,
    borderRadius: 10,
    marginTop: 15,
    marginHorizontal: 20,
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

