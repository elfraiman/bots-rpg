import {
  IonAvatar,
  IonButton,
  IonCardSubtitle,
  IonCol,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  useIonViewWillEnter
} from '@ionic/react';
import Header from '../../components/Header';
import getPlayers from '../../functions/GetPlayers';
import { useEffect, useState } from 'react';
import { IPlayer } from '../../types/types';
import { trophyOutline } from 'ionicons/icons';
import NpcCard from '../../components/NpcCard';


const FightPvpPage: React.FC = () => {
  const [playersData, setPlayersData] = useState<IPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPlayers();
  }, [])
  const getAllPlayers = async () => {
    setLoading(true);
    const playersFetched = await getPlayers();

    if (playersFetched) {
      // sort based on level
      //
      setPlayersData(playersFetched.sort((a, b) => a.level - b.level).reverse());
    }
    setLoading(false);
  }


  useIonViewWillEnter(() => {
    console.log("Welcome to the training room")
  });


  return (
    <>
      <IonPage className="content" >
        <IonContent className="ion-padding">

          <NpcCard
            npcImgId={6}
            npcName="Kelly Anon"
            npcRole="Killer"
            npcText="This is no place for a newbie, are you sure you're ready for this?"
          />



          Currently not implemented


          <IonList>
            {playersData.map((player) => (
              <IonItem key={player._id}  >

                <IonAvatar slot="start">
                  <img src={`images/player-placeholder.webp`} alt={`${player.name}`} />
                </IonAvatar>

                <IonLabel>
                  <h2>{player.name}</h2>
                  <IonCardSubtitle>[NoFaction]</IonCardSubtitle>
                  <p>Level: {player.level}</p>
                </IonLabel>

                <IonCol>
                  Win: 0 Lose: 0
                </IonCol>

                <IonButton fill="clear" className="corner-border">Fight</IonButton>

              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonPage>
    </>
  );
};


export default FightPvpPage;