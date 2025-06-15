import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../api/authContext'; // Asegúrate de que sea correcto
import AuthStack from './AuthStack';
import TabNavigator from './TabNavigator';
import AdminPanel from '../screens/AdminPanel';

export default function MainNavigator() {
  const { user } = useAuth();

  let content;

  if (!user) {
    content = <AuthStack />;
  } else if (user.role === 'user') {
    content = <TabNavigator />;
  } else if (user.role === 'admin') {
    content = <AdminPanel />;
  }

  return (
    <NavigationContainer>
      {content}
    </NavigationContainer>
  );
}
