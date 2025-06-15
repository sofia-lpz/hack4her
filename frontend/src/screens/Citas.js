import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import geojsonData from './assets/mapa.json';

export default function Citas() {
  const tiendas = geojsonData.features.map(f => f.properties.nombre);

  const [citas, setCitas] = useState([
    {
      id: '1',
      tienda: 'OXXO Paseo del Acueducto',
      fecha: '2025-06-15 10:00',
      estado: 'pendiente',
      completada: false,
    },
    {
      id: '2',
      tienda: 'H-E-B Contry',
      fecha: '2025-06-10 16:30',
      estado: 'cancelada',
      completada: false,
    },
    {
      id: '3',
      tienda: 'OXXO Paseo del Acueducto',
      fecha: '2025-06-05 09:00',
      estado: 'confirmada',
      completada: true,
    },
    {
      id: '4',
      tienda: 'H-E-B Contry',
      fecha: '2025-06-18 14:00',
      estado: 'pendiente',
      completada: false,
    },
  ]);

  const agregarCita = () => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        'Nueva cita',
        'Escribe el nombre exacto de la tienda:',
        nombreTienda => {
          if (!nombreTienda) return;
          const tiendaValida = tiendas.find(
            t => t.toLowerCase() === nombreTienda.toLowerCase()
          );
          if (tiendaValida) {
            const nuevaCita = {
              id: Date.now().toString(),
              tienda: tiendaValida,
              fecha: new Date().toLocaleString(),
              estado: 'pendiente',
              completada: false,
            };
            setCitas([...citas, nuevaCita]);
          } else {
            Alert.alert(
              'Tienda no encontrada',
              'Asegúrate de escribir el nombre correctamente.'
            );
          }
        }
      );
    } else {
      Alert.alert('Agregar cita', 'Esta función está simulada solo para iOS.');
    }
  };

  const toggleCompletada = id => {
    setCitas(prev =>
      prev.map(cita =>
        cita.id === id ? { ...cita, completada: !cita.completada } : cita
      )
    );
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

  const citasOrdenadas = [...citas].sort((a, b) => {
    if (a.completada === b.completada) return 0;
    return a.completada ? 1 : -1;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Citas</Text>
        <TouchableOpacity onPress={agregarCita} style={styles.addButton}>
          <Ionicons name="add-circle" size={30} color="#C31F39" />
        </TouchableOpacity>
      </View>

      {citas.length === 0 ? (
        <Text style={styles.empty}>No tienes citas aún.</Text>
      ) : (
        <FlatList
          data={citasOrdenadas}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.citaItem,
                item.completada && { backgroundColor: '#f2f2f2', borderColor: '#ccc' },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.citaTienda}>{item.tienda}</Text>
                <Text style={styles.citaFecha}>{item.fecha}</Text>
              </View>

              <TouchableOpacity
                onPress={() => toggleCompletada(item.id)}
                style={styles.checkbox}
              >
                {renderCheck(item.completada, item.estado)}
              </TouchableOpacity>
            </View>
          )}
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
    backgroundColor: '#f6f8fa', // igual al fondo del login
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
    padding: 4,
  },
  empty: {
    marginTop: 40,
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
  },
  checkbox: {
    marginLeft: 12,
  },
});
