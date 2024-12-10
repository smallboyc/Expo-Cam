import React, { useState, useRef } from 'react';
import { CameraView, CameraCapturedPicture, useCameraPermissions } from 'expo-camera';
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View, Button, Text } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { EMULATOR_BACKEND_URL } from '@env';
import { APP_BACKEND_URL } from '@env';



export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState<(CameraCapturedPicture | undefined)[]>([]);
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

  //take a photo
  const handleTakePhoto = async () => {
    if (cameraRef.current && photos.length < 3) {
      const options = {
        quality: 0.1, //adjusting it if necessary for better/less quality
        base64: true,
        exif: false,
      };
      try {
        const takenPhoto = await cameraRef.current.takePictureAsync(options);
        setPhotos(prevPhotos => [...prevPhotos, takenPhoto]);
      } catch (error) {
        console.log(`Error ! : ${error}`)
      }
    }
  };

  //cancel a photo
  const handleRetakePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  //send photo(s) to back-end
  const handleSendPhotos = async () => {
    const data = photos.map(photo => ({
      imageName: `img_${photos.indexOf(photo)}.jpg`,
      imageData: photo?.base64,
    }));
    console.log(data)

    fetch(`${EMULATOR_BACKEND_URL}/process-image/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => console.log("Success:", data))
      .catch((error) => console.error("Error:", error));

  };



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