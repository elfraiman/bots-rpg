import { IonContent, IonPage, IonSpinner } from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import EnemyCard from '../../components/EnemyCard';
import { IEnemy, IPlanet, IQuest } from '../../types/types';

import Header from '../../components/Header';
import { PlayerContext } from '../../context/PlayerContext';
import { getEnemies } from '../../functions/GetEnemies';
import { getSinglePlanet } from '../../functions/GetPlanet';
import './ExplorePage.css';
import { GetAvailableQuests } from '../../functions/GetAvailableQuests';
import QuestCard from '../../components/QuestCard';

const ExplorePage: React.FC = () => {
  const [planetData, setPlanetData] = useState<IPlanet | null>(null);
  const [enemies, setEnemies] = useState<IEnemy[]>([]);
  const [availableQuests, setAvailableQuests] = useState<IQuest[]>([]);
  const { player } = useContext(PlayerContext);

  useEffect(() => {
    const fetchData = async () => {

      if (player) {
        try {
          // Fetch enemies if location changed doesn't match the already set enemies location
          //
          if (enemies.length <= 0 || enemies[0]?.location.toString() !== player?.location.toString()) {
            const enemyList = await getEnemies({ location: player.location });

            // If the planet has hidden enemies we want to remove them from the default list
            // these enemies will spawn with a % chance, this is handled in the battle page
            //
            const filteredList = enemyList?.filter((enemy: IEnemy) => !enemy.hidden);

            setEnemies(filteredList ?? []);
          }
          // Fetch planet if the current planet doesn't fit the new location
          //
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

  useEffect(() => {
    if (!player) return;

    const fetchQuests = async () => {

      try {
        const quests = await GetAvailableQuests(player.location);
        if (quests) {
          const completedQuestIds = new Set(player.quests?.completed.map(q => q.toString()));
          const questsAvailable = quests.filter(quest => !completedQuestIds.has(quest._id.toString()));
          const lowestQuestStep = Math.min(...questsAvailable.map(quest => quest.questStep));
          setAvailableQuests(questsAvailable.filter(quest => quest.questStep === lowestQuestStep));
        }
      } catch (error) {
        console.error("Failed to fetch quests:", error);
      }
    };

    fetchQuests();
  }, [player?.quests]);


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

        {availableQuests?.map((q: IQuest, index) => (
          <QuestCard quest={q} key={index} />
        ))}


        {enemies.map((enemy, index) => (
          <EnemyCard key={index} enemy={enemy} />
        ))}
      </IonContent>
    </IonPage>
  );
};

export default ExplorePage;
