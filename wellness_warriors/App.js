import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import JournalScreen from './screens/Journal';
import JournalCalendarScreen from './screens/JournalCalendar';
import Grounding from './screens/Grounding';

const SleepScreen = () => <Screen title="😴 Sleep Tracker" />;
const HallucinationScreen = () => <Screen title="👁️ Hallucination Breaker" />;

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true, headerStyle: { backgroundColor: '#a7d7c5' } }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Wellness Warriors 🌿' }} />
        <Stack.Screen name="JournalCalendar" component={JournalCalendarScreen} options={{ title: 'Journal Calendar' }} />
        <Stack.Screen name="Journal" component={JournalScreen} options={{ title: 'New Journal Entry' }} />
        <Stack.Screen name="Sleep" component={SleepScreen} />
        <Stack.Screen name="Hallucination" component={HallucinationScreen} />
        <Stack.Screen name="Grounding" component={Grounding} options={{ title: 'Grounding' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 🌼</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('JournalCalendar')}>
        <Text style={styles.buttonText}>📝 Journal</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Sleep')}>
        <Text style={styles.buttonText}>😴 Sleep Tracker</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Hallucination')}>
        <Text style={styles.buttonText}>👁️ Hallucination Breaker</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Grounding')}>
        <Text style={styles.buttonText}>🌱 Grounding Tool</Text>
      </TouchableOpacity>
    </View>
  );
};

const Screen = ({ title }) => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eafaf1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2f5d50',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#a8dbc3',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    color: '#1e3d34',
    fontWeight: '600',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eafaf1',
  },
  screenText: {
    fontSize: 24,
    color: '#2f5d50',
    fontWeight: 'bold',
  },
});
