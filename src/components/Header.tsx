import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonText, IonGrid, IonRow, IonCol, IonProgressBar, IonCardSubtitle } from "@ionic/react"
import { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import getXpForNextLevel from "../functions/GetXpForNextLevel";
import './Header.css';



interface IHeaderProps {
    title: string;
}


const Header = ({ title }: IHeaderProps) => {
    const [playerXpBar, setPlayerXpBar] = useState(0);
    const [xpToNextLevel, setXpToNextLevel] = useState(0);
    const { player } = useContext(PlayerContext);


    useEffect(() => {
        if (player) {
            const playerXp = player.experience;
            const xpNeededForNextLevel = getXpForNextLevel({ level: player.level });

            // Calculate the progress towards the next level
            let progress = playerXp / xpNeededForNextLevel;

            // Ensure progress is between 0.1 and 1
            progress = Math.max(0.0, Math.min(progress, 1));

            setXpToNextLevel(xpNeededForNextLevel);
            setPlayerXpBar(progress);
        }

    }, [player])

    return (
        <IonHeader>
            <IonToolbar>
                <IonGrid>
                    <IonRow>
                        <IonCol size="9">
                            <IonText style={{ display: 'block', marginBottom: '0', fontSize: 14 }}>{player?.name}</IonText>
                            <IonCardSubtitle style={{ display: 'block', marginBottom: '0', fontSize: 11 }}>[NoClan]</IonCardSubtitle>
                            <IonText style={{ display: 'block', marginBottom: '0', fontSize: 14 }}>Level: {player?.level}</IonText>
                        </IonCol>
                        <IonCol size="3" style={{ textAlign: 'right', fontSize: 13 }}>
                            <IonText>Gold: <span style={{ color: 'gold' }}>{player?.gold.toLocaleString()}</span></IonText>
                        </IonCol>
                    </IonRow>

                    <IonRow>
                        <IonCol>
                            <IonCardSubtitle>XP: {player?.experience.toLocaleString()} / {xpToNextLevel.toLocaleString()}  ({Math.round(player?.experience ?? 0 / xpToNextLevel * 100)}%)</IonCardSubtitle>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonProgressBar value={playerXpBar} ></IonProgressBar>
            </IonToolbar>
        </IonHeader>

    )
}

export default Header;