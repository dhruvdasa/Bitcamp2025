import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const prompts = ['orange', 'blue', 'gray', 'magenta', 'purple', 'round', 'smooth', 'multi-colored'];

const GroundingAI = () => {
  const [promptChars, setPromptChars] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [responseText, setResponseText] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    randomizePrompt();
  }, []);

  const randomizePrompt = () => {
    const char = prompts[Math.floor(Math.random() * prompts.length)];
    setPromptChars(char);
    setPhoto(null);
    setResponseText(null);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.6,
    });

    if (!result.canceled && result.assets?.[0]?.base64) {
      const photoData = result.assets[0];
      setPhoto(photoData);
      sendToBackend(photoData.base64);
    }
  };

  const sendToBackend = async (base64) => {
    setLoading(true);
    try {
      console.log('📤 Sending image to backend...', promptChars);//192.168.128.1
      const res = await fetch('https://bitcamp2025-1.onrender.com/analyze-image', {//http://172.23.28.11:3001/analyze-image
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64,
          promptChars,
        }),
      });

      const data = await res.json();
      console.log('✅ Response from backend:', data);
      setResponseText(data.result || 'No response from AI.');
    } catch (err) {
      console.error('Error:', err);
      Alert.alert('Error', 'Failed to reach the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
    source={require('../assets/magglass.png')}  // adjust path if needed
    style={styles.background}
    resizeMode="contain"
  >
    <View style={styles.overlay}>
      <Text style={styles.title}>Find something {promptChars}!</Text>

      {photo && (
        <Image source={{ uri: photo.uri }} style={styles.preview} />
      )}

      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>📸 Take Photo</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#2f5d50" />}

      {responseText && (
        <View style={styles.responseBox}>
          <Text style={styles.responseText}>{responseText}</Text>
          <TouchableOpacity onPress={randomizePrompt} style={styles.retryButton}>
            <Text style={styles.retryText}>🔁 Try Another</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(234, 250, 241, 0.85)', // optional: adds a soft tint for readability
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    flex: 1,
    backgroundColor: '#eafaf1',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
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
  },
  buttonText: {
    fontSize: 18,
    color: '#1e3d34',
    fontWeight: '600',
  },
  preview: {
    width: '90%',
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  responseBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  responseText: {
    fontSize: 16,
    color: '#2f5d50',
  },
  retryButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  retryText: {
    color: '#1e3d34',
    fontWeight: '600',
  },
});

export default GroundingAI;

