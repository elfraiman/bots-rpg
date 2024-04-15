import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonImg, IonItem, IonList, IonPage, IonRow, useIonViewWillEnter } from "@ionic/react";
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
        setPlanets(planetsFetched);
      }
    } catch (e) {
      console.error(e);
    }
  }

  useIonViewWillEnter(() => {
    fetchPlanets();
  })

  useEffect(() => {
    // Handle if player is on story step 1
    //
    if (player && player.quests.storyStep === 1) {
      showStoryModal({ storyStep: 1, player, updatePlayerData });
    }
  }, [player?.quests.storyStep])



  return (
    <>
      <IonPage className="content">
        {isNavigationDisabled ? (
          <SplashScreen />
        ) : (
          <>
            <IonContent >
              <div className='bg-video'>
                <video playsInline autoPlay muted preload="auto" loop className="video" src="/videos/galaxy.mp4"> </video>
              </div>
              <IonList className="low-fade ion-padding" style={{ zIndex: 5 }}>
                <NpcCard
                  npcImgId={1}
                  npcName="Aurora Nova"
                  npcRole="Pilot"
                  npcText="Just let me know where we are headed and I'll make sure we get there."
                />

                <div className="ion-padding low-fade" style={{ marginTop: 16 }}>
                  <h2 style={{ marginTop: 0 }}>Travel</h2>
                  <p>Here's a list of planets you've located.</p>
                </div>

                {planets?.map((planet, index) => {
                  return (
                    <div key={index}
                      style={{ padding: 6, borderTop: '1px solid rgba(235, 235, 235, 0.11)', borderBottom: '1px solid rgba(235, 235, 235, 0.11)' }}
                      className="low-fade">
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
              </IonList>
            </IonContent>
          </>

        )}

      </IonPage>
    </>
  );
}


export default GalaxyPage;