import { IonCardSubtitle, IonCol, IonContent, IonGrid, IonImg, IonList, IonPage, IonRow } from "@ionic/react";
import Header from "../../components/Header";
import usePlanetsHook from "../../hooks/UsePlanetsHook";
import getWeaponColor from "../../functions/GetWeaponColor";






const GalaxyPage = () => {
  const planets = usePlanetsHook();

  return (
    <>
      <IonPage id="main-content" className="content">
        <Header title="Travel" />
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
                          src={`/resources/images/planets/planet-space-${planet.imgId}.webp`}
                          alt={`Planet`} />
                      </IonCol>

                      {/* Gold Column */}
                      <IonCol size="4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: '14px', marginBottom: 6 }}>
                          {planet.name}
                        </div>

                        <span style={{}}>
                          Information
                        </span>


                      </IonCol>

                      {/* Requirements Column */}
                      <IonCol size="5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div style={{ fontSize: '14px', color: 'white' }}>
                          {planet.description}
                        </div>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </div>
              )
            })}
          </IonList>
        </IonContent>
      </IonPage>
    </>
  );
}


export default GalaxyPage;