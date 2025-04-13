// screens/PanicButton.js
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native'
import BackButton from '../assets/Backbutton'

const EMERGENCY_NUMBER = '2407560856'  // Replace with actual emergency number or load from user profile

export default function PanicButton({ navigation }) {
  const handlePanicPress = () => {
    Alert.alert(
      'Emergency Contact',
      'Are you sure you want to contact your emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          onPress: () => {
            Linking.openURL(`tel:${EMERGENCY_NUMBER}`)
          }
        }
      ]
    )
  }

  return (
    <View style={styles.container}>
      {/* 🔙 Back to Home */}
      <BackButton navigation={navigation} to="Home" />

      {/* 🚨 Panic Section */}
      <Text style={styles.label}>Tap the button below to contact your emergency contact</Text>

      <TouchableOpacity style={styles.panicButton} onPress={handlePanicPress}>
        <Text style={styles.panicText}>🚨 PANIC</Text>
      </TouchableOpacity>

      <Text style={styles.footerNote}>
        This will call the emergency number you configured.
      </Text>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff5f5',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    label: {
      fontSize: 18,
      color: '#aa0000',
      marginBottom: 20,
      fontWeight: '600',
    },
    panicButton: {
      backgroundColor: '#ff3b30',
      paddingVertical: 20,
      paddingHorizontal: 40,
      borderRadius: 100,
      elevation: 5,
    },
    panicText: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
    },
    footerNote: {
        marginTop: 30,
        fontSize: 14,
        color: '#aa0000',
        textAlign: 'center',
        fontStyle: 'italic',
      }
  })