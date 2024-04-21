import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { DisableNavigationProvider } from './context/DisableNavigationContext';
import { PlayerProvider } from './context/PlayerContext';
import { BattleProvider } from './context/BattleContext';


const container = document.getElementById('root');
const root = createRoot(container!);


root.render(
  <React.StrictMode>
    <PlayerProvider>
      <BattleProvider>
        <DisableNavigationProvider>
          <App />
        </DisableNavigationProvider>
      </BattleProvider>
    </PlayerProvider>
  </React.StrictMode>
);