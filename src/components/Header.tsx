import {
  IonCardSubtitle,
  IonCol,
  IonGrid,
  IonHeader,
  IonProgressBar,
  IonRow,
  IonText,
  IonToolbar
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { getSinglePlanet } from "../functions/GetPlanet";
import GetXpForNextLevel from "../functions/GetXpForNextLevel";
import { IPlanet, IPlayer } from "../types/types";
import './Header.css';

const usePlayerXP = (player: IPlayer) => {
  const [playerXpBar, setPlayerXpBar] = useState(0);
  const [xpToNextLevel, setXpToNextLevel] = useState(0);

  useEffect(() => {
    if (!player) return;
    const xpNeededForNextLevel = GetXpForNextLevel({ level: player.level });
    const progress = Math.max(0.0, Math.min(player.experience / xpNeededForNextLevel, 1));
    setXpToNextLevel(xpNeededForNextLevel);
    setPlayerXpBar(progress);
  }, [player?.level, player?.experience]);

  return { playerXpBar, xpToNextLevel };
};

const usePlayerLocation = (player: IPlayer) => {
  const [playerLocation, setPlayerLocation] = useState<IPlanet>();

  useEffect(() => {
    if (!player) return;

    const fetchPlayerLocation = async () => {
      if (player?.location.toString() === playerLocation?._id?.toString()) return;
      const playerLocationPlanet = await getSinglePlanet(player.location);
      if (playerLocationPlanet) {
        setPlayerLocation(playerLocationPlanet);
      }
    };

    fetchPlayerLocation();
  }, [player?.location]);

  return playerLocation;
};

const Header = () => {
  const { player } = useContext(PlayerContext);
  const { playerXpBar, xpToNextLevel } = usePlayerXP(player as IPlayer);
  const playerLocation = usePlayerLocation(player as IPlayer);

  return (
    <IonHeader style={{ borderBottom: '2px solid black', minHeight: 100 }} className="fade-in">
      <IonToolbar style={{
        '--background': `url('/images/planets/planet-ground-${playerLocation?.imgId}.webp') 0 0/cover no-repeat`,
        position: 'relative'
      }}>
        <div className="header-overlay"></div>
        <div className="header-content">
          {player && playerLocation ? (
            <>
              <IonGrid>
                <IonRow>
                  <IonCol size="9">
                    <IonText className="player-name">{player.name}</IonText>
                    <IonCardSubtitle>[NoFaction]</IonCardSubtitle>
                    <IonText>Level: {player.level}</IonText>
                  </IonCol>

                  <IonCol size="3" className="gold-col">
                    <IonText><span>{player.gold.toLocaleString()}</span>🪙</IonText>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonCardSubtitle>XP: {player.experience.toLocaleString()} / {xpToNextLevel.toLocaleString()}  ({Math.round(playerXpBar * 100)}%)</IonCardSubtitle>
                  </IonCol>
                  <IonCardSubtitle className="alpha-version">Alpha {import.meta.env.VITE_REACT_APP_VERSION}</IonCardSubtitle>
                </IonRow>
              </IonGrid>
              <IonProgressBar value={playerXpBar} />
            </>
          ) : <></>}
        </div>
      </IonToolbar>
    </IonHeader>
  )
}

export default Header;
