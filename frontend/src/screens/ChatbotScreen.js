import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { fetchChat } from '../api/dataProvider';

export default function ChatbotScreen() {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { text: 'Hi, ¿What can i help you with?', isUser: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();

  const handleSend = async () => {
    if (!message.trim()) return;
    
    const userMessage = message;
    setMessage('');
    
    // Add user message to chat
    setChatMessages(prevMessages => [
      ...prevMessages,
      { text: userMessage, isUser: true }
    ]);
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    try {
      setIsLoading(true);
      // Call API with user message
      const apiResponse = await fetchChat(userMessage);
      
      // Handle the new response format
      let botMessage = 'Lo siento, hubo un problema. Intenta de nuevo.';
      console.log('API Response:', apiResponse);
      
      if (apiResponse && apiResponse.success) {
        // Extract message from the response field
        botMessage = apiResponse.response || botMessage;
      } else if (apiResponse && apiResponse.response) {
        // Fallback to response field even if success is false
        botMessage = apiResponse.response;
      } else if (apiResponse && apiResponse.message) {
        // Fallback to old message field format
        botMessage = apiResponse.message;
      }
      
      // Add bot response to chat
      setChatMessages(prevMessages => [
        ...prevMessages,
        { text: botMessage, isUser: false }
      ]);
    } catch (error) {
      console.error('Chat API error:', error);
      // Add error message
      setChatMessages(prevMessages => [
        ...prevMessages,
        { text: 'Lo siento, hubo un problema con la conexión. Intenta de nuevo más tarde.', isUser: false }
      ]);
    } finally {
      setIsLoading(false);
      // Scroll to bottom again after response
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

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
      <ScrollView 
        style={styles.messages} 
        contentContainerStyle={{ paddingBottom: 20 }}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {chatMessages.map((msg, index) => (
          <View 
            key={index} 
            style={msg.isUser ? styles.bubbleRight : styles.bubbleLeft}
          >
            <Text style={msg.isUser ? styles.bubbleRightText : styles.bubbleLeftText}>
              {msg.text}
            </Text>
          </View>
        ))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#C31F39" />
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Habla con el asistente virtual"
          placeholderTextColor="#888"
          value={message}
          onChangeText={setMessage}
          style={styles.input}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={handleSend}
          disabled={isLoading || !message.trim()}
        >
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
  loadingContainer: {
    padding: 10,
    alignItems: 'center',
  },
});