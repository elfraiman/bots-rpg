import { IonButton, IonCol, IonContent, IonGrid, IonImg, IonList, IonPage, IonRow } from "@ionic/react";
import { useContext } from "react";
import * as Realm from 'realm-web';
import Header from "../../components/Header";
import { PlayerContext } from "../../context/PlayerContext";
import { useSplashScreen } from "../../context/SplashScreenContxt";
import { getTravel } from "../../functions/GetTravel";
import usePlanetsHook from "../../hooks/UsePlanetsHook";
import SplashScreen from "../SplashScreen/SplashScreen";
import './GalaxyPage.css'


const GalaxyPage = () => {
  const planets = usePlanetsHook();
  const { player, updatePlayerData } = useContext(PlayerContext)
  const { isSplashScreenActive, triggerSplashScreen } = useSplashScreen();

  if (!player) {
    return;
  };

  const travelToPlanet = async (destination: Realm.BSON.ObjectId) => {
    try {
      await getTravel({ destination, player, updatePlayerData });
      triggerSplashScreen(5000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <IonPage id="main-content" className="content">
        {isSplashScreenActive ? (
          <SplashScreen />
        ) : (
          <>
            <Header />
            <IonContent >
              <div className='bg-video'>
                <video playsInline autoPlay muted preload="auto" loop className="video" src="/videos/guardian-swirl-video.mp4"> </video>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as needed
                  zIndex: 0, // Ensure it sits above the background but below the content
                  height: '100vh'
                }}></div>
              </div>

              <IonList className="card-fade" style={{ zIndex: 5 }}>
                {planets?.map((planet, index) => {
                  return (
                    <div key={index} style={{ padding: 6, borderTop: '1px solid rgba(235, 235, 235, 0.11)', borderBottom: '1px solid rgba(235, 235, 235, 0.11)' }}>
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
                              <IonButton fill="clear" onClick={() => travelToPlanet(planet._id)}>Travel</IonButton>
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