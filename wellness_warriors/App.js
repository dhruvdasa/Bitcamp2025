import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Screens
import JournalScreen from './screens/Journal';
import SleepTrackerScreen from './screens/SleepTracker';
import Grounding from './screens/Grounding';
import TrendReportScreen from './screens/TrendReportScreen'
import { Image } from 'react-native'
import Panic from './screens/Panic'

import FlowerScreen from './screens/FlowerGallery';

// Context
import { PetalProvider } from './contexts/PetalContext';

const HallucinationScreen = () => <Screen title="👁️ Hallucination Breaker" />;
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PetalProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: true,
            headerStyle: { backgroundColor: '#a7d7c5' },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Journal" component={JournalScreen} />
          <Stack.Screen name="Sleep" component={SleepTrackerScreen} />
          <Stack.Screen name="Grounding" component={Grounding} />
          <Stack.Screen name="TrendReport" component={TrendReportScreen} options={{ title: 'Trend Report' }} />
          <Stack.Screen name="FlowerScreen" component={FlowerScreen} />
          <Stack.Screen name="Hallucination" component={HallucinationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PetalProvider>
  );
}

// --- Home Screen with proper navigation ---
const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Top logo */}
      <Image source={require('./assets/AnchorLogowithWords.png')} style={styles.logo} />

      {/* Bottom nav bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate('JournalCalendar')}>
          <Image source={require('./assets/Journal.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Sleep')}>
          <Image source={require('./assets/SleepTracker.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Panic')}>
          <Image source={require('./assets/SOS.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Grounding')}>
          <Image source={require('./assets/Grounding.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('FlowerGarden')}>
          <Image source={require('./assets/FlowerGarden.png')} style={styles.icon} />
        </TouchableOpacity>
        
      </View>
      <Text style={styles.title}>Welcome 🌼</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Journal')}>
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

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TrendReport')}>
        <Text style={styles.buttonText}>📊 Weekly Trends</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FlowerScreen')}>
        <Text style={styles.buttonText}>Flower Screen</Text>
      </TouchableOpacity>

    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffdfa',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00800',
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
  logo: {
    width: 280, // ⬆️ increase size slightly
    height: 280,
    resizeMode: 'contain',
    marginTop: 5, // ⬆️ move up by reducing margin
    marginBottom: 170,
    alignSelf: 'center',
  },
  navBar: {
    position: 'absolute',
    bottom:  35, // 👈 raised slightly from bottom edge
    left: 20,
    right: 20,
    height: 47,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f4e8d7',
    borderRadius: 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    paddingBottom: 6.5,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});
