import {View, StyleSheet, Image, KeyboardAvoidingView, Platform} from 'react-native';

export default function SplashScreen({ navigation }) {

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >

      {/* Contenedor centrado */}
      <View style={styles.centeredContent}>
        {/* Logo */}
        <Image
          source={require('../../assets/logo-blanco.png')}
          style={styles.logo}
          resizeMode="contain"
        />

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C31F39',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logo: {
    width: '65%',
    marginBottom: 7,
  }
});