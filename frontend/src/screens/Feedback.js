import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { postFeedback, uploadFeedbackImage } from '../api/dataProvider';
import { AuthContext } from '../api/authContext'; 

const { width } = Dimensions.get('window');
const imageSize = (width - 60) / 3; // 3 images per row with padding

export default function AddFeedbackScreen({ route, navigation }) {

    // const { store_id, store_name } = route.params || {};
    const store_id = 20;
    let store_name = "Seven Eleven Parque Tecnológico"
  if (!store_id) {
    Alert.alert(
      'Error',
      'No se ha seleccionado una tienda',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  }
  
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImages, setAttachedImages] = useState([]);

  const handleCancel = () => {
    navigation.goBack();
  };

  const requestMediaLibraryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Se necesitan permisos para acceder a la galería de fotos.'
      );
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Se necesitan permisos para usar la cámara.'
      );
      return false;
    }
    return true;
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Agregar imagen',
      'Selecciona una opción',
      [
        {
          text: 'Camara',
          onPress: () => pickImageFromCamera(),
        },
        {
          text: 'Galeria',
          onPress: () => pickImageFromGallery(),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const pickImageFromCamera = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      addImageToState(result.assets[0]);
    }
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      addImageToState(result.assets[0]);
    }
  };

  const addImageToState = (imageAsset) => {
    // Generate unique ID for the image
    const timestamp = Date.now();
    const filename = `feedback_${timestamp}.jpg`;

    // Add to attached images state without saving to filesystem
    const newImage = {
      id: timestamp,
      uri: imageAsset.uri,
      filename: filename,
      width: imageAsset.width,
      height: imageAsset.height,
    };

    setAttachedImages(prev => [...prev, newImage]);
    console.log('Image added to state:', newImage);
  };

  const removeImage = (imageId) => {
    // Simply remove from state - no filesystem operations needed
    setAttachedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const uploadImages = async (images) => {
    const uploadPromises = images.map(async (image) => {
      try {
        console.log(`Uploading image: ${image.filename}`);
        const uploadResult = await uploadFeedbackImage(image);
        console.log(`Image uploaded successfully: ${image.filename}`, uploadResult);
        return {
          ...image,
          uploadResult,
          uploaded: true
        };
      } catch (error) {
        console.error(`Failed to upload image ${image.filename}:`, error);
        return {
          ...image,
          uploadError: error.message,
          uploaded: false
        };
      }
    });

    return await Promise.all(uploadPromises);
  };

const handleSend = async () => {
  if (!feedback.trim()) {
    Alert.alert('Error', 'Por favor escribe tu comentario antes de enviar');
    return;
  }

  if (!store_id) {
    Alert.alert('Error', 'No se ha seleccionado una tienda');
    return;
  }

  setIsLoading(true);
  
  try {
    // Then post the feedback with image references
    await postFeedbackMessage();
  } catch (error) {
    console.error('Error during feedback submission:', error);
    Alert.alert('Error', 'No se pudo enviar el comentario. Intenta más tarde.');
  } finally {
    setIsLoading(false);
  }
};
  const postFeedbackMessage = async () => {
    try {
      const feedbackData = {
        user_id: 1,
        store_id: store_id,  
        comment: feedback,
      };

      response = await postFeedback(feedbackData);
      
      Alert.alert(
        'Comentario enviado', 
      'Tu comentario ha sido enviado exitosamente.',
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', 'No se pudo enviar el comentario. Intenta más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderImageItem = (image) => (
    <View key={image.id} style={styles.imageContainer}>
      <Image source={{ uri: image.uri }} style={styles.attachedImage} />
      <TouchableOpacity
        style={styles.removeImageButton}
        onPress={() => removeImage(image.id)}
        disabled={isLoading}
      >
        <Ionicons name="close-circle" size={24} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with store info */}
        <View style={styles.storeInfoContainer}>
          <Ionicons name="location" size={24} color="#C31F39" />
          <Text style={styles.storeName}>{store_name}</Text>
        </View>

        {/* Feedback input */}
        <View style={styles.feedbackContainer}>
          <Text style={styles.label}>Tu comentario</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Comparte tu experiencia en esta tienda..."
            placeholderTextColor="#aaa"
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
            value={feedback}
            onChangeText={setFeedback}
            editable={!isLoading}
          />
        </View>

        {/* Image attachment section */}
        <View style={styles.imageSection}>
          <View style={styles.imageSectionHeader}>
            <Text style={styles.label}>Imágenes</Text>
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={showImagePickerOptions}
              disabled={isLoading || attachedImages.length >= 6}
            >
              <Ionicons name="camera" size={20} color="#d91c34" />
              <Text style={styles.addImageText}>Agregar</Text>
            </TouchableOpacity>
          </View>
          
          {attachedImages.length > 0 && (
            <View style={styles.imagesGrid}>
              {attachedImages.map(renderImageItem)}
            </View>
          )}
          
          {attachedImages.length >= 6 && (
            <Text style={styles.maxImagesText}>Máximo 6 imágenes permitidas</Text>
          )}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.sendButton, isLoading && styles.buttonDisabled]} 
            onPress={handleSend}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.sendButtonText}>
                Enviar{attachedImages.length > 0 ? ` (${attachedImages.length})` : ''}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  storeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 7,
    color: '#333',
  },
  feedbackContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#d91c34',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 140,
  },
  imageSection: {
    marginBottom: 20,
  },
  imageSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d91c34',
  },
  addImageText: {
    color: '#d91c34',
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 14,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  attachedImage: {
    width: imageSize,
    height: imageSize,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  maxImagesText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingVertical: 14,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  sendButton: {
    flex: 1,
    backgroundColor: '#d91c34',
    paddingVertical: 14,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});