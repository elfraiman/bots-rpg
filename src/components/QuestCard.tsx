import { IonButton, IonButtons, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonSpinner } from "@ionic/react";
import { useContext, useEffect, useState } from 'react';
import * as Realm from 'realm-web';
import { PlayerContext } from '../context/PlayerContext';
import GetBaseItem from "../functions/GetBaseItem";
import { GetCombinedItemDetails } from "../functions/GetCombinedItemDetails";
import { getSingleEnemy } from "../functions/GetEnemies";
import { IEnemy, IItem, IQuest } from "../types/types";

interface IQuestCardProps {
  quest: IQuest;
}

const QuestCard = ({ quest }: IQuestCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const { player, updatePlayerData } = useContext(PlayerContext);
  const [objectiveInfo, setObjectiveInfo] = useState<IItem | IEnemy>();
  const [playerInProgress, setPlayerInProgress] = useState<boolean>(false);
  const [conditionsMet, setConditionsMet] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);


  if (quest._id === undefined) {
    console.error("No id on quest");
    return;
  }

  const getObjectiveInfos = async () => {
    setLoading(true)
    if (quest.objective?.target && quest.objective.type === 'collect') {
      const getItemData = await GetBaseItem(quest.objective.target);

      if (getItemData) {
        setObjectiveInfo(getItemData)
      }

      checkIfValidToComplete('collect');

    } else if (quest.objective?.target && quest.objective.type === 'kill') {
      const enemyInfo = await getSingleEnemy({ monsterId: quest.objective.target.toString() });
      if (enemyInfo) {
        setObjectiveInfo(enemyInfo);
      }

    }
    setLoading(false);
  }

  const acceptQuest = async () => {
    const playerInProgress = player?.quests?.inProgress.find((q) => q.toString() === quest._id.toString());
    if (player?.quests?.inProgress && !playerInProgress) {
      await updatePlayerData({
        ...player,
        quests: {
          ...player.quests,
          inProgress: [...player?.quests?.inProgress, quest._id]
        }
      })

      setPlayerInProgress(true);
    } else {
      throw ("Player doesn't have the Quests object");
    }
  }


  const checkIfValidToComplete = async (type: string) => {
    try {
      if (objectiveInfo && type === 'collect') {

        if (!player) return;
        const itemPromises = player?.inventory?.map((itemId: Realm.BSON.ObjectId) => GetCombinedItemDetails(itemId));
        const items = await Promise.all(itemPromises);
        const findSameItem = items.find(item => item?.baseItemId.toString() === objectiveInfo._id.toString());

        if (findSameItem?.quantity ?? 0 >= quest.objective?.targetAmount) {
          console.log('quest complete');
          setConditionsMet(true);
        }
      } else if (objectiveInfo && type === 'kill') {

      }
    } catch (e) {
      throw (e);
    }
  }

  useEffect(() => {
    getObjectiveInfos();

    const playerInProgress = player?.quests?.inProgress.find((q) => q.toString() === quest._id.toString());
    if (playerInProgress) {
      setPlayerInProgress(true);
    }

  }, [])


  return (
    <IonCard className="ion-padding">
      {loading ? <IonSpinner /> : (
        <>
          <IonCardTitle style={{ display: 'flex', justifyContent: 'space-between' }}>{quest.npcName} <span style={{ color: playerInProgress ? 'var(--ion-color-primary)' : 'var(--ion-color-success)' }}>{playerInProgress ? 'In progress' : 'Available'}</span></IonCardTitle>
          <IonCardSubtitle>{quest.name}</IonCardSubtitle>
          <IonCardContent>
            {quest.description}
          </IonCardContent>
          <IonButtons>

            <div style={{ fontSize: 16, fontWeight: 600 }}>
              <span>{quest.objective?.type} </span>
              <span style={{ color: conditionsMet ? 'green' : 'red' }}>{quest.objective?.targetAmount} </span>
              <span>{objectiveInfo?.name}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              {playerInProgress ? <IonButton fill="outline">Turn in</IonButton> : <IonButton fill="outline" onClick={() => acceptQuest()}>Accept</IonButton>}
            </div>

          </IonButtons>
        </>
      )}

    </IonCard>
  );
};

export default QuestCard;
