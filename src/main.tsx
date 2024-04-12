import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { DisableNavigationProvider } from './context/DisableNavigationContext';
import { PlayerProvider } from './context/PlayerContext';


const container = document.getElementById('root');
const root = createRoot(container!);


root.render(
  <React.StrictMode>
    <PlayerProvider>
      <DisableNavigationProvider>
        <App />
      </DisableNavigationProvider>
    </PlayerProvider>
  </React.StrictMode>
);