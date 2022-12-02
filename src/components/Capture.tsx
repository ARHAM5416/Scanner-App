import "./Capture.css";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { useCallback, useRef, useState } from "react";
import Cropper from "react-perspective-cropper";
import { IonButton } from "@ionic/react";

interface CaptureProps {}

const Capture: React.FC<CaptureProps> = () => {
  const [docUri, setDocUri] = useState<string>("");
  const [result, setResult] = useState<Blob>();
  const [cropState, setCropState] = useState<any>();
  const cropperRef = useRef<any>();
  const onChange = useCallback((s: any) => setCropState(s), []);
  const onDragStop = useCallback((s: any) => setCropState(s), []);

  const capture = async () => {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      quality: 100,
      correctOrientation: true,
    });
    if (capturedPhoto.webPath) {
      setDocUri(capturedPhoto.webPath);
    }
  };

  const done = async () => {
    try {
      if (cropperRef.current) {
        const res = await cropperRef.current.done({ preview: true });
        setResult(res);
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  const downloadDoc = () => {
    if (!result) {
      return;
    }
    const blob: Blob = result;
    const name = "file.jpg";
    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = data;
    link.download = name;

    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );

    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
  };

  const back = async () => {
    try {
      if (cropperRef.current) {
        cropperRef.current.backToCrop();
        setResult(undefined);
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <div className="container">
      <IonButton onClick={() => capture()}>Capture</IonButton>
      {cropState && (
        <div className="buttons-container">
          <IonButton onClick={done}>Done</IonButton>
          <IonButton onClick={() => back()}>Back</IonButton>
          <IonButton
            onClick={() => {
              setDocUri("");
              setCropState(undefined);
              setResult(undefined);
            }}
          >
            Reset
          </IonButton>
        </div>
      )}
      <Cropper
        ref={cropperRef}
        image={docUri}
        /*// @ts-ignore */
        onChange={onChange}
        /*// @ts-ignore */
        onDragStop={onDragStop}
      />
      {result && (
        <IonButton onClick={() => downloadDoc()}>Download Image</IonButton>
      )}
    </div>
  );
};

export default Capture;
