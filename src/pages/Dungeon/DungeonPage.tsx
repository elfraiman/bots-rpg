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

const DungeonPage = () => {
  const match = useRouteMatch<{ id: string }>();
  const params: any = match.params;
  const [dungeonData, setDungeonData] = useState<IDungeon | null>(null);
  const { setEnemyList, removeEnemy, enemyList } = useDungeonEnemyListProvider();
  const { setEnemy, setBattleActive, battleActive, doubleAttack } = useBattleProvider();
  const [dungeonActivated, setDungeonActivated] = useState(false);

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


  return (
    <IonPage className="content">
      <IonContent className="ion-padding" style={{
        '--background': `url('/images/planets/dungeons/dungeon-ground-${dungeonData?.imgId}.webp') 0 0 / cover no-repeat`,
      }}>
        {dungeonData && (
          <>
            <PageTitle title={dungeonData.name} subtitle={dungeonData.description} />
            <IonCard style={{ margin: 0 }} className="low-fade">

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
                        backgroundImage: `url('/images/enemies/dungeon-enemy-${enemy?.imgId}.webp')`,
                        left: `${calculateCardPosition(index, enemyList.length)}px` // Positioning each card
                      }}
                      onClick={() => getEnemy(enemy._id)}
                    >
                      <IonText style={{ color: getEnemyTypeColor(enemy.type), padding: '10px' }}>
                        {enemy.name}
                        <IonCardSubtitle style={{ display: 'block' }}>Level: {enemy.level}</IonCardSubtitle>
                      </IonText>
                    </div>
                  ))}
                </div>
              </IonCardContent>
            </IonCard>


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