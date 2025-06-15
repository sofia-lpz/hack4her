import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../api/authContext';
import AuthStack from './AuthStack';
import TabNavigator from './TabNavigator';
import AdminPanel from '../screens/AdminPanel';

export default function MainNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {!user && <AuthStack />}
      {user?.role === 'user' && <TabNavigator />}
      {user?.role === 'admin' && <AdminPanel />}
    </NavigationContainer>
  );
}
