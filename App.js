import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


import Proflie from './profile';
import Main from './profile/story';
export default function App() {
  return (
    <View style={{ flex: 1, alignItems: "center", marginTop: 100 }}>
    <Proflie />
    <Main />
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
