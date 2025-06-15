import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import data from '../../assets/mapa.json';
import { fetchFeedbackSummary } from '../api/dataProvider';

export default function Maps() {
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const features = data.features;

  const [aiSummary, setAiSummary] = useState('');

const handleMarkerPress = async (feature) => {
  setSelectedFeature(feature);
  bottomSheetRef.current?.snapToIndex(0);
  
  try {
    const summary = await fetchFeedbackSummary(feature.properties.col0); // O feature.properties.nombre si usas opción 1
    setAiSummary(summary);
  } catch (error) {
    console.error("Error al obtener resumen:", error);
    setAiSummary("No se pudo cargar el resumen de comentarios");
  }
};

  const handleOpenMaps = () => {
    if (!selectedFeature) return;
    const [longitude, latitude] = selectedFeature.geometry.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url).catch(() => alert('No se pudo abrir Google Maps'));
  };

  const handleAddCita = () => {
    if (!selectedFeature) return;
    navigation.navigate('AddCita', { 
      storeName: selectedFeature.properties.nombre,
      storeId: selectedFeature.properties.col0 
    });
  };
  



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 25.6244792,
            longitude: -100.2998256,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {features.map((feature, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: feature.geometry.coordinates[1],
                longitude: feature.geometry.coordinates[0],
              }}
              onPress={() => handleMarkerPress(feature)}
            />
          ))}
        </MapView>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={['25%', '60%']}
          enablePanDownToClose
          backgroundStyle={styles.sheetBackground}
          handleStyle={styles.sheetHandleContainer}
          handleIndicatorStyle={styles.sheetHandle}
        >
          <BottomSheetView style={styles.sheetContent}>
            {selectedFeature && (
              <ScrollView>
                {/* Header con imagen y título */}
                <View style={styles.headerContainer}>
                  <View style={styles.headerImagePlaceholder}>
                    <Ionicons name="storefront-outline" size={40} color="#fff" />
                  </View>
                  <View style={styles.headerTextContainer}>
                    <Text style={styles.sheetTitle}>{selectedFeature.properties.nombre}</Text>
                    <Text style={styles.sheetSubtitle}>AI Summary</Text>
                  </View>
                </View>
                <View style={styles.summaryContainer}>
                  <Text style={styles.sectionTitle}>Resumen de Comentarios</Text>
                  <Text style={styles.summaryText}>
                    {aiSummary || "Cargando resumen..."}
                  </Text>
                </View>

                {/* Métricas del GeoJSON */}
                <View style={styles.metricsContainer}>
                  <View style={styles.metricRow}>
                    <Text style={styles.metricIcon}>📊</Text>
                    <View style={styles.metricTextContainer}>
                      <Text style={styles.metricLabel}>NPS</Text>
                      <Text style={styles.metricValue}>{selectedFeature.properties.nps}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.metricRow}>
                    <Text style={styles.metricIcon}>📦</Text>
                    <View style={styles.metricTextContainer}>
                      <Text style={styles.metricLabel}>Fill Rate</Text>
                      <Text style={styles.metricValue}>{selectedFeature.properties.fillfoundrate}%</Text>
                    </View>
                  </View>
                  
                  <View style={styles.metricRow}>
                    <Text style={styles.metricIcon}>🛠️</Text>
                    <View style={styles.metricTextContainer}>
                      <Text style={styles.metricLabel}>Damage Rate</Text>
                      <Text style={styles.metricValue}>{selectedFeature.properties.damage_rate}%</Text>
                    </View>
                  </View>
                  
                  <View style={styles.metricRow}>
                    <Text style={styles.metricIcon}>🏷️</Text>
                    <View style={styles.metricTextContainer}>
                      <Text style={styles.metricLabel}>Out of Stock</Text>
                      <Text style={styles.metricValue}>{selectedFeature.properties.out_of_stock}%</Text>
                    </View>
                  </View>
                  
                  <View style={styles.metricRow}>
                    <Text style={styles.metricIcon}>⏱️</Text>
                    <View style={styles.metricTextContainer}>
                      <Text style={styles.metricLabel}>Resolution Time</Text>
                      <Text style={styles.metricValue}>{selectedFeature.properties.complaint_resolution_time_hrs} hrs</Text>
                    </View>
                  </View>
                </View>

                {/* Información de contacto */}
                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={20} color="#C31F39" />
                    <Text style={styles.infoText}>{selectedFeature.properties.nombre}, Monterrey.</Text>
                  </View>
                </View>

                {/* Botones de acción */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={handleOpenMaps}
                  >
                    <Ionicons name="navigate-outline" size={20} color="#C31F39" />
                    <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Cómo llegar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={handleAddCita}
                  >
                    <Ionicons name="calendar-outline" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Agendar Visita</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetHandleContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
  },
  sheetHandle: {
    backgroundColor: '#ccc',
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  sheetContent: {
    backgroundColor: 'white',
    padding: 20,
    flex: 1,
    borderRadius: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  headerImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#C31F39',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  sheetSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  metricsContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  metricTextContainer: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  infoContainer: {
    marginVertical: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#555',
    marginLeft: 10,
  },
  linkText: {
    color: '#C31F39',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#C31F39',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#C31F39',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#C31F39',
  },
  summaryContainer: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  summaryText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});