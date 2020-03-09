import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


import Proflie from './profile';
export default function App() {
  return (
    <View style={{ flex: 1, alignItems: "center", marginTop: 100 }}>
    <Proflie />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
