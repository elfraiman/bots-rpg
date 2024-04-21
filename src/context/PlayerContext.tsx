import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import * as Realm from 'realm-web';
import GetXpForNextLevel from '../functions/GetXpForNextLevel';
import { IPlayer, IPlayer_quests } from '../types/types';
import { showStoryModal } from '../functions/ShowStoryModal';
import toast from 'react-hot-toast';

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
    if (!app.currentUser?.id || !mongodbPlayerCollection) {
      console.error("No current user found");
      return;
    }

    try {
      const updatedPlayer = applyPlayerUpdates(player, updates);
      await mongodbPlayerCollection.updateOne({ _id: app.currentUser.id }, { $set: updates });
      setPlayer(updatedPlayer);


    } catch (err: any) {
      toast.error(`Failed to update player data`,
        {
          duration: 5000,
          style: {
            background: 'black',
            color: '#fff',
          },
        },
      );
      console.error("Failed to update player data:", err);
      throw err;
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
          app.currentUser?.logOut();
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


    // Handle side effects after updates
    // Initial story about the shop from Mia
    if (updates.level === 3) {
      showStoryModal({ storyStep: 0 });
      player.quests.storyStep = 1;
    }
    // Pilot story with Aurora
    if (updates.level === 5) {
      showStoryModal({ storyStep: 2 });
      player.quests.storyStep = 3;
    }
    // First planet Xyleria with Mia
    //
    if (updates.level === 10) {
      showStoryModal({ storyStep: 3 });
      player.quests.storyStep = 4;
    }
  }

  return { ...player, ...updates };
}

export const usePlayerProvider = () => useContext(PlayerContext);
