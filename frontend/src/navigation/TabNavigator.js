import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from '../screens/ChatbotScreen';
import MapScreen from '../screens/Maps';
// import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Mapa" component={MapScreen} />
      {/* <Tab.Screen name="Perfil" component={ProfileScreen} /> */}
    </Tab.Navigator>
  );
}
