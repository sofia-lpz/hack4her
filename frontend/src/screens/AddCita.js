import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { fetchStores, fetchUsers, postCitas } from '../api/dataProvider';

export default function AddCita({ navigation }) {
  // Date and time state
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Store selection state
  const [storeOpen, setStoreOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [stores, setStores] = useState([]);
  const [storeSearch, setStoreSearch] = useState('');
  
  // User selection state
  const [userOpen, setUserOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Toggle states
  const [confirmed, setConfirmed] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  // Close other dropdowns when one opens
  useEffect(() => {
    if (storeOpen) {
      setUserOpen(false);
    }
  }, [storeOpen]);

  useEffect(() => {
    if (userOpen) {
      setStoreOpen(false);
    }
  }, [userOpen]);

  const loadInitialData = async () => {
    try {
      setDataLoading(true);
      
      // Fetch stores data
      const storesData = await fetchStores();
      if (storesData && Array.isArray(storesData)) {
        const storeOptions = storesData.map(store => ({
          label: store.nombre || store.name || `Store ${store.id}`,
          value: store.id
        }));
        setStores(storeOptions);
      }
      
      // Fetch users data
      const usersData = await fetchUsers();
      if (usersData && Array.isArray(usersData)) {
        const userOptions = usersData.map(user => ({
          label: `${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`.trim() || `User ${user.id}`,
          value: user.id
        }));
        setUsers(userOptions);
      }
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Error', 'No se pudo cargar la información requerida.');
    } finally {
      setDataLoading(false);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}:00`;
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatDisplayTime = (date) => {
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate && event.type !== 'dismissed') {
      const currentDate = new Date(selectedDate);
      // Keep the time from the existing date
      const hours = date.getHours();
      const minutes = date.getMinutes();
      currentDate.setHours(hours, minutes);
      setDate(currentDate);
    }
    
    // For Android, hide picker after selection or dismissal
    if (Platform.OS === 'android' || event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
    if (selectedTime && event.type !== 'dismissed') {
      const currentDate = new Date(date);
      // Keep the date but update the time
      currentDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setDate(currentDate);
    }
    
    // For Android, hide picker after selection or dismissal
    if (Platform.OS === 'android' || event.type === 'dismissed') {
      setShowTimePicker(false);
    }
  };

  const validateForm = () => {
    if (!selectedStore) {
      Alert.alert('Error', 'Selecciona una tienda para la cita');
      return false;
    }

    if (!selectedUsers || selectedUsers.length === 0) {
      Alert.alert('Error', 'Selecciona al menos un usuario');
      return false;
    }

    // Check if date is in the past
    const now = new Date();
    if (date < now) {
      Alert.alert('Error', 'La fecha y hora no puede ser en el pasado');
      return false;
    }

    return true;
  };

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    setIsLoading(true);
    
    // Update the structure to match what the backend expects
    const appointmentData = {
      store_id: selectedStore,
      date: formatDate(date),
      time: formatTime(date),
      confirmada: confirmed,
      cancelada: cancelled,
      user_ids: [...selectedUsers] // Ensure this is an array
    };
    
    console.log('Sending appointment data:', appointmentData);
    
    const result = await postCitas(appointmentData);
    
    if (result) {  // Check for id instead of success flag
      Alert.alert(
        'Éxito',
        'Cita creada correctamente',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert('Error', 'No se pudo crear la cita');
    }
    
  } catch (error) {
    console.error('Error creating appointment:', error);
    Alert.alert('Error', 'No se pudo crear la cita. Por favor intenta de nuevo.');
  } finally {
    setIsLoading(false);
  }
};
  if (dataLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#C31F39" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Date and Time Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fecha y Hora</Text>
            
            <View style={styles.dateTimeContainer}>
              {/* Date Selector */}
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={20} color="#C31F39" />
                <Text style={styles.dateTimeText}>{formatDisplayDate(date)}</Text>
              </TouchableOpacity>
              
              {/* Time Selector */}
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time" size={20} color="#C31F39" />
                <Text style={styles.dateTimeText}>{formatDisplayTime(date)}</Text>
              </TouchableOpacity>
            </View>

            {/* Date Picker */}
            {showDatePicker && (
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  minimumDate={new Date()}
                  style={styles.picker}
                />
                {Platform.OS === 'ios' && (
                  <View style={styles.pickerButtons}>
                    <TouchableOpacity 
                      style={styles.pickerButton}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text style={styles.pickerButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.pickerButton, styles.pickerButtonDone]}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text style={[styles.pickerButtonText, styles.pickerButtonDoneText]}>Listo</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
            
            {/* Time Picker */}
            {showTimePicker && (
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={date}
                  mode="time"
                  is24Hour={true}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onTimeChange}
                  style={styles.picker}
                />
                {Platform.OS === 'ios' && (
                  <View style={styles.pickerButtons}>
                    <TouchableOpacity 
                      style={styles.pickerButton}
                      onPress={() => setShowTimePicker(false)}
                    >
                      <Text style={styles.pickerButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.pickerButton, styles.pickerButtonDone]}
                      onPress={() => setShowTimePicker(false)}
                    >
                      <Text style={[styles.pickerButtonText, styles.pickerButtonDoneText]}>Listo</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Store Selection */}
          <View style={[styles.section, { zIndex: storeOpen ? 3000 : 1 }]}>
            <Text style={styles.sectionTitle}>Tienda</Text>
            <DropDownPicker
              open={storeOpen}
              value={selectedStore}
              items={stores}
              setOpen={setStoreOpen}
              setValue={setSelectedStore}
              setItems={setStores}
              placeholder="Selecciona una tienda"
              searchable={true}
              searchPlaceholder="Buscar tienda..."
              style={styles.dropdownStyle}
              dropDownContainerStyle={styles.dropdownContainer}
              textStyle={styles.dropdownText}
              searchTextInputStyle={styles.searchTextInput}
              searchContainerStyle={styles.searchContainer}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
            />
          </View>

          {/* User Selection */}
          <View style={[styles.section, { zIndex: userOpen ? 2000 : 1 }]}>
            <Text style={styles.sectionTitle}>Usuarios</Text>
            <DropDownPicker
              open={userOpen}
              value={selectedUsers}
              items={users}
              setOpen={setUserOpen}
              setValue={setSelectedUsers}
              setItems={setUsers}
              multiple={true}
              multipleText={`${selectedUsers.length} usuario${selectedUsers.length !== 1 ? 's' : ''} seleccionado${selectedUsers.length !== 1 ? 's' : ''}`}
              placeholder="Selecciona usuarios"
              searchable={true}
              searchPlaceholder="Buscar usuario..."
              style={styles.dropdownStyle}
              dropDownContainerStyle={styles.dropdownContainer}
              textStyle={styles.dropdownText}
              searchTextInputStyle={styles.searchTextInput}
              searchContainerStyle={styles.searchContainer}
              mode="BADGE"
              badgeColors={["#C31F39"]}
              badgeTextStyle={{ color: "white" }}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
            />
          </View>

          {/* Status Toggles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estado</Text>
            
            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                style={styles.toggleRow}
                onPress={() => setConfirmed(!confirmed)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.checkbox,
                  confirmed && { backgroundColor: '#C31F39', borderColor: '#C31F39' }
                ]}>
                  {confirmed && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={styles.toggleText}>Confirmada</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.toggleRow, { borderBottomWidth: 0 }]}
                onPress={() => setCancelled(!cancelled)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.checkbox,
                  cancelled && { backgroundColor: '#C31F39', borderColor: '#C31F39' }
                ]}>
                  {cancelled && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={styles.toggleText}>Cancelada</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.submitButton, isLoading && styles.buttonDisabled]} 
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Crear Cita</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    width: '48%',
    borderWidth: 1,
    borderColor: '#d91c34',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateTimeText: {
    marginLeft: 10,
    color: '#333',
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  picker: {
    backgroundColor: '#fff',
  },
  pickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  pickerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  pickerButtonDone: {
    backgroundColor: '#d91c34',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#d91c34',
    fontWeight: '500',
  },
  pickerButtonDoneText: {
    color: '#fff',
  },
  dropdownStyle: {
    backgroundColor: '#fff',
    borderColor: '#d91c34',
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 50,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
    maxHeight: 200,
  },
  dropdownText: {
    color: '#333',
    fontSize: 16,
  },
  searchTextInput: {
    color: '#333',
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  searchContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  toggleContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  toggleText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#d91c34',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});