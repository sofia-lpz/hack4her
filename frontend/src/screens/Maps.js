import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import geojsonData from '../../assets/mapa.json';

export default function Maps() {
  const bottomSheetRef = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const features = geojsonData.features;

  const handleMarkerPress = (feature) => {
    setSelectedFeature(feature);
    bottomSheetRef.current?.expand();
  };

  const handleOpenMaps = () => {
    if (!selectedFeature) return;
    const [longitude, latitude] = selectedFeature.geometry.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url).catch(() => alert('No se pudo abrir Google Maps'));
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

        {/* Bottom Sheet con los campos del GeoJSON */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={['30%', '60%']}
          enablePanDownToClose
          backgroundComponent={() => (
            <View style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              flex: 1,
            }} />
          )}
          handleIndicatorStyle={styles.sheetHandle}
        >
          <BottomSheetView style={{
            backgroundColor: 'white',
            padding: 20,
            flex: 1,
          }}>
            {selectedFeature && (
              <>
                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>
                    {selectedFeature.properties.nombre || 'Nombre no disponible'}
                  </Text>
                </View>

                <View style={styles.detailsContainer}>
                  <Text style={styles.detailText}>
                    📊 <Text style={styles.detailLabel}>NPS:</Text> {selectedFeature.properties.nps || 'N/A'}
                  </Text>
                  <Text style={styles.detailText}>
                    📦 <Text style={styles.detailLabel}>Fill Rate:</Text> {selectedFeature.properties.fillfoundrate || 'N/A'}%
                  </Text>
                  <Text style={styles.detailText}>
                    🛠️ <Text style={styles.detailLabel}>Damage Rate:</Text> {selectedFeature.properties.damage_rate || 'N/A'}%
                  </Text>
                  <Text style={styles.detailText}>
                    🏷️ <Text style={styles.detailLabel}>Out of Stock:</Text> {selectedFeature.properties.out_of_stock || 'N/A'}%
                  </Text>
                  <Text style={styles.detailText}>
                    ⏱️ <Text style={styles.detailLabel}>Complaint Resolution Time:</Text> {selectedFeature.properties.complaint_resolution_time_hrs || 'N/A'} hrs
                  </Text>
                </View>

                <TouchableOpacity 
                  style={styles.navigationButton}
                  onPress={handleOpenMaps}
                >
                  <Text style={styles.navigationButtonText}> Cómo llegar</Text>
                </TouchableOpacity>
              </>
            )}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetHandle: {
    backgroundColor: '#ccc',
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
  },
  sheetHeader: {
    marginBottom: 15,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContainer: {
    marginBottom: 220,
  },
  detailText: {
    fontSize: 16,
    marginVertical: 4,
    color: '#555',
  },
  detailLabel: {
    fontWeight: '600',
    color: '#333',
  },
  navigationButton: {
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  navigationButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});