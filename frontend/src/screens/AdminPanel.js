import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// You'll need to install this library: npm install react-native-chart-kit
import { LineChart, BarChart } from 'react-native-chart-kit';
import { fetchLeastVisitedStores, fetchStats} from '../api/dataProvider';

export default function AdminPanel({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    average_fill_found_rate: '0.0',
    average_damage_rate: '0.0',
    averageNPS: '0.0',
    citasCount: '0'
  });
  const [storesData, setStoresData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  // Function to process stores data for chart
  const processStoresDataForChart = (stores) => {
    // Get top 6 stores with most visits (or least visited as per your API)
    const sortedStores = stores
      .sort((a, b) => parseInt(b.visit_count) - parseInt(a.visit_count))
      .slice(0, 6);

    const labels = sortedStores.map(store => {
      // Shorten store names for chart labels
      const name = store.nombre;
      if (name.length > 12) {
        return name.substring(0, 12) + '...';
      }
      return name;
    });

    const data = sortedStores.map(store => parseInt(store.visit_count) || 0);

    return {
      labels,
      datasets: [
        {
          data,
          color: () => `rgba(195, 31, 57, 0.8)`,
          strokeWidth: 2
        }
      ],
    };
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch both stats and stores data
        const [statsResponse, storesResponse] = await Promise.all([
          fetchStats(),
          fetchLeastVisitedStores()
        ]);
        
        // Handle stats data
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        } else {
          console.warn('Failed to fetch stats data');
        }
        
        // Handle stores data
        if (storesResponse.success && storesResponse.data) {
          setStoresData(storesResponse.data);
          
          // Process data for chart
          const processedChartData = processStoresDataForChart(storesResponse.data);
          setChartData(processedChartData);
        } else {
          console.warn('Failed to fetch stores data');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading admin data:', err);
        setError('No se pudieron cargar los datos. Intenta de nuevo más tarde.');
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const StatCard = ({ title, value, icon, suffix = '' }) => (
    <View style={styles.statCard}>
      <View style={styles.statIconContainer}>
        <Ionicons name={icon} size={24} color="#C31F39" />
      </View>
      <View style={styles.statTextContainer}>
        <Text style={styles.statValue}>{value}{suffix}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [statsResponse, storesResponse] = await Promise.all([
        fetchStats(),
        fetchLeastVisitedStores()
      ]);
      
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }
      
      if (storesResponse.success && storesResponse.data) {
        setStoresData(storesResponse.data);
        const processedChartData = processStoresDataForChart(storesResponse.data);
        setChartData(processedChartData);
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Error al actualizar los datos.');
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C31F39" />
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#C31F39" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshData}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Stats Row 1 */}
          <View style={styles.statsRow}>
            <StatCard 
              title="Tasa de Productos Encontrados" 
              value={parseFloat(stats.average_fill_found_rate || 0).toFixed(1)} 
              suffix="%" 
              icon="checkmark-circle" 
            />
            <StatCard 
              title="Tasa de Daños" 
              value={parseFloat(stats.average_damage_rate || 0).toFixed(2)} 
              suffix="%" 
              icon="warning" 
            />
          </View>

          {/* Stats Row 2 */}
          <View style={styles.statsRow}>
            <StatCard 
              title="NPS Promedio" 
              value={parseFloat(stats.averageNPS || 0).toFixed(1)} 
              icon="star" 
            />
            <StatCard 
              title="Citas" 
              value={stats.citasCount || '0'} 
              icon="calendar" 
            />
          </View>

          {/* Store Visits Chart */}
          {chartData && (
            <View style={styles.graphSection}>
              <Text style={styles.sectionTitle}>Visitas por Tienda</Text>
              <View style={styles.chartContainer}>
                <BarChart
                  data={chartData}
                  width={Dimensions.get('window').width - 40}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(195, 31, 57, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16
                    },
                    propsForBackgroundLines: {
                      strokeDasharray: "",
                      stroke: "#e3e3e3",
                      strokeWidth: 1
                    },
                  }}
                  style={styles.chart}
                  verticalLabelRotation={30}
                />
              </View>
            </View>
          )}

          {/* Store List Section */}
          <View style={styles.graphSection}>
            <Text style={styles.sectionTitle}>Tiendas con Menos Visitas</Text>
            {storesData.slice(0, 5).map((store, index) => (
              <View key={store.id} style={styles.storeItem}>
                <View style={styles.storeRank}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <View style={styles.storeInfo}>
                  <Text style={styles.storeName}>{store.nombre}</Text>
                  <Text style={styles.storeVisits}>{store.visit_count} visitas</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderColor: '#d91c34',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  link: {
    color: '#d91c34',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#888',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 10,
    color: '#555',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#C31F39',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(195, 31, 57, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 14,
    color: '#888',
  },
  graphSection: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  storeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  storeRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(195, 31, 57, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C31F39',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  storeVisits: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
});