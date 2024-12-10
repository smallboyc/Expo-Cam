import { useRef, useState } from "react";
import { CameraCapturedPicture, CameraView } from "expo-camera";
import { EMULATOR_BACKEND_URL } from "@env";


export function useCameraHandlers() {
    const [photos, setPhotos] = useState<(CameraCapturedPicture | undefined)[]>([]);
    const cameraRef = useRef<CameraView | null>(null);

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
    return { photos, cameraRef, handleTakePhoto, handleRetakePhoto, handleSendPhotos };
}