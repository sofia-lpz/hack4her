import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, ScrollView } from 'react-native';
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
    bottomSheetRef.current?.snapToIndex(0);
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

        <BottomSheet
  ref={bottomSheetRef}
  index={-1}
  snapPoints={['15%', '40%']}
  enablePanDownToClose
  backgroundStyle={styles.sheetBackground}
  handleStyle={styles.sheetHandleContainer} 
  handleIndicatorStyle={styles.sheetHandle}
>
          <BottomSheetView style={styles.sheetContent}>
            {selectedFeature && (
              <ScrollView>
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
                  <Text style={styles.navigationButtonText}>Cómo llegar</Text>
                </TouchableOpacity>
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
  sheetHeader: {
    marginBottom: 15,
    minHeight: 40, 
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
  },
  detailsContainer: {
    marginBottom: 20,
    paddingTop: 20, 
  },
  detailText: {
    fontSize: 16,
    marginVertical: 6,
    color: '#555',
  },
  detailLabel: {
    fontWeight: '600',
    color: '#333',
  },
  navigationButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  navigationButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});