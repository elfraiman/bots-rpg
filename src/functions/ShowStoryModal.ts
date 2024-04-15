import { GlobalModal } from "react-global-modal";
import StoryModal from "../components/StoryModal";
import { IPlayer } from "../types/types";


interface IShowStoryModalProps {
  storyStep: number;
  player: IPlayer;
  updatePlayerData: (updates: Partial<IPlayer>) => Promise<void>;
}

export const showStoryModal = ({ storyStep, player, updatePlayerData }: IShowStoryModalProps) => {
  console.log('[ShowStoryModal]: show story', storyStep)

  GlobalModal.push({
    component: StoryModal,
    props: {
      storyStep: storyStep,
      player: player,
      updatePlayerData: updatePlayerData
    },
    hideHeader: true,
    hideCloseIcon: true,
    contentClassName: 'story-modal-content',
    isCloseable: false,

  })
}