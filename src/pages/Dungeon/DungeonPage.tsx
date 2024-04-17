import { IonCard, IonCardContent, IonCol, IonContent, IonPage, IonRow, useIonViewWillEnter } from "@ionic/react";
import { useState } from "react";
import { useRouteMatch } from "react-router";
import { IDungeon, IEnemy } from "../../types/types";
import { getDungeon } from "../../functions/GetDungeons";
import PageTitle from "../../components/PageTitle";
import { getEnemies } from "../../functions/GetEnemies";
import EnemyCard from "../../components/EnemyCard";


const DungeonPage = () => {
  const match = useRouteMatch<{ id: string }>();
  const params: any = match.params;
  const [dungenData, setDungeonData] = useState<IDungeon | null>(null);
  const [enemies, setEnemies] = useState<IEnemy[]>([]);



  const fetchDungeonData = async () => {
    try {
      const dungeon = await getDungeon(params.id);
      if (dungeon) setDungeonData(dungeon);
      // Fetch enemies if location changed doesn't match the already set enemies location
      //
      if (enemies.length <= 0) {
        const enemyList = await getEnemies({ location: dungeon?._id });

        console.log(enemyList, dungeon)
        setEnemies(enemyList ?? []);
      }
    } catch (e) {
      console.error('Error fetching planet or enemies', e);
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


            <IonCard>
              <IonCardContent>
                {enemies.map((enemy, index) => (
                  <div style={{
                    'background': `url('/images/enemies/dungeon-enemy-${enemy?.imgId}.webp') 0 0 / cover no-repeat`,
                    backgroundPosition: 'center',
                    height: 80
                  }}>
                    <IonRow>
                      <IonCol>
                        {enemy.name}
                      </IonCol>
                    </IonRow>
                  </div>
                ))}
              </IonCardContent>
            </IonCard>
          </>
        )}
      </IonContent>
    </IonPage>
  )
}

export default DungeonPage;