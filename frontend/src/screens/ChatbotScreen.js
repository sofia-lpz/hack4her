import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatbotScreen() {
  const [message, setMessage] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.link}>← Atrás</Text>
        <Text style={styles.title}>Chatbot</Text>
        <Text style={styles.link}>Ayuda</Text>
      </View>

      {/* Bot icon */}
      <View style={styles.iconContainer}>
        <Ionicons name="chatbubble-ellipses" size={60} color="#C31F39" />
      </View>

      {/* Chat messages */}
      <ScrollView style={styles.messages} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.bubbleLeft}><Text style={styles.bubbleLeftText}>Hola, ¿en qué te ayudo?</Text></View>
        <View style={styles.bubbleRight}><Text style={styles.bubbleRightText}>¿Dónde está el hospital?</Text></View>
        <View style={styles.bubbleLeft}><Text style={styles.bubbleLeftText}>Puedes encontrarlo en el mapa.</Text></View>
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Habla con el asistente virtual"
          placeholderTextColor="#888"
          value={message}
          onChangeText={setMessage}
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderColor: '#d91c34',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  link: {
    color: '#d91c34',
    fontWeight: '500',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  messages: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bubbleLeft: {
    alignSelf: 'flex-start',
    backgroundColor: '#C31F39',
    padding: 15,
    marginVertical: 6,
    borderRadius: 20,
    borderBottomLeftRadius: 0,
  },
  bubbleRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#f2f2f2',
    padding: 15,
    marginVertical: 6,
    borderRadius: 20,
    borderBottomRightRadius: 0,
  },
  bubbleLeftText: {
    color: '#fff',
  },
  bubbleRightText: {
    color: '#888',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    elevation: 3,
  },
  input: {
    flex: 1,
    color: '#000',
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: '#C31F39',
    padding: 10,
    borderRadius: 20,
  },
});
