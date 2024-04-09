import { IonAvatar, IonContent, IonIcon, IonItem, IonLabel, IonList, IonPage, IonSegment, IonSegmentButton, IonSpinner, IonText } from "@ionic/react"
import Header from "../../components/Header"
import { useEffect, useState } from "react";
import GetPlayers from "../../functions/GetPlayers";
import { IPlayer } from "../../types/types";
import { trophyOutline } from "ionicons/icons";



const LeaderboardPage = () => {
  const [whatToShow, setWhatToShow] = useState('players');
  const [playersData, setPlayersData] = useState<IPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  const getAllPlayers = async () => {
    setLoading(true);
    const playersFetched = await GetPlayers();

    if (playersFetched) {
      // sort based on level
      //
      setPlayersData(playersFetched.sort((a, b) => a.level - b.level).reverse());
    }
    setLoading(false);
  }

  useEffect(() => {
    getAllPlayers();
  }, [])

  const getTrophyColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'gold';
      case 2:
        return 'silver';
      case 3:
        return 'brown';
      default:
        return undefined; // No trophy for ranks other than 1, 2, or 3
    }
  };


  return (
    <IonPage>
      <Header />
      <IonContent className="galaxy-bg">
        <IonSegment
          className="card-fade"
          value={whatToShow}
          onIonChange={(e: CustomEvent) => setWhatToShow(e.detail.value)}
        >
          <IonSegmentButton value="players">
            <IonLabel>Players</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="factions">
            <IonLabel>Factions</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {loading ? (<IonSpinner />) : (
          <>
            {whatToShow === 'players' && (
              <IonList >
                {playersData.map((player, index) => (
                  <IonItem key={player._id}  >

                    <IonAvatar slot="start">
                      <img src={`images/player-placeholder.webp`} alt={`${player.name}`} />
                    </IonAvatar>

                    <IonLabel>

                      <h2>
                        <span style={{ marginRight: 6 }}>{index + 1}.</span>
                        {index < 3 && (
                          <IonIcon
                            icon={trophyOutline}
                            style={{ color: getTrophyColor(index + 1), marginRight: 6 }}
                          />
                        )} {player.name}</h2>
                      <p>Level: {player.level}</p>
                    </IonLabel>
                    <IonText slot="end">
                      {player?.faction?.toString() ?? "No Faction"}
                    </IonText>
                  </IonItem>
                ))}
              </IonList>
            )}

            {whatToShow === 'factions' && (
              <div>
                Not yet available
              </div>
            )}
          </>
        )}

      </IonContent>
    </IonPage>
  )
}

export default LeaderboardPage