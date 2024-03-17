import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IPlayer } from '../types/schemas';

interface IPlayerContext {
  player: IPlayer | null;
  setPlayer: (player: IPlayer | null) => void;
}

const defaultState: IPlayerContext = {
  player: null,
  setPlayer: () => {},
};

export const PlayerContext = createContext<IPlayerContext>(defaultState);


export const usePlayer = () => useContext(PlayerContext);


export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [player, setPlayer] = useState<IPlayer | null>(null);



  return (
    <PlayerContext.Provider value={{ player, setPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};
