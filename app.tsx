import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import Game from './(tabs)/Game';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Game />
    </SafeAreaView>
  );
};

export default App;
