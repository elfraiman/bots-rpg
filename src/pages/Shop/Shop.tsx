import { IonAccordion, IonAccordionGroup, IonCard, IonCardContent, IonContent, IonItem, IonLabel, IonList, IonPage, IonSpinner, IonText } from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import Header from '../../components/Header';
import WeaponCard from '../../components/WeaponCard';
import { PlayerContext } from '../../context/PlayerContext';
import getShopWeapons from '../../functions/GetShopWeapons';
import { IShopWeapon, IWeapon } from '../../types/types';
import './Shop.css';


const Shop = () => {
  const { player } = useContext(PlayerContext);
  const [weaponsData, setWeaponsData] = useState<IShopWeapon[]>([]);
  const [loading, setLoading] = useState(false);

  const getWeaponsData = async () => {
    setLoading(true);
    const weaponsForShop = await getShopWeapons();


    if (weaponsForShop) {
      setWeaponsData(weaponsForShop);
      setLoading(false);
    }
  }

  useEffect(() => {
    getWeaponsData()
  }, []);



  return (
    <React.Fragment>
      {player && !loading ? (
        <IonPage id="main-content" className="content">
          <Header />
          {player ? (
            <IonContent className="ion-padding shop-bg">
              <IonText>
                <div className="text-overlay">
                  <h2><strong>The shop</strong></h2>
                  <p>
                    Welcome to the training room. Here you can practice your skills and level up your bot.
                  </p>
                </div>
              </IonText>

              <IonCard className="card-fade">
                <IonCardContent>
                  {weaponsData && player ? (
                    <IonAccordionGroup>

                      <IonAccordion value="first">
                        <IonItem slot="header" color="light">
                          <IonLabel>Weapons</IonLabel>
                        </IonItem>
                        <div slot="content">
                          <IonList lines='full'>
                            {weaponsData.map((weapon: IWeapon, index: number) => { // Add type annotations for weapon and index
                              return (
                                <WeaponCard weapon={weapon} initialPlayer={player} key={index} isForSale={true} />
                              );
                            })}
                          </IonList>
                        </div>
                      </IonAccordion>
                      <IonAccordion value="second">
                        <IonItem slot="header" color="light">
                          <IonLabel>Armor</IonLabel>
                        </IonItem>
                        <div className="ion-padding" slot="content">
                          Second Content
                        </div>
                      </IonAccordion>
                      <IonAccordion value="third">
                        <IonItem slot="header" color="light">
                          <IonLabel>Boots</IonLabel>
                        </IonItem>
                        <div className="ion-padding" slot="content">
                          Third Content
                        </div>
                      </IonAccordion>
                      <IonAccordion value="fourth">
                        <IonItem slot="header" color="light">
                          <IonLabel>Gloves</IonLabel>
                        </IonItem>
                        <div className="ion-padding" slot="content">
                          Third Content
                        </div>
                      </IonAccordion>
                      <IonAccordion value="fifth">
                        <IonItem slot="header" color="light">
                          <IonLabel>Helmets</IonLabel>
                        </IonItem>
                        <div className="ion-padding" slot="content">
                          Third Content
                        </div>
                      </IonAccordion>
                    </IonAccordionGroup>
                  ) : <IonSpinner />}
                </IonCardContent>
              </IonCard>


            </IonContent>
          ) : <IonSpinner />}

        </IonPage>
      ) : <IonSpinner />}

    </React.Fragment>
  )
}

export default Shop;