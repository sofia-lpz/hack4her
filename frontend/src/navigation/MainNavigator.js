import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../api/authContext'; // Asegúrate de que sea correcto
import AuthStack from './AuthStack';
import TabNavigator from './TabNavigator';
import AdminPanel from '../screens/AdminPanel';
import AppStack from './AppStack';

export default function MainNavigator() {
  const { user } = useAuth();

  let content;

  // if (!user) {
  //   content = <AuthStack />;
  // } else if (user.role === 'user') {
  //   content = <TabNavigator />;
  // } else if (user.role === 'admin') {
  //   content = <TabNavigator />;
  // }

  return (
    // <NavigationContainer>
    //   {content}
    // </NavigationContainer>
    <NavigationContainer>
      {!user ? <AuthStack /> : <AppStack />}
    </NavigationContainer>
  );
}
