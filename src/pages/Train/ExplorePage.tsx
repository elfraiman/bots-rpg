import {
  IonContent,
  IonHeader,
  IonMenu,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import EnemyCard from '../../components/EnemyCard';
import { IEnemy, IPlanet } from '../../types/types';
import './ExplorePage.css';

import Header from '../../components/Header';
import { getEnemies } from '../../functions/GetEnemies';
import { getSinglePlanet } from '../../functions/GetPlanet';
import { PlayerContext } from '../../context/PlayerContext';


const ExplorePage: React.FC = () => {
  const [planetData, setPlanetData] = useState<IPlanet>();
  const [enemies, setEnemies] = useState<IEnemy[]>([]); // [1
  const { player } = useContext(PlayerContext);

  const getEnemyList = async () => {
    const enemies = await getEnemies({ location: player?.location });
    if (enemies) {
      setEnemies(enemies);
    }
  }

  const getPlanetData = async () => {
    if (player) {
      try {
        const planet = await getSinglePlanet(player?.location);
        setPlanetData(planet);
      } catch (e) {
        console.error('error fetching planet', e);
      }
    }
  }

  useEffect(() => {
    getPlanetData();
    getEnemyList();
  }, [player])

  return (
    <React.Fragment>
      {planetData && player ? (
        <IonPage id="main-content">
          <Header />
          <IonContent className="ion-padding" style={{
            '--background': `url('/resources/images/planets/planet-ground-${planetData?.imgId}.webp') 0 0/cover no-repeat`,
            position: 'relative' // Ensure the toolbar can contain the absolutely positioned overlay
          }}>
            {/* Overlay div */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)', // Adjust the opacity as needed
              zIndex: 1 // Ensure it sits above the background but below the content
            }}></div>

            <div style={{ zIndex: 100 }}>
              <IonText>
                <div className="text-overlay">
                  <h4>
                    You've arrived at {planetData?.name}
                  </h4>
                  <p>{planetData?.description}</p>
                </div>
              </IonText>

              {enemies?.map((enemy: IEnemy, index: number) => (
                <EnemyCard enemy={enemy} key={index} />
              ))}
            </div>
          </IonContent>
        </IonPage>
      ) : <>Loading...</>}

    </React.Fragment>
  );
};

export default ExplorePage;
