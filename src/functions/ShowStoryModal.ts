import { GlobalModal } from "react-global-modal";
import StoryModal from "../components/StoryModal";
import { IPlayer } from "../types/types";

interface IShowStoryModalProps {
  storyStep: number;
}

// Using a static-like object to track shown modals
const shownModals = new Set<number>();

export const showStoryModal = ({ storyStep }: IShowStoryModalProps) => {
  console.log('[ShowStoryModal]: show story', storyStep);

  // Check if the modal for the current step has already been shown
  if (shownModals.has(storyStep)) {
    console.log(`Modal for story step ${storyStep} already shown.`);
    return;
  }


  // Show the modal and mark this story step as shown
  GlobalModal.push({
    component: StoryModal,
    props: {
      storyStep: storyStep,
    },
    hideHeader: true,
    hideCloseIcon: true,
    contentClassName: 'story-modal-content',
    isCloseable: false,
  });

  // Record that this story step modal has been shown
  shownModals.add(storyStep);
  console.log(`Modal shown for story step ${storyStep}.`);
};
