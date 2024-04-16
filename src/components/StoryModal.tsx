import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonSpinner, useIonViewDidEnter } from "@ionic/react";
import { useEffect, useState } from "react";
import { GlobalModal } from "react-global-modal";
import { GetStory } from "../functions/GetStory";
import { IPlayer, IStory } from "../types/types";


interface IStoryModalProps {
  storyStep: number;
  player: IPlayer;
  updatePlayerData: (updates: Partial<IPlayer>) => Promise<void>;
}


const StoryModal = ({ storyStep, player, updatePlayerData }: IStoryModalProps) => {
  const [story, setStory] = useState<IStory | null>(null);
  const [loading, setLoading] = useState<boolean>(false);


  const fetchStory = async () => {
    console.log('STEP', storyStep, player.quests.storyStep)
    setLoading(true)

    if (player?.quests.storyStep != storyStep) return;

    GetStory(storyStep).then(story => {
      if (story) {
        setStory(story);
        // Increase story step by 1 to prepare for the next story
        //
        updatePlayerData({ quests: { ...player.quests, storyStep: storyStep + 1 } })
      }

    }).catch(e => console.error(e)).finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchStory();
  }, [storyStep])

  return (
    <IonCard className="corner-border " style={{ padding: 0, margin: 0, minHeight: 595 }}>
      {!loading && story ? (
        <>
          <img src={`/images/npc/story-npc-${story?.npcImgId}.webp`} />
          <IonCardHeader>
            <IonCardTitle style={{ display: 'flex', justifyContent: 'space-between' }}>{story.npcName}</IonCardTitle>
            <IonCardSubtitle>{story.storyName}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent className="ion-padding">
            <p>{story.story}</p>
            <IonButton expand="block" fill="outline" onClick={() => GlobalModal.pop()} style={{ marginTop: 26 }}>
              Confirm
            </IonButton>
          </IonCardContent>
        </>
      ) : (
        <div className="spinner-center">
          <IonSpinner />
        </div>
      )}
    </IonCard>
  )
}


export default StoryModal;
