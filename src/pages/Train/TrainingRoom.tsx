import {
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import { useState } from 'react';
import * as Realm from "realm-web";
import './TrainingRoom.css';
import EnemyCard from '../../components/EnemyCard';
import { getEnemies } from '../../data/enemies';
import { IEnemy } from '../../types/schemas';
import React from 'react';

// Add your App ID
const app = new Realm.App({ id: 'application-0-vgvqx' });

const Train: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const [enemies, setEnemies] = useState<IEnemy[]>([]); // [1
  const mongodb = app?.currentUser?.mongoClient("mongodb-atlas");

  const fetchPlayer = async () => {
    const userId = localStorage.getItem('userId');
    const players = mongodb?.db("bots_rpg").collection("players");

    if (!userId) {
      console.error("No user id found");
      return;
    }

    if (players) {
      try {
        console.log(userId, 'userId')
        const results = await players.findOne({ _id: userId }); // Adjust the query as needed
        setData(results);

        console.log(results, 'result');

      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    }
  };

  useIonViewWillEnter(() => {
    console.log("Welcome to the training room");
    fetchPlayer();
    const enemies = getEnemies();
    setEnemies(enemies);
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
        <IonContent className="ion-padding">
          <IonImg src="resources/images/TrainingRoom.webp" alt="Training room" className="banner" />

          <IonText>
            <div className="text-overlay">
              <p><strong>Training room</strong></p>
              <p>
                Welcome to the training room. Here you can practice your skills and level up your bot.
              </p>
            </div>
          </IonText>

          {enemies?.map((enemy: IEnemy) => (
            <EnemyCard enemy={enemy} key={enemy._id} />
          ))}

        </IonContent>
      </IonPage>
    </React.Fragment>
  );
};

export default Train;
