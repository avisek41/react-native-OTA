import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const openModal = () => setIsModalVisible(true)
  const closeModal = () => setIsModalVisible(false)

  return (
    <SafeAreaView style={styles.container} testID="app-container">
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        testID="app-scroll-view"
      >
        {/* Header Section */}
        <View style={styles.header} testID="header-section">
          <Text style={styles.title} testID="app-title">Welcome</Text>
          <Text style={styles.subtitle} testID="app-subtitle">
            React Native OTA
          </Text>
        </View>

        {/* Card Section */}
        <View style={styles.cardContainer} testID="card-container">
          <View style={styles.card} testID="card-1">
            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>🚀</Text>
            </View>
            <Text style={styles.cardTitle}>Fast Updates</Text>
            <Text style={styles.cardDescription}>
              Over-the-air updates for instant app improvements
            </Text>
          </View>

          <View style={styles.card} testID="card-2">
            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>⚡</Text>
            </View>
            <Text style={styles.cardTitle}>Performance</Text>
            <Text style={styles.cardDescription}>
              Optimized for speed and efficiency
            </Text>
          </View>

          <View style={styles.card} testID="card-3">
            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>🔒</Text>
            </View>
            <Text style={styles.cardTitle}>Secure</Text>
            <Text style={styles.cardDescription}>
              Built with security and reliability in mind
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.8}
         //onPress={openModal}
          testID="primary-button"
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Beautiful Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
        testID="welcome-modal"
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={closeModal}
          testID="modal-overlay"
        >
          <Pressable 
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
            testID="modal-content"
          >
            <View style={styles.modalHeader} testID="modal-header">
              <View style={styles.modalIconContainer}>
                <Text style={styles.modalIcon}>✨</Text>
              </View>
              <Text style={styles.modalTitle}>Welcome Aboard!</Text>
              <Text style={styles.modalSubtitle}>
                You're all set to get started with React Native OTA
              </Text>
            </View>

            <View style={styles.modalBody} testID="modal-body">
              <View style={styles.modalFeature}>
                <Text style={styles.modalFeatureIcon}>📱</Text>
                <View style={styles.modalFeatureText}>
                  <Text style={styles.modalFeatureTitle}>Easy Setup</Text>
                  <Text style={styles.modalFeatureDesc}>
                    Get up and running in minutes
                  </Text>
                </View>
              </View>

              <View style={styles.modalFeature}>
                <Text style={styles.modalFeatureIcon}>🔄</Text>
                <View style={styles.modalFeatureText}>
                  <Text style={styles.modalFeatureTitle}>OTA Updates</Text>
                  <Text style={styles.modalFeatureDesc}>
                    Push updates without app store approval
                  </Text>
                </View>
              </View>

              <View style={styles.modalFeature}>
                <Text style={styles.modalFeatureIcon}>📊</Text>
                <View style={styles.modalFeatureText}>
                  <Text style={styles.modalFeatureTitle}>Analytics</Text>
                  <Text style={styles.modalFeatureDesc}>
                    Track update success and user engagement
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.modalFooter} testID="modal-footer">
              <TouchableOpacity
                style={styles.modalButton}
                onPress={closeModal}
                activeOpacity={0.8}
                testID="modal-close-button"
              >
                <Text style={styles.modalButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '400',
  },
  cardContainer: {
    gap: 16,
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIconText: {
    fontSize: 28,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIcon: {
    fontSize: 40,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  modalBody: {
    marginBottom: 32,
    gap: 20,
  },
  modalFeature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  modalFeatureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  modalFeatureText: {
    flex: 1,
  },
  modalFeatureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  modalFeatureDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  modalFooter: {
    paddingTop: 8,
  },
  modalButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
})