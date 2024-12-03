import { Fontisto } from '@expo/vector-icons';
import { CameraCapturedPicture } from 'expo-camera';
import React from 'react'
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View } from 'react-native';

export default function PhotoPreviewSection({
    photo,
    handleRetakePhoto
}: {
    photo: CameraCapturedPicture;
    handleRetakePhoto: () => void;
}) {

    return <SafeAreaView style={styles.container}>
        <View style={styles.box}>
            <Image
                style={styles.previewContainer}
                source={{ uri: 'data:image/jpg;base64,' + photo.base64 }}
            />
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleRetakePhoto}>
                <Fontisto name='trash' size={36} color='black' />
            </TouchableOpacity>
        </View>
    </SafeAreaView>

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        borderRadius: 15,
        padding: 10, // Augmenté pour un peu plus d'espace autour de l'image
        width: '95%',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000', // Ombre légère pour un effet de profondeur
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 5, // Sur Android pour la même ombre
    },
    previewContainer: { // Correction du nom (de "previewConatiner" à "previewContainer")
        width: '100%', // Pleine largeur du container
        height: '85%', // 85% de la hauteur du box
        borderRadius: 15,
    },
    buttonContainer: {
        marginTop: 16, // Un peu plus d'espace
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    button: {
        backgroundColor: '#666', // Utilisation d'une couleur un peu plus douce
        borderRadius: 25,
        padding: 12, // Un peu plus grand pour les boutons
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 12, // Pour espacer les boutons si vous en ajoutez plus tard
    },
    icon: {
        color: 'black', // Couleur noire pour l'icône
    },
});



