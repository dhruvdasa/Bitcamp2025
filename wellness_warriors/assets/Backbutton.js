// assets/BackButton.js
import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

export default function BackButton({ navigation, to = 'Home' }) {
  return (
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate(to)}>
      <Text style={styles.backText}>← Back</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#f4e8d7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 5,
  },
  backText: {
    color: '#1e3d34',
    fontSize: 16,
    fontWeight: '600',
  },
})
