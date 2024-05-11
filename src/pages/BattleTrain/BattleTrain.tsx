import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonIcon, IonPage, useIonViewDidLeave } from "@ionic/react";
import { useContext, useEffect } from "react";
import { useRouteMatch } from "react-router";
import BattleLog from "../../components/BattleLog";
import { useBattleProvider } from "../../context/BattleContext";
import { PlayerContext } from "../../context/PlayerContext";
import { getSingleEnemy } from "../../functions/GetEnemies";
import './BattleTrain.css';
import { add } from "ionicons/icons";


const BattleTrain = () => {
  const { player } = useContext(PlayerContext); // Assuming usePlayerHook returns player with health
  const match = useRouteMatch<{ id: string, planetImgId: string }>();
  const params: any = match.params;
  const { setEnemy, setBattleActive, battleActive, doubleAttack } = useBattleProvider();

  const getEnemy = async () => {
    const monsterId = params.id;
    if (monsterId) {
      const enemyData = await getSingleEnemy({ monsterId: monsterId });

      if (enemyData) {
        setEnemy(enemyData);
      }
    }
  }

  useEffect(() => {
    if (player) {
      getEnemy();
    }
  }, []);

  useIonViewDidLeave(() => {
    setBattleActive(false);
  });



  return (
    <IonPage className="content" >
      <IonContent style={{
        '--background': `url('/images/planets/planet-battle-${params?.planetImgId}.webp') 0 0/cover no-repeat`,
      }}>


        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
          <BattleLog pushHeader={true} />
        </div>



        {!battleActive ? (
          <>
            <IonButtons style={{ position: 'fixed', bottom: 0, display: 'flex', width: '100%' }}>
              <IonButton
                style={{
                  width: '100%'
                }}
                fill="solid"
                className="corner-border"
                color="light"
                onClick={(e) => {
                  e.preventDefault();
                  history.back();
                }}
              >
                Return
              </IonButton>

              <IonButton
                style={{
                  width: '100%'
                }}
                fill="solid"
                className="corner-border"
                color="success"
                onClick={(e) => {
                  e.preventDefault();
                  getEnemy();
                }}
              >
                Fight
              </IonButton>
            </IonButtons>
          </>
        ) : (<></>)}

      </IonContent>
    </IonPage >
  );
};

export default BattleTrain;
