import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonImg, IonRouterLink, IonRow, IonThumbnail } from "@ionic/react";
import { IEnemy } from '../types/types';
import calculateMaxHealth from "../functions/GetMaxHealth";

interface IEnemyCardProps {
    enemy: IEnemy;
}

const EnemyCard = ({ enemy }: IEnemyCardProps) => {

    return (
        <IonCard className="card-fade" style={{ zIndex: 101 }}>
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


            </IonGrid>
            <IonButton fill='clear'>
                <IonRouterLink routerLink={`/fight/${enemy._id}`}>Fight</IonRouterLink>
            </IonButton>
        </IonCard>

    )
}

export default EnemyCard;