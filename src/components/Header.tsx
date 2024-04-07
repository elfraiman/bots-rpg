import { IonCardSubtitle, IonCol, IonGrid, IonHeader, IonProgressBar, IonRow, IonSpinner, IonText, IonToolbar } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { getSinglePlanet } from "../functions/GetPlanet";
import GetXpForNextLevel from "../functions/GetXpForNextLevel";
import { IPlanet } from "../types/types";
import './Header.css';





const Header = () => {
    const [playerXpBar, setPlayerXpBar] = useState(0);
    const [xpToNextLevel, setXpToNextLevel] = useState(0);
    const [loading, setLoading] = useState(false);
    const { player } = useContext(PlayerContext);
    const [playerLocation, setPlayerLocation] = useState<IPlanet>();


    // This gets the planet the player is on to render a background on the header
    //
    const getPlayerPlanet = async () => {
        if (!player) {
            return;
        }
        // if player is in the same location no need to get planet
        //
        if (player?.location.toString() === playerLocation?._id.toString()) return;

        console.log(player.location, playerLocation, 'player location')

        setLoading(true);
        const playerLocationPlanet = await getSinglePlanet(player.location)
        if (playerLocationPlanet !== undefined) setPlayerLocation(playerLocationPlanet)
        setLoading(false);
    }

    const handlePlayerXP = () => {
        setLoading(true);
        if (player) {
            const playerXp = player.experience;
            const xpNeededForNextLevel = GetXpForNextLevel({ level: player.level });

            // Calculate the progress towards the next level
            //
            let progress = playerXp / xpNeededForNextLevel;

            // Ensure progress is between 0.1 and 1 for the loading bar
            //
            progress = Math.max(0.0, Math.min(progress, 1));

            setXpToNextLevel(xpNeededForNextLevel);
            setPlayerXpBar(progress);
            setLoading(false);
        }
    }


    useEffect(() => {
        handlePlayerXP();
        getPlayerPlanet();
    }, [player])

    return (
        <IonHeader>
            {!loading && player && playerLocation ? (
                <IonToolbar style={{
                    '--background': `url('/images/planets/planet-ground-${playerLocation?.imgId}.webp') 0 0/cover no-repeat`,
                    position: 'relative' // Ensure the toolbar can contain the absolutely positioned overlay
                }}>
                    {/* Overlay div */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as needed
                        zIndex: 1 // Ensure it sits above the background but below the content
                    }}></div>

                    {/* Ensuring content sits above the overlay */}
                    <div style={{ position: 'relative', zIndex: 2 }}>
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
                                    <IonCardSubtitle>XP: {player?.experience.toLocaleString()} / {xpToNextLevel.toLocaleString()}  ({Math.round(((player?.experience ?? 0) / xpToNextLevel) * 100)}%)</IonCardSubtitle>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                        <IonProgressBar value={playerXpBar}></IonProgressBar>
                    </div>
                </IonToolbar>
            ) : <IonSpinner />}

        </IonHeader>
    )
}

export default Header;