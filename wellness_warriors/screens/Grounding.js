import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType } from 'expo-camera';

const prompts = [
  "Find something red",
  "Show me a flower",
  "Point to the sky",
  "Find something soft",
  "Find something green",
  "Find something round",
  "Show me a cloud",
  "Find something that smells good",
];

export default function Grounding() {
  const [hasPermission, setHasPermission] = useState(null);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await CameraView.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    generateNewPrompt();
  }, []);

  const generateNewPrompt = () => {
    const random = prompts[Math.floor(Math.random() * prompts.length)];
    setPrompt(random);
  };

  const takePicture = async () => {
    try {
      Alert.alert("Photo captured!", "You found something real! Great job grounding. 🌱");
      generateNewPrompt(); // Give a new task
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not take photo.");
    }
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={CameraType.Back}
      >
        <View style={styles.overlay}>
          <Text style={styles.prompt}>{prompt}</Text>

          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.buttonText}>📷 Capture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 20,
  },
  prompt: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
    backgroundColor: '#00000080',
    padding: 12,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#2f5d50',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType } from 'expo-camera';

const prompts = [
  "Find something red",
  "Show me a flower",
  "Point to the sky",
  "Find something soft",
  "Find something green",
  "Find something round",
  "Show me a cloud",
  "Find something that smells good",
];

export default function Grounding() {
  const [hasPermission, setHasPermission] = useState(null);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await CameraView.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    generateNewPrompt();
  }, []);

  const generateNewPrompt = () => {
    const random = prompts[Math.floor(Math.random() * prompts.length)];
    setPrompt(random);
  };

  const takePicture = async () => {
    try {
      Alert.alert("Photo captured!", "You found something real! Great job grounding. 🌱");
      generateNewPrompt(); // Give a new task
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not take photo.");
    }
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={CameraType.Back}
      >
        <View style={styles.overlay}>
          <Text style={styles.prompt}>{prompt}</Text>

          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.buttonText}>📷 Capture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 20,
  },
  prompt: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
    backgroundColor: '#00000080',
    padding: 12,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#2f5d50',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
