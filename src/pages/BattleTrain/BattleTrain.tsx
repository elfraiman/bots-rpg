import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from "@ionic/react";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { getEnemy } from "../../data/enemies";
import usePlayerHook from "../../hooks/GetPlayerHook";






const BattleTrain = () => {
  const player = usePlayerHook();
  const [enemy, setEnemy] = useState<any>([]);
  const match = useRouteMatch();


  useIonViewWillEnter(() => {
    const params: any = match.params;
    const enemy = getEnemy(Number(params.id));
    setEnemy(enemy);
  });

  const startFight = () => {

  }


  const attack = () => {
    
  }


  return (
    <>
      {player && enemy ?
        (
          <IonPage>
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonMenuButton></IonMenuButton>
                </IonButtons>
                <IonTitle>Fighting {enemy.name}</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
             
            </IonContent>
          </IonPage>
        ) : <p>Error</p>}
    </>
  );
}

export default BattleTrain;