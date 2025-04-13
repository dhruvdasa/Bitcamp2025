import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PetalContext = createContext();
export const usePetals = () => useContext(PetalContext);

export const PetalProvider = ({ children }) => {
  const [petals, setPetals] = useState(0);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('petalCount');
      setPetals(parseInt(stored) || 0);
    })();
  }, []);

  const add = async (n) => {
    const total = petals + n;
    setPetals(total);
    await AsyncStorage.setItem('petalCount', total.toString());
  };

  return (
    <PetalContext.Provider value={{ petals, add }}>
      {children}
    </PetalContext.Provider>
  );
};
