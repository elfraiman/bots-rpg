import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonImg, IonRouterLink, IonRow, IonThumbnail } from "@ionic/react";
import { IEnemy } from '../types/types';
import { useHistory } from "react-router";
import { calculateMaxHealth } from "../types/stats";

interface IEnemyCardProps {
  enemy: IEnemy;
}

const EnemyCard = ({ enemy }: IEnemyCardProps) => {
  const history = useHistory();
  return (
    <IonCard className="card-fade" style={{ zIndex: 101, margin: 0 }}>
      <IonCardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <IonCardTitle>{enemy.name}</IonCardTitle>
            <IonCardSubtitle>Level: {enemy.level}</IonCardSubtitle>
          </div>
          <IonThumbnail>
            <IonImg src={`/images/enemies/enemy-${enemy?.imgId}.webp`} alt="Enemy " />
          </IonThumbnail>
        </div>
      </IonCardHeader>

      <IonCardContent>
        {enemy.description}
      </IonCardContent>

      <IonGrid className="ion-padding">
        <IonRow>
          <IonCol>
            Health: <span style={{ fontWeight: 900, color: 'green' }}>{calculateMaxHealth(enemy)}</span>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            STR: {enemy.str}
          </IonCol>
          <IonCol>
            DEX: {enemy.dex}
          </IonCol>
          <IonCol>
            CON: {enemy.con}
          </IonCol>
          <IonCol>
            INT: {enemy.int}
          </IonCol>
        </IonRow>

        <IonRow>
          <IonButton
            className="corner-border"
            style={{
              width: '100%', marginTop: 8
            }}
            fill="clear"
            onClick={(e) => {
              e.preventDefault();
              history.push(`/fight/${enemy._id}`);
            }}
          >
            Fight
          </IonButton>
        </IonRow>
      </IonGrid>
    </IonCard>
  )
}

export default EnemyCard;