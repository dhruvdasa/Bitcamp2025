// --- FlowerGallery.js ---
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Animated, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const flowerData = [
  { name: 'Daisy', petals: 0 },
  { name: 'Tulip', petals: 10 },
  { name: 'Rose', petals: 20 },
  { name: 'Sunflower', petals: 30 },
  { name: 'Orchid', petals: 40 },
  { name: 'Lily', petals: 50 },
  { name: 'Marigold', petals: 60 },
  { name: 'Cherry Blossom', petals: 70 },
];

const flowerImages = {
  daisy: require('../assets/flowers/daisy.png'),
  tulip: require('../assets/flowers/tulip.png'),
  rose: require('../assets/flowers/rose.png'),
  sunflower: require('../assets/flowers/sunflower.png'),
  orchid: require('../assets/flowers/orchid.png'),
  lily: require('../assets/flowers/lily.png'),
  marigold: require('../assets/flowers/marigold.png'),
  cherryblossom: require('../assets/flowers/cherryblossom.png'),
  seed: require('../assets/flowers/seed.png'),
};

export default function FlowerGallery() {
  const [petals, setPetals] = useState(0);
  const [animations, setAnimations] = useState([]);

  useEffect(() => {
    loadPetals();
    setAnimations(flowerData.map(() => new Animated.Value(1)));
  }, []);

  const loadPetals = async () => {
    const stored = await AsyncStorage.getItem('petalCount');
    setPetals(parseInt(stored) || 0);
  };

  const animateFlower = (index) => {
    Animated.sequence([
      Animated.timing(animations[index], {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animations[index], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderItem = ({ item, index }) => {
    const isUnlocked = petals >= item.petals;
    const flowerKey = item.name.toLowerCase();
  
    // Prevent undefined animation crash
    const scaleAnim = animations[index] || new Animated.Value(1);
  
    return (
      <TouchableOpacity onPress={() => animateFlower(index)}>
        <Animated.Image
          source={isUnlocked ? flowerImages[flowerKey] : flowerImages['seed']}
          style={[styles.image, { transform: [{ scale: scaleAnim }] }]}
          resizeMode="contain"
        />
        <Text style={styles.label}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require('../assets/flowers/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>🌼 Flower Garden</Text>
        <Text style={styles.subtitle}>Petals: {petals}</Text>
        <FlatList
          data={flowerData}
          keyExtractor={(item) => item.name}
          renderItem={renderItem}
          contentContainerStyle={styles.gallery}
          numColumns={2}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.85)', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#3b3b3b' },
  subtitle: { textAlign: 'center', marginBottom: 10, color: '#6a6a6a' },
  gallery: { alignItems: 'center', paddingVertical: 20 },
  image: { width: 100, height: 100, margin: 10 },
  label: { textAlign: 'center', fontSize: 14, marginBottom: 10 },
});