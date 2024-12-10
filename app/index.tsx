import { CameraView, useCameraPermissions } from 'expo-camera';
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View, Button, Text } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useCameraHandlers } from '@/hooks/useCameraHandlers';



export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const { photos, cameraRef, handleTakePhoto, handleRetakePhoto, handleSendPhotos } = useCameraHandlers()

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
              {photos.length < 3 ? <Feather name="camera" size={40} color="white" /> : <Feather name="camera-off" size={40} color="white" />}
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>

      {photos.length > 0 && (
        <View style={styles.previewContainer}>
          {photos.map((photo, index) => (
            photo && (
              <View key={index} style={styles.previewBox}>
                <Image
                  style={styles.previewImage}
                  source={{ uri: 'data:image/jpg;base64,' + photo.base64 }}
                />
                <TouchableOpacity style={styles.retakeButton} onPress={() => handleRetakePhoto(index)}>
                  <Feather name="trash-2" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )
          ))}
        </View>
      )}

      {photos.length === 3 && (
        <TouchableOpacity style={styles.sendButton} onPress={handleSendPhotos}>
          <Text style={styles.sendButtonText}>Send Photos</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 50,
  },
  previewContainer: {
    flexDirection: 'row',
    marginTop: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  previewBox: {
    margin: 10,
    position: 'relative',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  retakeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
  },
  sendButton: {
    marginTop: 20,
    backgroundColor: '#03fc9d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});