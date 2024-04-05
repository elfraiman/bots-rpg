import { IonButton, IonCol, IonContent, IonGrid, IonImg, IonList, IonPage, IonRow } from "@ionic/react";
import { useContext } from "react";
import Header from "../../components/Header";
import { PlayerContext } from "../../context/PlayerContext";
import { useSplashScreen } from "../../context/SplashScreenContxt";
import { ITravelDestinations, getTravel } from "../../functions/GetTravel";
import usePlanetsHook from "../../hooks/UsePlanetsHook";
import SplashScreen from "../SplashScreen/SplashScreen";



const GalaxyPage = () => {
  const planets = usePlanetsHook();
  const { player, updatePlayerData } = useContext(PlayerContext)
  const { isSplashScreenActive, triggerSplashScreen } = useSplashScreen();

  if (!player) {
    return;
  };

  const travelToPlanet = async (destination: ITravelDestinations) => {
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
            <IonContent>
              <IonList>
                {planets?.map((planet, index) => {
                  return (
                    <div key={index} style={{ padding: 6, borderTop: '1px solid rgba(235, 235, 235, 0.11)', borderBottom: '1px solid rgba(235, 235, 235, 0.11)' }}>
                      <IonGrid style={{ width: '100%', padding: 0 }}>
                        <IonRow style={{ width: '100%' }}>
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
                              <IonButton fill="clear" onClick={() => travelToPlanet(planet.name as ITravelDestinations)}>Travel</IonButton>
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