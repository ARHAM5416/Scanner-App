import "./Capture.css";
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import { useCallback, useRef, useState } from "react";
import Cropper from "react-perspective-cropper";
import { IonButton } from "@ionic/react";
import {
  IonCard,
  IonCardContent,
} from "@ionic/react";

interface CaptureProps {}

const Capture: React.FC<CaptureProps> = () => {
  const [photo, setPhoto] = useState<{ url: string | File; file: any }>({url: '', file: null});
  const [cropState, setCropState] = useState<{loading: boolean}>();
  const cropperRef = useRef<any>();
  const onChange = useCallback((s: any) => setCropState(s), []);
  const onDragStop = useCallback((s: any) => setCropState(s), []);

  const addNewToGallery = async () => {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      quality: 100,
      correctOrientation: true,
    });
    console.log(capturedPhoto);

    if (capturedPhoto.webPath) {
      var file = new File([capturedPhoto.webPath], "image.png");
      capturedPhoto.webPath &&
        setPhoto({
          file,
          url: capturedPhoto.webPath,
        });
    }
  };
  const doSomething = async () => {
    try {
      console.log(cropState);
      console.log(cropperRef.current, cropperRef);
      if (cropperRef.current) {
        const res = await cropperRef.current.done({ preview: true });
      }
      setTimeout(() => {
        console.log(cropState);
      }, 2000)
      
    } catch (e) {
      console.log("error", e);
    }
  };

  const removeImage = async () => {
    setPhoto({url: '', file: null})
  }

  const downloadPhoto = async () => {
    console.log(photo)
  //   const savedFile = await Filesystem.writeFile({
  //     path: 'test',
  //     data: base64Data,
  //     directory: FilesystemDirectory.Data
  //   });
  };

  // const onImgSelection = async (e) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     // it can also be a http or base64 string for example
  //     setImg(e.target.files[0])
  //   }
  // }
  console.log(photo?.file);
  

  return (
    <div className="container">
      <IonButton size="small" fill="outline" onClick={() => addNewToGallery()}>
        Capture
      </IonButton>
      {photo && photo.url && (
        <IonButton color="danger" onClick={() => removeImage()} fill="clear">Delete Image</IonButton>
      )}
      <Cropper
          ref={cropperRef}
          image={photo.url}
          /*// @ts-ignore */
          onChange={onChange}
          /*// @ts-ignore */
          onDragStop={onDragStop}
        />
      <br></br>
      <br></br>
      <IonButton onClick={doSomething}>Apply Filter</IonButton>
      <IonButton onClick={downloadPhoto}>Download Image</IonButton>
    </div>
  );
};

export default Capture;
