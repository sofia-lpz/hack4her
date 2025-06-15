import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigation/TabNavigator';
import LoginScreen from './src/screens/Login';
import LoginRojoScreen from './src/screens/SplashScreen';
import { AuthProvider } from './src/api/authContext';
import MainNavigator from './src/navigation/MainNavigator';

export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}
