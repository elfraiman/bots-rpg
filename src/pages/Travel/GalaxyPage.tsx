import { IonButton, IonCardSubtitle, IonCol, IonContent, IonGrid, IonImg, IonList, IonPage, IonRow } from "@ionic/react";
import Header from "../../components/Header";
import usePlanetsHook from "../../hooks/UsePlanetsHook";
import GetItemGradeColor from "../../functions/GetItemGradeColor";
import { PlayerContext } from "../../context/PlayerContext";
import { useContext, useState } from "react";
import { ITravelDestinations, getTravel } from "../../functions/GetTravel";
import SplashScreen from "../SplashScreen/SplashScreen";






const GalaxyPage = () => {
  const planets = usePlanetsHook();
  const { player, updatePlayerData } = useContext(PlayerContext)
  const [travelTimer, setTravelTimer] = useState(false);

  if (!player) {
    return;
  };

  const travelToPlanet = async (destination: ITravelDestinations) => {
    setTravelTimer(true);
    setTimeout(() => {
      setTravelTimer(false);
    }, 5000)
    try {
      await getTravel({ destination, player, updatePlayerData });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>

      <IonPage id="main-content" className="content">
        {travelTimer ? (
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