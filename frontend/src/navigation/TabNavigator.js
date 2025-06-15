import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatbotScreen from '../screens/ChatbotScreen';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function MapsScreen() {
  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Maps</Text></View>;
}

function PerfilScreen() {
  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Perfil</Text></View>;
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Chatbot') iconName = 'chatbubble';
          else if (route.name === 'Maps') iconName = 'map';
          else if (route.name === 'Perfil') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#d91c34',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Chatbot" component={ChatbotScreen} />
      <Tab.Screen name="Maps" component={MapsScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}
