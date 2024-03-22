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
import React, { useState } from 'react';
import EnemyCard from '../../components/EnemyCard';
import { IEnemy } from '../../types/types';
import './TrainingRoom.css';
import getEnemies from '../../functions/GetEnemies';


const Train: React.FC = () => {
  const [enemies, setEnemies] = useState<IEnemy[] | IEnemy>([]); // [1


  const getEnemyList = async () => {
    const enemies = await getEnemies({ location: 'training-room' });
    if (enemies) {
      setEnemies(enemies);
    }
 
  }


  useIonViewWillEnter(() => {
    console.log("Welcome to the training room");
    getEnemyList();
  });

  return (
    <React.Fragment>
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
            <IonTitle>Training room</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding training-bg">


          <IonText>
            <div className="text-overlay">
              <p><strong>Training room</strong></p>
              <p>
                Welcome to the training room. Here you can practice your skills and level up your bot.
              </p>
            </div>
          </IonText>

          {enemies?.map((enemy: IEnemy, index: number) => (
            <EnemyCard enemy={enemy} key={index} />
          ))}

        </IonContent>
      </IonPage>
    </React.Fragment>
  );
};

export default Train;
