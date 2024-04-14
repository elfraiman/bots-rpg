import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonSpinner, IonTitle } from "@ionic/react";
import { useEffect, useState } from "react";
import { GlobalModal } from "react-global-modal";
import { GetStory } from "../functions/GetStory";
import { IStory } from "../types/types";
import { usePlayerData } from "../context/PlayerContext";



const StoryModal = ({ storyStep }: { storyStep: number }) => {
  const [story, setStory] = useState<IStory | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { player, updatePlayerData } = usePlayerData();

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true)
      const story = await GetStory(storyStep)
      if (story && player?.quests.storyStep) {
        setStory(story);

        // Increase story step by 1 to prepare for the next story
        //
        updatePlayerData({ ...player, quests: { ...player?.quests, storyStep: player?.quests.storyStep + 1 } })
      }

      setLoading(false);
    }
    fetchStory();
  }, [])

  return (
    <IonCard className="corner-border " style={{ padding: 0, margin: 0, minHeight: 160 }}>
      <img src={loading ? `/images/placeholder.webp` : `/images/story/story-npc-${story?.npcImgId}.webp`} />
      {!loading && story ? (
        <>
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
      ) : (<></>)}
    </IonCard>
  )
}


export default StoryModal;