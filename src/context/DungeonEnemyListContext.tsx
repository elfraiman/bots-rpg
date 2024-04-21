
import React, { ReactNode, createContext, useContext, useState } from 'react';
import { IEnemy } from '../types/types';

// Define the shape of the context
interface IDungeonEnemyListContextValue {
  enemyList: IEnemy[];
  removeEnemy: (enemy: IEnemy) => void;
  addEnemy: (enemy: IEnemy) => void;
  setEnemyList: React.Dispatch<React.SetStateAction<IEnemy[]>>;
  // Add any function to change this state if needed
}

const defaultContext: IDungeonEnemyListContextValue = {
  enemyList: [],
  removeEnemy: (enemy: IEnemy) => { },
  addEnemy: (enemy: IEnemy) => { },
  setEnemyList: () => []
}

// Create the context
export const DungeonEnemyListContext = createContext<IDungeonEnemyListContextValue>(defaultContext);

// Create a provider component
export const DungeonEnemyListProvider = ({ children }: { children: ReactNode }) => {
  const [enemyList, setEnemyList] = useState<IEnemy[]>([]);


  const removeEnemy = (enemy: IEnemy) => {

  }

  const addEnemy = (enemy: IEnemy) => {

  }

  return (
    <DungeonEnemyListContext.Provider value={{ enemyList, removeEnemy, addEnemy, setEnemyList }}>
      {children}
    </DungeonEnemyListContext.Provider>
  );
};

// Custom hook to use the splash screen context
export const useDungeonEnemyListProvider = () => {
  const context = useContext(DungeonEnemyListContext);
  if (context === undefined) {
    throw new Error('useSplashScreen must be used within a SplashScreenProvider');
  }
  return context;
};
