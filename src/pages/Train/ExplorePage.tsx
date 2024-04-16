import { IonContent, IonPage, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import EnemyCard from '../../components/EnemyCard';
import { IEnemy, IPlanet, IPlayer, IQuest } from '../../types/types';

import QuestCard from '../../components/QuestCard';
import { usePlayerData } from '../../context/PlayerContext';
import { GetAvailableQuests } from '../../functions/GetAvailableQuests';
import { getEnemies } from '../../functions/GetEnemies';
import { getSinglePlanet } from '../../functions/GetPlanet';
import './ExplorePage.css';
import SplashScreen from "../SplashScreen/SplashScreen";
import { useNavigationDisable } from '../../context/DisableNavigationContext';

const ExplorePage: React.FC = () => {
  const [planetData, setPlanetData] = useState<IPlanet | null>(null);
  const [enemies, setEnemies] = useState<IEnemy[]>([]);
  const [availableQuests, setAvailableQuests] = useState<IQuest[]>([]);
  const { isNavigationDisabled, triggerDisableWithTimer } = useNavigationDisable();
  const { player } = usePlayerData();


  const fetchLocationData = async (player: IPlayer) => {

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

  };


  const fetchQuests = async (player: IPlayer) => {
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

  // We fetch this every time the location changes
  // since quests are location based
  //
  useEffect(() => {
    if (!player) return;
    fetchQuests(player);
  }, [player?.quests, player?.location.toString()]);

  useEffect(() => {
    if (!player || !player?.location) return;
    fetchLocationData(player);
    localStorage.setItem('shownSplash', 'false');
  }, [player?.location.toString()]);

  useIonViewWillEnter(() => {
    const splashShown = JSON.parse(localStorage.getItem('shownSplash') ?? "false");

    if (!splashShown) {
      localStorage.setItem('shownSplash', 'true');
      triggerDisableWithTimer(5000);
    }
  })

  return (
    <IonPage className="content">
      {isNavigationDisabled ? (
        <SplashScreen imgSrc={`/images/planets/planet-ground-${planetData?.imgId}.webp`} />
      ) : (
        <IonContent
          className="ion-padding"
          style={{
            '--background': `url('/images/planets/planet-ground-${planetData?.imgId}.webp') 0 0/cover no-repeat`,
          }}
        >
          {!planetData || !player ? <></> : (
            <>
              <div className="ion-padding low-fade corner-border" style={{ marginBottom: 16 }}>
                <h2 style={{ marginTop: 0 }}>You've arrived at {planetData.name}</h2>
                <p>{planetData.description}</p>
              </div>

              {availableQuests?.map((q: IQuest, index) => (
                <QuestCard quest={q} key={index} />
              ))}

              {enemies.map((enemy, index) => (
                <div style={{ marginTop: 16 }} key={index}>
                  <EnemyCard enemy={enemy} />
                </div>
              ))}
            </>
          )}
        </IonContent>
      )}

    </IonPage>
  );
};

export default ExplorePage;
