import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigation/TabNavigator';
import LoginScreen from './src/screens/Login';
import LoginRojoScreen from './src/screens/SplashScreen';

export default function App() {
  return (
    <NavigationContainer>
      <LoginRojoScreen />
    </NavigationContainer>
  );
}
