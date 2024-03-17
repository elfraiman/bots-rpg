import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonRouterLink, IonRow } from "@ionic/react";
import { IEnemy } from '../types/types';

interface IEnemyCardProps {
    enemy: IEnemy;
}

const EnemyCard = ({ enemy }: IEnemyCardProps) => {

    return (
        <IonCard className="card-fade">
            <IonCardHeader>
                <IonCardTitle>{enemy.name}</IonCardTitle>
                <IonCardSubtitle>Level: {enemy.level}</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
                {enemy.description}


            </IonCardContent>
            <IonGrid className="ion-padding">
                <IonRow>
                    <IonCol>
                        Health: <span style={{ fontWeight: 900, color: 'green' }}>{enemy.maxHealth}</span>
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
                <IonRouterLink routerLink={`/train/${enemy._id}`}>Fight</IonRouterLink>
            </IonButton>
        </IonCard>

    )
}

export default EnemyCard;