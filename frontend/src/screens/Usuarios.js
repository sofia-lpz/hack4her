import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchUsers } from '../api/dataProvider';

export default function UsuariosScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await fetchUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('No se pudieron cargar los usuarios. Intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return (
      (firstName ? firstName.charAt(0).toUpperCase() : '') +
      (lastName ? lastName.charAt(0).toUpperCase() : '')
    );
  };

  const getRoleLabel = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'Administrador';
      case 'user':
        return 'Usuario';
      default:
        return role || 'Sin rol';
    }
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

const handleEditUser = () => {
  // Console log the user ID and full user object
  console.log('Edit user ID:', selectedUser.id);
  console.log('Edit user:', selectedUser);
  
  // You can navigate to edit screen passing the user ID or full user object
  // navigation.navigate('EditUser', { userId: selectedUser.id });
  // OR
  // navigation.navigate('EditUser', { user: selectedUser });
  
  closeModal();
};

  const renderUserCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => openUserModal(item)}
    >
      <View style={styles.cardHeader}>
        {item.profile_picture ? (
          <Image 
            source={{ uri: item.profile_picture }} 
            style={styles.profilePic} 
          />
        ) : (
          <View style={styles.initialsContainer}>
            <Text style={styles.initialsText}>
              {getInitials(item.first_name, item.last_name)}
            </Text>
          </View>
        )}
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {item.first_name} {item.last_name}
          </Text>
          <Text style={styles.username}>@{item.username || 'username'}</Text>
        </View>
      </View>
      
      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="mail-outline" size={16} color="#888" />
          <Text style={styles.detailText}>{item.email}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={16} color="#888" />
          <Text style={styles.detailText}>{getRoleLabel(item.role)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderUserModal = () => {
    if (!selectedUser) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalles del Usuario</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Profile Section */}
              <View style={styles.profileSection}>
                {selectedUser.profile_picture ? (
                  <Image 
                    source={{ uri: selectedUser.profile_picture }} 
                    style={styles.modalProfilePic} 
                  />
                ) : (
                  <View style={styles.modalInitialsContainer}>
                    <Text style={styles.modalInitialsText}>
                      {getInitials(selectedUser.first_name, selectedUser.last_name)}
                    </Text>
                  </View>
                )}
                <Text style={styles.modalUserName}>
                  {selectedUser.first_name} {selectedUser.last_name}
                </Text>
                <Text style={styles.modalUsername}>@{selectedUser.username || 'username'}</Text>
              </View>

              {/* User Details */}
              <View style={styles.detailsSection}>
                <View style={styles.modalDetailRow}>
                  <View style={styles.detailLabel}>
                    <Ionicons name="mail-outline" size={20} color="#C31F39" />
                    <Text style={styles.detailLabelText}>Email</Text>
                  </View>
                  <Text style={styles.detailValue}>{selectedUser.email}</Text>
                </View>

                <View style={styles.modalDetailRow}>
                  <View style={styles.detailLabel}>
                    <Ionicons name="person-outline" size={20} color="#C31F39" />
                    <Text style={styles.detailLabelText}>Rol</Text>
                  </View>
                  <Text style={styles.detailValue}>{getRoleLabel(selectedUser.role)}</Text>
                </View>

              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.editButton} onPress={handleEditUser}>
                <Ionicons name="pencil" size={20} color="#fff" />
                <Text style={styles.editButtonText}>Editar Usuario</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.link}>← Atrás</Text>
        <Text style={styles.title}>Usuarios</Text>
        <TouchableOpacity onPress={loadUsers}>
          <Ionicons name="refresh" size={20} color="#d91c34" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C31F39" />
          <Text style={styles.loadingText}>Cargando usuarios...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#C31F39" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadUsers}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people" size={48} color="#C31F39" />
              <Text style={styles.emptyText}>No hay usuarios disponibles</Text>
            </View>
          }
        />
      )}

      {/* User Detail Modal */}
      {renderUserModal()}
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
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f2f2f2',
  },
  initialsContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#C31F39',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  username: {
    color: '#888',
    fontSize: 14,
  },
  cardDetails: {
    marginTop: 4,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    color: '#555',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 10,
    color: '#888',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  modalProfilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f2f2f2',
    marginBottom: 15,
  },
  modalInitialsContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#C31F39',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalInitialsText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  modalUserName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  modalUsername: {
    fontSize: 16,
    color: '#888',
  },
  detailsSection: {
    marginTop: 10,
  },
  modalDetailRow: {
    marginBottom: 20,
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  detailValue: {
    fontSize: 16,
    color: '#555',
    marginLeft: 28,
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  editButton: {
    backgroundColor: '#C31F39',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
  },
});