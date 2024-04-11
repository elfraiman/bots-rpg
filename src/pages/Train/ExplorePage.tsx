import { IonContent, IonPage, IonSpinner } from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import EnemyCard from '../../components/EnemyCard';
import { IEnemy, IPlanet } from '../../types/types';

import Header from '../../components/Header';
import { PlayerContext } from '../../context/PlayerContext';
import { getEnemies } from '../../functions/GetEnemies';
import { getSinglePlanet } from '../../functions/GetPlanet';
import './ExplorePage.css';

const ExplorePage: React.FC = () => {
  const [planetData, setPlanetData] = useState<IPlanet | null>(null);
  const [enemies, setEnemies] = useState<IEnemy[]>([]);
  const { player } = useContext(PlayerContext);

  useEffect(() => {
    const fetchData = async () => {
      if (player) {
        try {
          if (enemies.length <= 0 || enemies[0]?.location.toString() !== player?.location.toString()) {
            const enemyList = await getEnemies({ location: player.location });

            // If the planet has hidden enemies we want to remove them from the default list
            // these enemies will spawn with a % chance, this is handled in the battle page
            //
            const filteredList = enemyList?.filter((enemy: IEnemy) => !enemy.hidden);

            setEnemies(filteredList ?? []);
          }

          if (planetData && planetData?._id.toString() !== player.location.toString() || !planetData) {
            const planet = await getSinglePlanet(player.location);
            if (planet) setPlanetData(planet);
          }

        } catch (e) {
          console.error('Error fetching planet or enemies', e);
        }
      }
    };

    fetchData();
  }, [player?.location]);

  if (!planetData || !player) {
    return <IonSpinner />;
  }

  return (
    <IonPage id="main-content">
      <Header />
      <IonContent
        className="explore-content"
        style={{
          '--background': `url('/images/planets/planet-ground-${planetData.imgId}.webp') 0 0/cover no-repeat`,
        }}
      >
        <div className="text-overlay">
          <h4>You've arrived at {planetData.name}</h4>
          <p>{planetData.description}</p>
        </div>

        {enemies.map((enemy, index) => (
          <EnemyCard key={index} enemy={enemy} />
        ))}
      </IonContent>
    </IonPage>
  );
};

export default ExplorePage;
