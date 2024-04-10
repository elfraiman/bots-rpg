import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SplashScreenProvider } from './context/SplashScreenContxt';
import { PlayerProvider } from './context/PlayerContext';


const container = document.getElementById('root');
const root = createRoot(container!);


root.render(
  <React.StrictMode>
    <PlayerProvider>
      <SplashScreenProvider>
        <App />
      </SplashScreenProvider>
    </PlayerProvider>
  </React.StrictMode>
);