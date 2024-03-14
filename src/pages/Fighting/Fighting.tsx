import {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenu,
    IonMenuButton,
    IonPage,
    IonText,
    IonTitle,
    IonToolbar,
    useIonViewWillEnter
} from '@ionic/react';
  
  import './Train.css';
  
  const Train: React.FC = () => {
  
    useIonViewWillEnter(() => {
      console.log("Welcome to the training room")
    });
  
  
    return (
      <>
        <IonMenu contentId="main-content">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Menu Content</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">Side menu</IonContent>
        </IonMenu>
        <IonPage id="main-content">
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton></IonMenuButton>
              </IonButtons>
              <IonTitle>#Gladbot vs ENEMY</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonText>
              <div>
              
              </div>
            </IonText>
  
          </IonContent>
        </IonPage>
      </>
    );
  };
  
  export default Train;
  