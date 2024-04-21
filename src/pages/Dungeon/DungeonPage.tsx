import { IonButton, IonCard, IonCardContent, IonCardSubtitle, IonChip, IonCol, IonContent, IonPage, IonRow, IonText, useIonViewWillEnter } from "@ionic/react";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import PageTitle from "../../components/PageTitle";
import { getDungeon } from "../../functions/GetDungeons";
import { getEnemies } from "../../functions/GetEnemies";
import { getEnemyTypeColor } from "../../functions/GetColor";
import { IDungeon, IEnemy } from "../../types/types";


const DungeonPage = () => {
  const match = useRouteMatch<{ id: string }>();
  const params: any = match.params;
  const [dungenData, setDungeonData] = useState<IDungeon | null>(null);
  const [enemies, setEnemies] = useState<IEnemy[]>([]);
  const history = useHistory();

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


        setEnemies(filteredEnemies as IEnemy[]);
      }
    } catch (e) {
      console.error('Error fetching dungeon or enemies', e);
    }
  }

  useIonViewWillEnter(() => {
    console.log("Welcome to the dungeon");
    console.log(params.id)
    fetchDungeonData();
  }, [])


  return (
    <IonPage className="content">
      <IonContent className="ion-padding" style={{
        '--background': `url('/images/planets/dungeons/dungeon-ground-${dungenData?.imgId}.webp') 0 0 / cover no-repeat`,
      }}>
        {dungenData && (
          <>
            <PageTitle title={dungenData.name} subtitle={dungenData.description} />
            <IonCard style={{ margin: 0 }} className="low-fade">
              <IonCardContent>
                {enemies.map((enemy: IEnemy, index: number) => (
                  <div className="corner-border" key={index} style={{
                    'background': `url('/images/enemies/dungeon-enemy-${enemy?.imgId}.webp') 0 0 / cover no-repeat`,
                    backgroundPosition: 'center',
                    height: 68,
                    marginTop: 16
                  }}>
                    <IonRow onClick={() => history.push(`/fight/${enemy._id}/0`)}>
                      <IonCol>
                        <IonText style={{ color: getEnemyTypeColor(enemy.type) }}>
                          {enemy.name}
                        </IonText>
                        <IonCardSubtitle>Level: {enemy.level}</IonCardSubtitle>
                      </IonCol>
                      <IonCol style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <IonChip>{index + 1}</IonChip>
                      </IonCol>
                    </IonRow>
                  </div>
                ))}
              </IonCardContent>

              <IonButton>Fight</IonButton>
            </IonCard>
          </>
        )}
      </IonContent>
    </IonPage>
  )
}

export default DungeonPage;