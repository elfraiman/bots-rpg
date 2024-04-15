import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonImg, IonItem, IonList, IonPage, IonRow, useIonViewDidEnter, useIonViewWillEnter } from "@ionic/react";
import { useEffect, useState } from "react";
import * as Realm from 'realm-web';
import { useNavigationDisable } from "../../context/DisableNavigationContext";
import { usePlayerData } from "../../context/PlayerContext";
import { getPlanets } from "../../functions/GetPlanets";
import { getTravel } from "../../functions/GetTravel";
import { showStoryModal } from "../../functions/ShowStoryModal";
import { IPlanet } from "../../types/types";
import SplashScreen from "../SplashScreen/SplashScreen";
import './GalaxyPage.css';
import NpcCard from "../../components/NpcCard";
import { getSinglePlanet } from "../../functions/GetPlanet";


const GalaxyPage = () => {
  const [planets, setPlanets] = useState<IPlanet[]>([]);
  const { player, updatePlayerData } = usePlayerData();
  const { isNavigationDisabled, triggerDisableWithTimer } = useNavigationDisable();


  const travelToPlanet = async (destination: Realm.BSON.ObjectId) => {
    if (!player) return;
    try {
      await getTravel({ destination, player, updatePlayerData });
      triggerDisableWithTimer(5000);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPlanets = async () => {
    try {
      const planetsFetched = await getPlanets();
      if (planetsFetched) {
        console.log('Planets fetched', planetsFetched, player?.unlockedLocations)
        const playerUnlockedPlanets = player?.unlockedLocations.map((planet) => planet.toString());

        if (playerUnlockedPlanets) {
          const unlockedPlanets = planetsFetched.filter((planet) => playerUnlockedPlanets.includes(planet._id.toString()));
          setPlanets(unlockedPlanets);
        }


      }
    } catch (e) {
      console.error(e);
    }
  }

  useIonViewWillEnter(() => {
    fetchPlanets();
  })

  const getPlanet = async (name: string) => {
    const planet = await getSinglePlanet(undefined, name);
    return planet;
  }

  useIonViewDidEnter(() => {
    // Fetch the latest planet info and update player data accordingly
    const unlockNewPlanet = async () => {
      if (player?.quests.storyStep === 4) {
        const planet = await getPlanet('Xyleria');
        if (!planet) return;

        showStoryModal({ storyStep: 4, player, updatePlayerData });
        updatePlayerData({
          ...player,
          unlockedLocations: [...player.unlockedLocations, planet._id]
        });
      }
    };

    unlockNewPlanet();
  }, [player, updatePlayerData]); // Include all functions and state variables the effect uses




  return (
    <IonPage className="content">
      {isNavigationDisabled ? (
        <SplashScreen />
      ) : (
        <>
          <IonContent className="ion-padding">
            <div className='bg-video'>
              <video playsInline autoPlay muted preload="auto" loop className="video" src="/videos/galaxy.mp4"> </video>
            </div>

            <NpcCard
              npcImgId={1}
              npcName="Aurora Nova"
              npcRole="Pilot"
              npcText="Just let me know where we are headed and I'll make sure we get there."
            />


            <div className="ion-padding low-fade corner-border" style={{ marginTop: 16 }}>
              <h2 style={{ marginTop: 0 }}>Galaxy</h2>
              <p>Here's a list of planets we know and can land on.</p>
            </div>

            <div className="card-fade">
              <h5 style={{ margin: 0, marginTop: 16 }} className="ion-padding">Planets</h5>
            </div>

            {planets?.map((planet, index) => {
              return (
                <div key={index}
                  style={{
                    borderTop: '1px solid rgba(235, 235, 235, 0.11)',
                    borderBottom: '1px solid rgba(235, 235, 235, 0.11)',
                    zIndex: 20,
                  }}
                  className="card-fade">

                  <IonGrid style={{ width: '100%', padding: 0 }} >
                    <IonRow style={{ width: '100%' }} >
                      {/* Image Column */}
                      <IonCol size="3" style={{ padding: 0 }}>
                        <IonImg
                          style={{ width: '100%', height: 'auto' }}
                          src={`/images/planets/planet-space-${planet.imgId}.webp`}
                          alt={`Planet`} />
                      </IonCol>

                      {/* Gold Column */}
                      <IonCol size="4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: '14px' }} className="ion-padding">
                          {planet.name}
                        </div>

                        <span>
                          <IonButton fill="clear" className="corner-border" onClick={() => travelToPlanet(planet._id)}>Travel</IonButton>
                        </span>


                      </IonCol>

                      {/* Requirements Column */}
                      <IonCol size="5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }} className="ion-padding">
                        <div style={{ fontSize: '14px', color: 'white' }}>
                          Some more information
                        </div>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </div>
              )
            })}
          </IonContent>
        </>
      )}

    </IonPage>
  );
}


export default GalaxyPage;