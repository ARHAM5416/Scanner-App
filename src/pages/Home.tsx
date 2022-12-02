import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Capture from '../components/Capture';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Scanner</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Capture />
      </IonContent>
    </IonPage>
  );
};

export default Home;
