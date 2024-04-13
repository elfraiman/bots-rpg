import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonImg, IonList, IonPage, IonRow } from "@ionic/react";
import { useContext } from "react";
import * as Realm from 'realm-web';
import { useNavigationDisable } from "../../context/DisableNavigationContext";
import { PlayerContext } from "../../context/PlayerContext";
import { getTravel } from "../../functions/GetTravel";
import usePlanetsHook from "../../hooks/UsePlanetsHook";
import SplashScreen from "../SplashScreen/SplashScreen";
import './GalaxyPage.css';


const GalaxyPage = () => {
  const planets = usePlanetsHook();
  const { player, updatePlayerData } = useContext(PlayerContext)
  const { isNavigationDisabled, triggerDisableWithTimer } = useNavigationDisable();

  if (!player) {
    return;
  };

  const travelToPlanet = async (destination: Realm.BSON.ObjectId) => {
    try {
      await getTravel({ destination, player, updatePlayerData });
      triggerDisableWithTimer(5000);
    } catch (e) {
      console.error(e);
    }
  };

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

                <IonCard style={{ padding: 0, margin: 0 }} className="corner-border" >
                  <img alt={`Alex the shop attendant`} src={`/images/npc/npc-ship-1.webp`} />
                  <IonCardHeader>
                    <IonCardTitle style={{ display: 'flex', justifyContent: 'space-between' }}>Aurora Nova</IonCardTitle>
                    <IonCardSubtitle>Pilot</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent className="ion-padding">
                    <p>Just let me know where we are headed and I'll make sure we get there.</p>
                  </IonCardContent>
                </IonCard>

                <div className="ion-padding low-fade" style={{ marginTop: 16 }}>
                  <h2><strong>Travel</strong></h2>
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