import { IonAccordion, IonAccordionGroup, IonCard, IonCardContent, IonContent, IonItem, IonLabel, IonList, IonPage, IonSpinner, IonText } from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import ArmorCard from '../../components/ArmorCard';
import Header from '../../components/Header';
import HelmetCard from '../../components/HelmetCard';
import WeaponCard from '../../components/WeaponCard';
import { PlayerContext } from '../../context/PlayerContext';
import getShopArmors from '../../functions/GetShopArmors';
import getShopHelmets from '../../functions/GetShopHelmets';
import getShopWeapons from '../../functions/GetShopWeapons';
import { IBoots, IHelmet, IShopArmor, IShopBoots, IShopHelmet, IShopWeapon } from '../../types/types';
import './Shop.css';
import getShopBoots from '../../functions/GetShopBoots';
import BootsCard from '../../components/BootsCard';


const Shop = () => {
  const { player } = useContext(PlayerContext);
  const [weaponsData, setWeaponsData] = useState<IShopWeapon[]>([]);
  const [armorsData, setArmorsData] = useState<IShopArmor[]>([]);
  const [helmetsData, setHelmetsData] = useState<IShopHelmet[]>([]);
  const [bootsData, setBootsData] = useState<IShopBoots[]>([])
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const weaponsForShop = await getShopWeapons();
    const armorsForShop = await getShopArmors();
    const helmetsForShop = await getShopHelmets();
    const bootsForShop = await getShopBoots();


    if (armorsForShop) {
      setArmorsData(armorsForShop);
    }
    if (weaponsForShop) {
      setWeaponsData(weaponsForShop);
    }
    if (helmetsForShop) {
      setHelmetsData(helmetsForShop);
    }
    if (bootsForShop) {
      setBootsData(bootsForShop);
    }

    setLoading(false);
  }

  useEffect(() => {
    getData()
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
                </div>
              </IonText>

              <IonCard className="card-fade">
                <IonCardContent>
                  {weaponsData && armorsData && player ? (
                    <IonAccordionGroup>
                      <IonAccordion value="weapons">
                        <IonItem slot="header" color="light">
                          <IonLabel>Weapons</IonLabel>
                        </IonItem>
                        <div slot="content">
                          <IonList lines='full'>
                            {weaponsData.map((weapon: IShopWeapon, index: number) => { // Add type annotations for weapon and index
                              return (
                                <WeaponCard weapon={weapon} initialPlayer={player} key={index} isForSale={true} />
                              );
                            })}
                          </IonList>
                        </div>
                      </IonAccordion>
                      <IonAccordion value="armors">
                        <IonItem slot="header" color="light">
                          <IonLabel>Armors</IonLabel>
                        </IonItem>
                        <div slot="content">
                          <IonList lines='full'>
                            {armorsData?.map((armor: IShopArmor, index: number) => { // Add type annotations for weapon and index
                              return (
                                <ArmorCard armor={armor} initialPlayer={player} key={index} isForSale={true} />
                              );
                            })}
                          </IonList>
                        </div>
                      </IonAccordion>
                      <IonAccordion value="boots">
                        <IonItem slot="header" color="light">
                          <IonLabel>Boots</IonLabel>
                        </IonItem>
                        <div slot="content">
                          <IonList lines='full'>
                            {bootsData?.map((boots: IShopBoots, index: number) => { // Add type annotations for weapon and index
                              return (
                                <BootsCard boots={boots as IBoots} initialPlayer={player} key={index} isForSale={true} />
                              );
                            })}
                          </IonList>
                        </div>
                      </IonAccordion>
                      <IonAccordion value="helmets">
                        <IonItem slot="header" color="light">
                          <IonLabel>Helmets</IonLabel>
                        </IonItem>
                        <div slot="content">
                          <IonList lines='full'>
                            {helmetsData?.map((helmet: IShopHelmet, index: number) => { // Add type annotations for weapon and index
                              return (
                                <HelmetCard helmet={helmet as IHelmet} initialPlayer={player} key={index} isForSale={true} />
                              );
                            })}
                          </IonList>
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