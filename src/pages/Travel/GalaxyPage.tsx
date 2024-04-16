import { IonButton, IonCol, IonContent, IonGrid, IonImg, IonPage, IonRow, useIonViewDidEnter, useIonViewWillEnter } from "@ionic/react";
import { useState } from "react";
import * as Realm from 'realm-web';
import NpcCard from "../../components/NpcCard";
import { useNavigationDisable } from "../../context/DisableNavigationContext";
import { usePlayerData } from "../../context/PlayerContext";
import { getSinglePlanet } from "../../functions/GetPlanet";
import { getPlanets } from "../../functions/GetPlanets";
import { getTravel } from "../../functions/GetTravel";
import { showStoryModal } from "../../functions/ShowStoryModal";
import { IPlanet } from "../../types/types";
import SplashScreen from "../SplashScreen/SplashScreen";
import './GalaxyPage.css';


const GalaxyPage = () => {
  const [planets, setPlanets] = useState<IPlanet[]>([]);
  const { player, updatePlayerData } = usePlayerData();
  const { isNavigationDisabled, triggerDisableWithTimer } = useNavigationDisable();


  const travelToPlanet = async (planet: IPlanet) => {
    if (!player) return;
    try {
      await getTravel({ destination: planet._id, player, updatePlayerData });


      localStorage.setItem('shownSplash', 'false');

      // Change the ion primary color to the planet's
      // hex code to make the player feel more
      // as if hes on a different planet
      //
      const htmlEl = document.querySelector('html');
      htmlEl?.style.setProperty('--ion-color-primary', planet.hexColor ?? "#f7ae5b");
      triggerDisableWithTimer(5000);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPlanets = async () => {
    try {
      const planetsFetched = await getPlanets();
      if (planetsFetched) {
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

  const getPlanet = async (name: string) => {
    const planet = await getSinglePlanet(undefined, name);
    return planet;
  }

  const unlockNewPlanet = async (planetName: string) => {
    if (!player) {
      console.error("[GalaxyPage]: No player to unlock planet for")
      return;
    }

    const planet = await getPlanet(planetName);
    if (!planet) {
      console.error("[GalaxyPage]: No planet to return")
      return;
    };

    updatePlayerData({
      unlockedLocations: [...player.unlockedLocations, planet._id]
    });
  };

  useIonViewWillEnter(() => {
    fetchPlanets();
  })


  useIonViewDidEnter(() => {
    if (player?.quests.storyStep === 4) {
      // First planet Xyleria with Aurora
      //
      showStoryModal({ storyStep: 4 });
      updatePlayerData({ quests: { ...player.quests, storyStep: 5 } })
      unlockNewPlanet('Xyleria');
    }

  }, [player?.quests.storyStep, updatePlayerData]); // Include all functions and state variables the effect uses




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
              <h2 style={{ marginTop: 0 }}>Galaxy panel</h2>
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
                          <IonButton fill="clear" className="corner-border" onClick={() => travelToPlanet(planet)}>Travel</IonButton>
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