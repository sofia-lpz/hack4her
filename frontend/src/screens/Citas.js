import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { fetchCitas, fetchStores } from '../api/dataProvider';

export default function Citas() {
  const navigation = useNavigation();
  const [citas, setCitas] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, []);

const loadData = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Fetch both citas and stores data
    const [citasResponse, storesResponse] = await Promise.all([
      fetchCitas(),
      fetchStores()
    ]);

    if (citasResponse.success) {
      setCitas(citasResponse.data);
    } else {
      throw new Error('Failed to fetch citas');
    }

    // Store the stores data properly
    if (storesResponse) {
      setStores(storesResponse);
    } else {
      throw new Error('Failed to fetch stores');
    }

  } catch (err) {
    console.error('Error loading data:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  // Get store name by store_id
const getStoreName = (storeId) => {
  const store = stores.find(s => s.id === storeId);
  return store ? store.nombre : `Store ID: ${storeId}`;
};

  // Format date and time for display
  const formatDateTime = (date, time) => {
    const dateObj = new Date(date);
    const [hours, minutes] = time.split(':');
    dateObj.setHours(parseInt(hours), parseInt(minutes));
    
    return dateObj.toLocaleString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Determine appointment status based on API fields
  const getAppointmentStatus = (cita) => {
    if (cita.cancelada) return 'cancelada';
    if (cita.confirmada) return 'confirmada';
    return 'pendiente';
  };

  // Check if appointment is completed (past date)
  const isAppointmentCompleted = (date, time) => {
    const appointmentDateTime = new Date(date);
    const [hours, minutes] = time.split(':');
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));
    
    return appointmentDateTime < new Date();
  };

  const getCheckColor = estado => {
    switch (estado) {
      case 'pendiente':
        return '#FFD054'; // amarillo
      case 'confirmada':
        return '#4CAF50'; // verde
      case 'cancelada':
        return '#C31F39'; // rojo
      default:
        return '#555';
    }
  };

  const renderCheck = (completada, estado) => (
    <Ionicons
      name={completada ? 'checkmark-circle' : 'ellipse'}
      size={24}
      color={completada ? '#aaa' : getCheckColor(estado)}
    />
  );

  // Sort appointments: incomplete first, then by date
  const citasOrdenadas = [...citas].sort((a, b) => {
    const aCompleted = isAppointmentCompleted(a.date, a.time);
    const bCompleted = isAppointmentCompleted(b.date, b.time);
    
    if (aCompleted === bCompleted) {
      // If both have same completion status, sort by date
      return new Date(a.date) - new Date(b.date);
    }
    return aCompleted ? 1 : -1;
  });

  // Navigate to AddCita page
  const handleAddCita = () => {
    navigation.navigate('AddCita');
  };

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#C31F39" />
        <Text style={styles.loadingText}>Cargando citas...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="alert-circle" size={50} color="#C31F39" />
        <Text style={styles.errorText}>Error al cargar las citas</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
        <TouchableOpacity onPress={loadData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Citas</Text>
        <TouchableOpacity onPress={handleAddCita} style={styles.addButton}>
          <Ionicons name="add" size={28} color="#C31F39" />
        </TouchableOpacity>
      </View>

      {citas.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="calendar-outline" size={50} color="#888" />
          <Text style={styles.empty}>No tienes citas aún.</Text>
        </View>
      ) : (
        <FlatList
          data={citasOrdenadas}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => {
            const status = getAppointmentStatus(item);
            const completed = isAppointmentCompleted(item.date, item.time);
            const storeName = getStoreName(item.store_id);
            const dateTime = formatDateTime(item.date, item.time);
            
            return (
              <View
                style={[
                  styles.citaItem,
                  completed && { backgroundColor: '#f2f2f2', borderColor: '#ccc' },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.citaTienda}>{storeName}</Text>
                  <Text style={styles.citaFecha}>{dateTime}</Text>
                  
                  {/* Show users assigned to this appointment */}
                  {item.users && item.users.length > 0 && (
                    <Text style={styles.citaUsers}>
                      Asignado a: {item.users.map(u => `${u.first_name} ${u.last_name}`).join(', ')}
                    </Text>
                  )}
                  
                  {/* Status indicator */}
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: getCheckColor(status) }]} />
                    <Text style={[styles.statusText, { color: getCheckColor(status) }]}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.checkboxContainer}>
                  {renderCheck(completed, status)}
                </View>
              </View>
            );
          }}
          refreshing={loading}
          onRefresh={loadData}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#f6f8fa',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e1e1e',
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(195, 31, 57, 0.1)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C31F39',
    textAlign: 'center',
  },
  errorSubtext: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#C31F39',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  empty: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },
  citaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  citaTienda: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1e1e1e',
    marginBottom: 4,
  },
  citaFecha: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  citaUsers: {
    fontSize: 12,
    color: '#777',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  checkboxContainer: {
    marginLeft: 12,
  },
});