import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import * as Realm from 'realm-web';
import GetXpForNextLevel from '../functions/GetXpForNextLevel';
import { IPlayer, IPlayer_quests } from '../types/types';
import { showStoryModal } from '../functions/ShowStoryModal';

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

const mongodbPlayerCollection = app.currentUser?.mongoClient("mongodb-atlas").db("bots_rpg").collection<IPlayer>("players");

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [player, setPlayer] = useState<IPlayer | null>(null);

  const updatePlayerData = async (updates: Partial<IPlayer>) => {
    if (!app.currentUser?.id) {
      console.error("No current user found");
      return;
    }

    try {
      const updatedPlayer = applyPlayerUpdates(player, updates);
      await mongodbPlayerCollection?.updateOne({ _id: app.currentUser.id }, { $set: updates });
      setPlayer(updatedPlayer);

      // Handle side effects after updates
      if (updatedPlayer.level === 3 && updatedPlayer.quests.storyStep === 0) {
        showStoryModal({ storyStep: 0, player: updatedPlayer, updatePlayerData });
      }
    } catch (err) {
      console.error("Failed to update player data:", err);
    }
  };


  useEffect(() => {
    const fetchPlayer = async () => {
      if (!app.currentUser?.id) {
        console.error("No current user found");
        return;
      }
      try {
        const playerResult = await mongodbPlayerCollection?.findOne({ _id: app.currentUser.id });
        if (playerResult) {
          setPlayer(playerResult);
        } else {
          console.error("No player data found for current user");
        }
      } catch (err) {
        console.error("Failed to fetch player data:", err);
      }
    };

    fetchPlayer();
  }, []);

  return (
    <PlayerContext.Provider value={{ player, updatePlayerData }}>
      {children}
    </PlayerContext.Provider>
  );
};

function applyPlayerUpdates(player: IPlayer | null, updates: Partial<IPlayer>): IPlayer {
  if (!player) return { ...updates } as any;

  const xpToNextLevel = GetXpForNextLevel({ level: player.level });
  if (xpToNextLevel <= player.experience) {
    updates.level = player.level + 1;
    updates.experience = 0; // reset experience
    updates.attributePoints = (player.attributePoints ?? 0) + 5; // add attribute points
  }

  return { ...player, ...updates };
}

export const usePlayerData = () => useContext(PlayerContext);
