// src/navigation/AppStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import AddCita from '../screens/AddCita';
import Feedback from '../screens/Feedback';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Back"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddCita"
        component={AddCita}
        options={{ title: 'Nueva Cita' }}
      />
      <Stack.Screen
        name="Feedback"
        component={Feedback}
        options={{ title: 'Feedback' }}
      />
    </Stack.Navigator>
    
  );
}
