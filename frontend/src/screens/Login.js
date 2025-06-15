import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { login } from '../api/dataProvider';
import { useAuth } from '../api/authContext'; // <-- asegúrate que existe y esté configurado


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login: setUserContext } = useAuth();

  const handleLogin = async () => {
  if (!email.trim() || !password.trim()) {
    Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
    return;
  }

  setIsLoading(true);

  try {
    const userData = await login(email, password); // <-- tu función API
    
    console.log('Login successful:', userData);

    // Validar que venga el rol desde backend
    if (userData?.data?.role === 'admin' || userData?.data?.role === 'user') {
      setUserContext(userData.data); 
    } else {
      Alert.alert('Error', 'Rol no reconocido.');
    }

  } catch (error) {
    console.error('Login error:', error);

    let errorMessage = 'Error al iniciar sesión. Intenta de nuevo.';

    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'Credenciales incorrectas.';
      } else if (error.response.status === 404) {
        errorMessage = 'Usuario no encontrado.';
      } else if (error.response.status >= 500) {
        errorMessage = 'Error del servidor. Intenta más tarde.';
      }
    } else if (error.request) {
      errorMessage = 'Error de conexión.';
    }

    Alert.alert('Error de inicio de sesión', errorMessage);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Contenedor centrado */}
      <View style={styles.centeredContent}>
        {/* Logo */}
        <Image
          source={require('../../assets/logo-rojo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        {/* Título */}
        <Text style={styles.title}>Ingresa a tu cuenta</Text>
        <Text style={styles.subtitle}>Ingresa tu usuario y contraseña para acceder</Text>
        
        {/* Inputs */}
        <TextInput
          placeholder="Correo electrónico"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
        
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Contraseña"
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!isLoading}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>
        
        {/* Botón Login */}
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logo: {
    width: 100,
    height: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
  },
  subtitle: {
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  passwordContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#d91c34',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});