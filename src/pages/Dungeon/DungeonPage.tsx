import { IonButton, IonCard, IonCardContent, IonCardSubtitle, IonContent, IonPage, IonText, useIonViewDidLeave, useIonViewWillEnter } from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import PageTitle from "../../components/PageTitle";
import { useDungeonEnemyListProvider } from "../../context/DungeonEnemyListContext";
import { getEnemyTypeColor } from "../../functions/GetColor";
import { getDungeon } from "../../functions/GetDungeons";
import { getEnemies, getSingleEnemy } from "../../functions/GetEnemies";
import { IDungeon, IEnemy } from "../../types/types";
import './DungeonPage.css';
import BattleLog from "../../components/BattleLog";
import { useBattleProvider } from "../../context/BattleContext";
import { useNavigationDisable } from "../../context/DisableNavigationContext";

const DungeonPage = () => {
  const match = useRouteMatch<{ id: string }>();
  const params: any = match.params;
  const [dungeonData, setDungeonData] = useState<IDungeon | null>(null);
  const { setEnemyList, removeEnemy, enemyList } = useDungeonEnemyListProvider();
  const { setEnemy, setBattleActive, battleState, battleActive } = useBattleProvider();
  const [dungeonActivated, setDungeonActivated] = useState(false);
  const [dungeonComplete, setDungeonComplete] = useState(false);
  const { setIsNavigationDisabled } = useNavigationDisable();

  const getEnemy = async (enemyId: any) => {
    const stringId = enemyId.toString();
    if (stringId) {
      const enemyData = await getSingleEnemy({ monsterId: stringId });

      if (enemyData) {
        setEnemy(enemyData);
        setDungeonActivated(true);
      }
    }
  }

  const startDungeon = () => {
    if (!dungeonActivated) {
      getEnemy(enemyList[0]?._id);
      setIsNavigationDisabled(true)
    }
  }

  useIonViewDidLeave(() => {
    setBattleActive(false);
  });

  const fetchDungeonData = async () => {
    try {
      const dungeon = await getDungeon(params.id);
      if (dungeon) {
        setDungeonData(dungeon);

        // Fetch all enemies for the location of the dungeon.
        const enemyList = await getEnemies({ location: dungeon?._id });
        if (!enemyList) return;

        // Create a map for quick access to enemies by their _id, converted to string.
        const enemyMap = new Map(enemyList.map(enemy => [enemy._id.toString(), enemy]));

        // Iterate over dungeon.enemies and build the list based on the IDs.
        const filteredEnemies = dungeon.enemies.map(dungeonEnemyId => {
          const enemyIdStr = dungeonEnemyId.toString();
          return enemyMap.get(enemyIdStr);
        }).filter(enemy => enemy); // Explicitly filter out undefined or null entries

        setEnemyList(filteredEnemies as IEnemy[]);
      }
    } catch (e) {
      console.error('Error fetching dungeon or enemies', e);
    }
  }

  const calculateCardPosition = (index: number, total: number) => {
    const overlap = 105; // Amount each card should overlap the previous one
    const startPosition = 0; // Start position offset for the first card
    return startPosition + (index * (150 - overlap)); // Adjust '150' based on your card width
  };


  useIonViewWillEnter(() => {
    console.log("Welcome to the dungeon");
    fetchDungeonData();
  }, [])


  // Every time a battle ends, check if the player is still alive and if there are more enemies to fight.
  // If there are more enemies, get the next one. If not, set the dungeon as complete.
  //
  useEffect(() => {
    if (battleState.attackLog.battleEnd && !battleActive && battleState.player.health > 0 && dungeonActivated) {
      removeEnemy();
      if (enemyList.length > 0) {
        getEnemy(enemyList[0]?._id);
      } else {
        setIsNavigationDisabled(false);
        setDungeonActivated(false);
        setDungeonComplete(true);
      }

    }
  }, [battleState.attackLog.battleEnd])


  return (
    <IonPage className="content">
      <IonContent className="ion-padding" style={{
        '--background': `url('/images/planets/dungeons/dungeon-ground-${dungeonData?.imgId}.webp') 0 0 / cover no-repeat`,
      }}>
        {dungeonData && (
          <>
            <PageTitle title={dungeonData.name} subtitle={dungeonData.description} />
            {!dungeonComplete ? (
              <IonCard style={{ margin: 0 }} className="card-fade">

                <IonCardContent>
                  <IonCardSubtitle style={{ color: 'gold' }}>
                    This dungeon has a chance to drop rare loot.
                  </IonCardSubtitle>
                  <IonCardSubtitle style={{ color: 'gold' }}>
                    Enemies in this dungeon:
                  </IonCardSubtitle>

                  <div className="dungeon-enemy-cards">
                    {enemyList.map((enemy, index) => (
                      <div
                        key={index}
                        className="dungeon-enemy-card"
                        style={{
                          backgroundImage: `url('/images/enemies/enemy-${enemy?.imgId}.webp')`,
                          left: `${calculateCardPosition(index, enemyList.length)}px` // Positioning each card
                        }}
                      >
                        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 6, color: getEnemyTypeColor(enemy.type) }}>
                          <span>{enemy.name}</span>
                          <span style={{ display: 'block', color: 'yellow' }}>Level: {enemy.level}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <IonButton
                    expand="block"
                    onClick={() => startDungeon()}
                    disabled={dungeonActivated}>
                    Start
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ) : (
              <IonCard>
                Winner!
              </IonCard>
            )}


            {dungeonActivated ? (
              <IonCard style={{ margin: 0, padding: 0 }}>
                <IonCardContent style={{ margin: 0, padding: 0 }}>
                  <BattleLog />
                </IonCardContent>
              </IonCard>
            ) : <></>}

          </>
        )}

      </IonContent>
    </IonPage>
  )
}

export default DungeonPage;