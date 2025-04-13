import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import JournalCalendar from '../components/JournalCalendar';

export default function SleepTrackerScreen() {
  const [bedTime, setBedTime] = useState(null);
  const [wakeTime, setWakeTime] = useState(null);
  const [qualityRating, setQualityRating] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const [showBedPicker, setShowBedPicker] = useState(false);
  const [showWakePicker, setShowWakePicker] = useState(false);

  const handleSaveSleep = async () => {
    if (!bedTime || !wakeTime || !qualityRating) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    const date = selectedDate || new Date().toISOString().split('T')[0];
    const sleepDuration = calculateSleepDuration(bedTime, wakeTime);

    const data = {
      date,
      bedTime: bedTime.toISOString(),
      wakeTime: wakeTime.toISOString(),
      sleepDuration,
      qualityRating: parseInt(qualityRating),
    };

    try {
      await AsyncStorage.setItem(`sleep-${date}`, JSON.stringify(data));
      Alert.alert('Success', 'Sleep data saved.');
      clearInputs();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save sleep data.');
    }
  };

  const calculateSleepDuration = (bed, wake) => {
    const bedHour = bed.getHours() + bed.getMinutes() / 60;
    const wakeHour = wake.getHours() + wake.getMinutes() / 60;
    let duration = wakeHour - bedHour;
    if (duration < 0) duration += 24;
    return duration;
  };

  const clearInputs = () => {
    setBedTime(null);
    setWakeTime(null);
    setQualityRating('');
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    console.log('Selected date in Sleep Tracker:', day.dateString);
  };

  const formatTime = (date) => {
    if (!date) return 'Select Time';
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${suffix}`;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.header}>😴 Sleep Tracker</Text>

            <Text style={styles.label}>Bedtime</Text>
            <Button title={formatTime(bedTime)} onPress={() => setShowBedPicker(true)} />
            {showBedPicker && (
              <DateTimePicker
                value={bedTime || new Date()}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={(event, selected) => {
                  setShowBedPicker(false);
                  if (selected) setBedTime(selected);
                }}
              />
            )}

            <Text style={styles.label}>Wake-up Time</Text>
            <Button title={formatTime(wakeTime)} onPress={() => setShowWakePicker(true)} />
            {showWakePicker && (
              <DateTimePicker
                value={wakeTime || new Date()}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={(event, selected) => {
                  setShowWakePicker(false);
                  if (selected) setWakeTime(selected);
                }}
              />
            )}

            <Text style={styles.label}>Sleep Quality (1–10)</Text>
            <View style={styles.qualityRow}>
              {[...Array(10)].map((_, i) => (
                <Button
                  key={i + 1}
                  title={(i + 1).toString()}
                  onPress={() => setQualityRating((i + 1).toString())}
                  color={qualityRating === (i + 1).toString() ? '#2f5d50' : '#ccc'}
                />
              ))}
            </View>

            <Button title="Save Sleep Log" onPress={handleSaveSleep} />

            <JournalCalendar
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
            
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f1faff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f5d50',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
    color: '#2f5d50',
  },
  qualityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
    justifyContent: 'center',
  },
});
