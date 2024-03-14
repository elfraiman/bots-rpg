import react from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonRouterLink } from "@ionic/react"
import { enemy } from '../types/schemas';

interface IEnemyCardProps {
    enemy: enemy;
}

const EnemyCard = ({ enemy }: IEnemyCardProps) => {

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>{enemy.name}</IonCardTitle>
                <IonCardSubtitle>Level: {enemy.level}</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
                {enemy.description}
            </IonCardContent>

            <IonButton fill='clear'>
                <IonRouterLink routerLink={`/train/${enemy._id}`}>Fight</IonRouterLink>
            </IonButton>
        </IonCard>

    )
}

export default EnemyCard;