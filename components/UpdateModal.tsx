import { Button, Modal, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { restart, useStallionUpdate } from 'react-native-stallion';

const UpdateModal = () => {
    const { isRestartRequired } = useStallionUpdate();
    const [modalVisible, setModalVisible] = React.useState(false);
  
    React.useEffect(() => {
      if (isRestartRequired) {
        setModalVisible(true);
      }
    }, [isRestartRequired]);
  
    const handleRestart = () => {
      setModalVisible(false);
      restart(); // Trigger Stallion restart
    };
    return (
        <Modal transparent visible={modalVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#00000088',
            }}
          >
            <View
              style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}
            >
              <Text style={{ marginBottom: 10 }}>
                A new update is ready to install.
              </Text>
              <Button title="Restart App" onPress={handleRestart} />
            </View>
          </View>
        </Modal>
      );
}

export default UpdateModal

const styles = StyleSheet.create({})