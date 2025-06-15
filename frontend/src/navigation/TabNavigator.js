import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from '../screens/ChatbotScreen';
import MapScreen from '../screens/Maps';
import Citas from '../screens/Citas';
import AdminPanel from '../screens/AdminPanel';
// import ProfileScreen from '../screens/ProfileScreen'; // si tienes pantalla de perfil
import { useAuth } from '../api/authContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Tab.Navigator
      initialRouteName={isAdmin ? 'PanelAdmin' : 'Chat'}
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#d91c34',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 70,
          paddingBottom: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Chat') {
            iconName = focused ? 'send' : 'send-outline';
            return <Ionicons name={iconName} size={24} color={color} />;
          } else if (route.name === 'Mapa') {
            iconName = focused ? 'map' : 'map-outline';
            return <Ionicons name={iconName} size={24} color={color} />;
          } else if (route.name === 'Citas') {
            iconName = focused ? 'calendar' : 'calendar-outline';
            return <Ionicons name={iconName} size={24} color={color} />;
          // } else if (route.name === 'Perfil') {
          //   iconName = focused ? 'person' : 'person-outline';
          //   return <Ionicons name={iconName} size={24} color={color} />;
          } else if (route.name === 'PanelAdmin') {
            iconName = focused ? 'shield-checkmark' : 'shield-outline';
            return <Ionicons name={iconName} size={24} color={color} />;
          }

          return null;
        },
      })}
    >
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Mapa" component={MapScreen} />
      <Tab.Screen name="Citas" component={Citas} />
      {isAdmin ? (
        <Tab.Screen name="PanelAdmin" component={AdminPanel} />
      ) : null}
    </Tab.Navigator>
  );
}
