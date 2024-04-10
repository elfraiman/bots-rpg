import { IonAccordion, IonAccordionGroup, IonCard, IonCardContent, IonContent, IonItem, IonLabel, IonList, IonPage, IonSpinner, IonText } from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import EquipmentCard from '../../components/EquipmentCard';
import Header from '../../components/Header';
import { PlayerContext } from '../../context/PlayerContext';
import getShopArmors from '../../functions/GetShopEquipment';
import { IEquipment } from '../../types/types';
import './Shop.css';


const Shop = () => {
  const { player } = useContext(PlayerContext);
  const [weaponsData, setWeaponsData] = useState<IEquipment[]>([]);
  const [armorsData, setArmorsData] = useState<IEquipment[]>([]);
  const [helmetsData, setHelmetsData] = useState<IEquipment[]>([]);
  const [bootsData, setBootsData] = useState<IEquipment[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const getEquipmentsToSell = await getShopArmors();

    if (getEquipmentsToSell) {
      const helmets: IEquipment[] = [];
      const boots: IEquipment[] = [];
      const armors: IEquipment[] = [];
      const weapons: IEquipment[] = [];

      getEquipmentsToSell.map((equipment: IEquipment) => {
        if (equipment.type !== 'weapon') {
          equipment.type === 'helmet' ? helmets.push(equipment) : equipment.type === 'boots' ? boots.push(equipment) : armors.push(equipment);
        } else {
          weapons.push(equipment);
        }
      })

      setArmorsData(armors);
      setBootsData(boots);
      setHelmetsData(helmets);
      setWeaponsData(weapons);
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
            <IonContent className="ion-padding" style={{
              '--background': `url('/images/shop.webp') 0 0/cover no-repeat`,
            }}>
              <IonText>
                <div className="text-overlay">
                  <h2><strong>The shop</strong></h2>
                </div>
              </IonText>

              <IonCard className="card-fade corner-border">
                <IonCardContent>
                  {weaponsData && armorsData && player ? (
                    <IonAccordionGroup>
                      <IonAccordion value="weapons">
                        <IonItem slot="header" color="light">
                          <IonLabel>Weapons</IonLabel>
                        </IonItem>
                        <div slot="content">
                          <IonList lines='full'>
                            {weaponsData.map((weapon: IEquipment, index: number) => { // Add type annotations for weapon and index
                              return (
                                <EquipmentCard equipment={weapon} key={index} isForSell={true} />
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
                            {armorsData?.map((armor: IEquipment, index: number) => { // Add type annotations for weapon and index
                              return (
                                <EquipmentCard equipment={armor} key={index} isForSell={true} />
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
                            {bootsData?.map((boot: IEquipment, index: number) => { // Add type annotations for weapon and index
                              return (
                                <EquipmentCard equipment={boot} key={index} isForSell={true} />
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
                            {helmetsData?.map((helmet: IEquipment, index: number) => { // Add type annotations for weapon and index
                              return (
                                <EquipmentCard equipment={helmet} key={index} isForSell={true} />
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