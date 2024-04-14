import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { IPlayer, IPlayer_quests } from '../types/types';
import * as Realm from 'realm-web';
import GetXpForNextLevel from '../functions/GetXpForNextLevel';
import { GlobalModal } from 'react-global-modal';
import StoryModal from '../components/StoryModal';

// Assuming you've properly initialized the Realm app outside of this component
const app = Realm.App.getApp('application-0-vgvqx');

interface IPlayerContext {
  player: IPlayer | null;
  updatePlayerData: (updates: Partial<IPlayer>) => Promise<void>;
}

const defaultState: IPlayerContext = {
  player: null,
  updatePlayerData: async () => { }
};

export const PlayerContext = createContext<IPlayerContext>(defaultState);

export const usePlayer = () => useContext(PlayerContext);

export const showStory = (storyStep: number) => {
  GlobalModal.push({
    component: StoryModal,
    props: {
      storyStep: storyStep
    },
    hideHeader: true,
    hideCloseIcon: true,
    contentClassName: 'story-modal-content',
    isCloseable: false,
  })
}

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [player, setPlayer] = useState<IPlayer | null>(null);

  const updatePlayerData = async (updates: Partial<IPlayer>) => {
    if (!app.currentUser) {
      console.error("No current user found");
      return;
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const players = mongodb.db("bots_rpg").collection<IPlayer>("players");
    const userId = app.currentUser.id;


    if (!userId) {
      console.error("No user id found");
      return;
    }

    try {
      const xpToNextLevel = GetXpForNextLevel({ level: player?.level ?? 0, });

      // Handle leveling up.
      if (player && xpToNextLevel <= player?.experience) {
        updates['level'] = player?.level + 1;
        updates['experience'] = 0;
        updates['attributePoints'] = player.attributePoints + 5;

        // If player reaches level 10 start story
        //
        if (player.level + 1 === 10) {
          showStory(0);
          (updates['quests'] as IPlayer_quests)['storyStep'] = 1;
        }
      }

      // Assuming 'updates' is an object with fields you want to update and their new values
      await players.updateOne({ _id: userId }, { $set: updates });

      // Update the local player state to reflect changes
      setPlayer((prevPlayer) => prevPlayer ? { ...prevPlayer, ...updates } : null);
    } catch (err) {
      console.error("Failed to update player data:", err);
    }
  };


  useEffect(() => {
    const fetchPlayer = async () => {
      // Check if there's already a player set to avoid unnecessary fetching
      if (player) return;

      // Ensure there's a logged-in user
      if (!app.currentUser) {
        console.error("No current user found");
        return;
      }

      const mongodb = app.currentUser.mongoClient("mongodb-atlas");
      const players = mongodb.db("bots_rpg").collection<IPlayer>("players");
      const userId = app.currentUser.id;

      if (!userId) {
        console.error("No user id found");
        return;
      }

      try {
        const playerResult = await players.findOne({ _id: userId }); // Adjust the query as needed
        if (playerResult) {
          setPlayer(playerResult);
        } else {
          console.error("Player not found");
        }
      } catch (err) {
        console.error("Failed to fetch player data:", err);
      }
    };

    fetchPlayer();
  }, [player]); // Dependency on 'player' to prevent refetching if it's already set

  return (
    <PlayerContext.Provider value={{ player, updatePlayerData }}>
      {children}
    </PlayerContext.Provider>
  );
};


// Custom hook to use the splash screen context
export const usePlayerData = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('useSplashScreen must be used within a SplashScreenProvider');
  }
  return context;
};
