import { IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol } from "@ionic/react";
import { ReactElement } from "react";
import { getItemGradeColor } from "../functions/GetColor";
import { IPlayer, IEnemy } from "../types/types";

export interface IBattleLogMessageProps {
  playerWin: boolean;
  player: IPlayer;
  enemy: IEnemy;
  stats: {
    attempts: number;
    hitRate: number;
    maxHit: number;
    averageDamage: number;
    totalDamage: number;
    goldReward: number;
    xpReward: number;
    loot: any[];
  };
}


const createBattleLogMessage = ({ playerWin, player, enemy, stats }: IBattleLogMessageProps): ReactElement => {
  return (
    <div className="card-fade">
      <IonCardTitle style={{ borderBottom: "1px solid var(--ion-color-primary)" }} className="ion-padding">Battle Statistics</IonCardTitle>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol>Attempts:</IonCol>
            <IonCol>{stats.attempts}</IonCol>
          </IonRow>
          <IonRow>
            <IonCol>Hit Rate:</IonCol>
            <IonCol>{stats.hitRate}%</IonCol>
          </IonRow>
          <IonRow>
            <IonCol>Max Hit:</IonCol>
            <IonCol>{stats.maxHit}</IonCol>
          </IonRow>
          <IonRow>
            <IonCol>Average Damage:</IonCol>
            <IonCol>{stats.averageDamage}</IonCol>
          </IonRow>
          <IonRow>
            <IonCol>Total Damage:</IonCol>
            <IonCol>{stats.totalDamage}</IonCol>
          </IonRow>
          <IonRow>
            <IonCol>Winner:</IonCol>
            <IonCol><span className={`${playerWin ? 'player-name' : 'enemy-name'}`}>{playerWin ? player.name : enemy.name}</span></IonCol>
          </IonRow>
          <IonRow>
            <IonCol>Gold Reward:</IonCol>
            <IonCol><span style={{ color: 'gold' }}>{stats.goldReward} 🪙</span></IonCol>
          </IonRow>
          <IonRow>
            <IonCol>XP Gained:</IonCol>
            <IonCol><span style={{ color: 'aquamarine' }}>{stats.xpReward}</span></IonCol>
          </IonRow>
          {stats.loot.length > 0 && (
            <IonRow>
              <IonCol>Loot:</IonCol>
              <IonCol>
                {stats.loot.map((item, index) => (
                  <div key={index}>
                    {item.quantity}x <span style={{ color: getItemGradeColor(item.item.grade ?? 'common') }}>{item.item.name}</span>
                  </div>
                ))}
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonCardContent>
    </div>
  );
};


export default createBattleLogMessage;