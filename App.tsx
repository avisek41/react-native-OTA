import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import {
  withStallion,
  useStallionUpdate,
  restart,
} from 'react-native-stallion';



const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { isRestartRequired, newReleaseBundle } = useStallionUpdate();


// Handle restart required
  React.useEffect(() => {
    if (isRestartRequired) {

      Alert.alert(
        'New Release Installed',
        `A new update has been downloaded and is ready to install.\n\nRelease: ${newReleaseBundle?.version || 'Unknown'}\nNote: ${newReleaseBundle?.releaseNote || 'No release notes'}`,
        [
          
          {
            text: 'Restart Now',
            onPress: () => {

              restart();
            },
          },
        ],
      );
    }
  }, [isRestartRequired, newReleaseBundle]);





  return (
    <SafeAreaView style={styles.container} testID="otaTestContainer">
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        testID="otaTestScrollView"
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Text style={styles.headerIcon}>🚀</Text>
          </View>
          <Text style={styles.headerTitle}>OTA Update Demo App </Text>
          <Text style={styles.headerSubtitle}>
            React Native Over-The-Air Updates
          </Text>
        </View>

        {/* Feature Cards */}
        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIcon}>⚡</Text>
            </View>
            <Text style={styles.cardTitle}>Fast Updates</Text>
            <Text style={styles.cardDescription}>
              Get instant updates without app store approval
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIcon}>🔒</Text>
            </View>
            <Text style={styles.cardTitle}>Secure</Text>
            <Text style={styles.cardDescription}>
              Built with security and reliability in mind
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIcon}>📊</Text>
            </View>
            <Text style={styles.cardTitle}>Analytics</Text>
            <Text style={styles.cardDescription}>
              Track update success and user engagement
            </Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How It Works</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoNumber}>1</Text>
              <Text style={styles.infoText}>
                Developer publishes update to Stallion
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoNumber}>2</Text>
              <Text style={styles.infoText}>
                App automatically checks for updates
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoNumber}>3</Text>
              <Text style={styles.infoText}>
                Update downloads in the background
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoNumber}>4</Text>
              <Text style={styles.infoText}>
                User restarts to apply the update
              </Text>
            </View>
          </View>
        </View>

   
      </ScrollView>

    </SafeAreaView>
  );
};

export default withStallion(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
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
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  headerIcon: {
    fontSize: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
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
  infoSection: {
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    paddingTop: 4,
  },
  statusBanner: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statusBannerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  statusBannerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  statusValueActive: {
    color: '#4CAF50',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonContainer: {
    flex: 1,
    marginBottom: 12,
  },
  logsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyLogs: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
  },
  logEntry: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 4,
  },
  logData: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  logTimestamp: {
    fontSize: 10,
    color: '#999',
    // remove the timestamp
  },
});