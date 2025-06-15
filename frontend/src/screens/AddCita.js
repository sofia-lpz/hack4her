import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import geojsonData from '../../assets/mapa.json';

export default function AddCita() {
  const users = ['María López', 'Carlos Ruiz', 'Ana Torres', 'Luis García'];
  const tiendaNombres = geojsonData.features.map(f => f.properties.nombre);

  const [search, setSearch] = useState('');
  const [filteredTiendas, setFilteredTiendas] = useState(tiendaNombres);
  const [selectedTienda, setSelectedTienda] = useState('');

  const [userSearch, setUserSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedUser, setSelectedUser] = useState('');

  const [fecha, setFecha] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [showFechaPicker, setShowFechaPicker] = useState(false);
  const [showHoraPicker, setShowHoraPicker] = useState(false);

  useEffect(() => {
    setFilteredTiendas(
      search.trim()
        ? tiendaNombres.filter(t =>
            t.toLowerCase().includes(search.toLowerCase())
          )
        : tiendaNombres
    );
  }, [search]);

  useEffect(() => {
    setFilteredUsers(
      userSearch.trim()
        ? users.filter(u =>
            u.toLowerCase().includes(userSearch.toLowerCase())
          )
        : users
    );
  }, [userSearch]);

  const formatFecha = (date: Date) =>
    date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

  const formatHora = (date: Date) =>
    date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Establecimiento */}
          <Text style={styles.label}>Lugar del establecimiento</Text>
          <TextInput
            placeholder="Buscar tienda..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
            style={styles.input}
          />
          {filteredTiendas.length > 0 && search.length > 0 && (
            <View style={styles.dropdown}>
              <FlatList
                data={filteredTiendas}
                keyExtractor={(item) => item}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedTienda(item);
                      setSearch(item);
                      setFilteredTiendas([]);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
          <Text style={styles.selectedText}>Seleccionaste: {selectedTienda}</Text>

          {/* Usuario */}
          <Text style={styles.label}>Usuario asignado</Text>
          <TextInput
            placeholder="Buscar usuario..."
            placeholderTextColor="#aaa"
            value={userSearch}
            onChangeText={setUserSearch}
            style={styles.input}
          />
          {filteredUsers.length > 0 && userSearch.length > 0 && (
            <View style={styles.dropdown}>
              <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedUser(item);
                      setUserSearch(item);
                      setFilteredUsers([]);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
          <Text style={styles.selectedText}>Usuario: {selectedUser}</Text>

          {/* Fecha */}
          <Text style={styles.label}>Fecha</Text>
          <TouchableOpacity onPress={() => setShowFechaPicker(true)} style={styles.input}>
            <Text style={styles.textValue}>{formatFecha(fecha)}</Text>
          </TouchableOpacity>
          {showFechaPicker && (
            <DateTimePicker
              mode="date"
              value={fecha}
              display="default"
              onChange={(e, date) => {
                setShowFechaPicker(false);
                if (date) setFecha(date);
              }}
            />
          )}

          {/* Hora */}
          <Text style={styles.label}>Hora</Text>
          <TouchableOpacity onPress={() => setShowHoraPicker(true)} style={styles.input}>
            <Text style={styles.textValue}>{formatHora(hora)}</Text>
          </TouchableOpacity>
          {showHoraPicker && (
            <DateTimePicker
              mode="time"
              value={hora}
              is24Hour={true}
              display="default"
              onChange={(e, date) => {
                setShowHoraPicker(false);
                if (date) setHora(date);
              }}
            />
          )}
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
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#d91c34',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  textValue: {
    fontSize: 16,
    color: '#000',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d91c34',
    borderRadius: 8,
    maxHeight: 150,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#000',
  },
  selectedText: {
    color: '#d91c34',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 20,
  },
});
