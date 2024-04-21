import { IonButton, IonButtons, IonContent, IonPage } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import BattleLog from "../../components/BattleLog";
import { useBattleProvider } from "../../context/BattleContext";
import { useNavigationDisable } from "../../context/DisableNavigationContext";
import { PlayerContext } from "../../context/PlayerContext";
import { getSingleEnemy } from "../../functions/GetEnemies";
import { IEnemy } from "../../types/types";
import './BattleTrain.css';




interface IPlayerDefensiveStats {
  evasion: number;
  defense: number;
}


const BattleTrain = () => {
  const { player, updatePlayerData } = useContext(PlayerContext); // Assuming usePlayerHook returns player with health
  const history = useHistory();
  const match = useRouteMatch<{ id: string, planetImgId: string }>();
  const params: any = match.params;
  const { battleActive } = useBattleProvider();

  const { setEnemy } = useBattleProvider();

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

  return (
    <IonPage className="content">
      {
        //* Battle header enemy vs player *//
      }

      <IonContent className="content" style={{
        '--background': `url('/images/planets/planet-battle-${params?.planetImgId}.webp') 0 0/cover no-repeat`,
      }}>

        <BattleLog />

        {!battleActive ? (
          <>
            <div>
              {
                // *If elite or boss enemy *//
              }

            </div>

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
                  history.goBack();
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
                  history.goBack();
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
