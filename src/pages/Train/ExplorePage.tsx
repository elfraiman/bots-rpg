import { IonAccordion, IonAccordionGroup, IonContent, IonItem, IonPage, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import EnemyCard from '../../components/EnemyCard';
import { IDungeon, IEnemy, IPlanet, IPlayer, IQuest } from '../../types/types';

import DungeonCard from '../../components/DungeonCard';
import PageTitle from '../../components/PageTitle';
import QuestCard from '../../components/QuestCard';
import { useNavigationDisable } from '../../context/DisableNavigationContext';
import { usePlayerProvider } from '../../context/PlayerContext';
import { GetAvailableQuests } from '../../functions/GetAvailableQuests';
import { getDungeons } from '../../functions/GetDungeons';
import { getEnemies } from '../../functions/GetEnemies';
import { getSinglePlanet } from '../../functions/GetPlanet';
import triggerTheme from '../../functions/TriggerTheme';
import SplashScreen from "../SplashScreen/SplashScreen";
import './ExplorePage.css';
import { useBattleProvider } from '../../context/BattleContext';

const ExplorePage: React.FC = () => {
  const [planetData, setPlanetData] = useState<IPlanet | null>(null);
  const [enemies, setEnemies] = useState<IEnemy[]>([]);
  const [dungeons, setDungeons] = useState<IDungeon[]>([]);
  const [availableQuests, setAvailableQuests] = useState<IQuest[]>([]);
  const { isNavigationDisabled, triggerDisableWithTimer } = useNavigationDisable();
  const { player } = usePlayerProvider();

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
        if (planet?.hexColor) triggerTheme(planet.hexColor);
        if (planet) {
          setPlanetData(planet)
          const dungeons = await getDungeons(planet._id);
          if (dungeons) setDungeons(dungeons);
        };
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
        // The quests that are available are those that the player has not completed
        // and are part of his location, each location has "Steps" of quests, and we will display the lowest
        // available step first.
        // I need to add support for multiple steps if wanted to allow multiple quests at the same time
        //
        const questsAvailable = quests.filter(quest => !completedQuestIds.has(quest._id.toString()));
        const lowestQuestStep = Math.min(...questsAvailable.map(quest => quest.questStep));
        setAvailableQuests(questsAvailable.filter(quest => quest.questStep === lowestQuestStep));
      }
    } catch (error) {
      console.error("Failed to fetch quests:", error);
    }
  };

  // I fetch this every time the location changes
  // since quests are location based
  //
  useEffect(() => {
    if (!player) return;
    fetchQuests(player);
  }, [player?.quests, player?.location.toString()]);

  useEffect(() => {
    if (!player || !player?.location) return;
    fetchLocationData(player);
  }, [player?.location.toString()]);

  useIonViewWillEnter(() => {

    // Handles showing splash screen on new planet
    //
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
              <PageTitle title={`You've arrived at ${planetData.name}`} subtitle={planetData.description} />

              {availableQuests?.map((q: IQuest, index) => (
                <QuestCard quest={q} key={index} />
              ))}

              {dungeons ? (
                <IonAccordionGroup style={{ marginTop: 16 }} className="corner-border">
                  <IonAccordion value="dungeon">
                    <IonItem slot="header">
                      <IonItem>Dungeons</IonItem>
                    </IonItem>
                    {dungeons?.map((dungeon, index) => (
                      <div className="ion-padding" slot="content" key={index} style={{
                        'background': `url('/images/planets/dungeons/dungeon-card-${dungeon.imgId}.webp') 0 0/cover no-repeat`,
                        height: '100%',
                      }}>
                        <DungeonCard dungeon={dungeon} />
                      </div>
                    ))}
                  </IonAccordion>
                </IonAccordionGroup>
              ) : <></>}

              {enemies.map((enemy, index) => (
                <div style={{ marginTop: 16 }} key={index}>
                  <EnemyCard enemy={enemy} planetImgId={planetData?.imgId} />
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
