import { Fontisto } from '@expo/vector-icons';
import { CameraCapturedPicture } from 'expo-camera';
import React, { useState, useRef } from 'react';
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View, Button, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';

export default function Index() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState<(CameraCapturedPicture | undefined)[]>([]);  // initialize photos array
  const cameraRef = useRef<CameraView | null>(null);

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

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current && photos.length < 3) {  // Limiter à 3 photos
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };
      const takenPhoto = await cameraRef.current.takePictureAsync(options);

      // Ajouter la photo à l'état
      setPhotos(prevPhotos => [...prevPhotos, takenPhoto]);
    }
  };

  const handleRetakePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);  // Supprimer l'élément à l'index donné
    setPhotos(newPhotos);
  };

  const handleSendPhotos = () => {
    console.log('Sending photos:', photos);  // Envoyer les photos au script
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <AntDesign name="retweet" size={44} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
              <AntDesign name="camera" size={44} color="black" />
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
                  <Fontisto name="trash" size={36} color="red" />
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
    padding: 10,
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
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
