import { IonAccordion, IonAccordionGroup, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonItem, IonLabel, IonList, IonPage, IonSpinner, IonText } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import EquipmentCard from '../../components/EquipmentCard';
import Header from '../../components/Header';
import getShopArmors from '../../functions/GetShopEquipment';
import { IEquipment } from '../../types/types';
import './Shop.css';
import useTypewriter from '../../hooks/UseTypewritter';


const Shop = () => {
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

      <IonPage>
        <Header />

        <IonContent style={{
          '--background': `url('/images/shop.webp') 0 0/cover no-repeat `,
        }}>
          <div>
            <IonCard className="corner-border" style={{ padding: 0 }}>
              <img alt={`Alex the shop attendant`} src={`/images/npc/npc-ship-0.webp`} />
              <IonCardHeader>
                <IonCardTitle style={{ display: 'flex', justifyContent: 'space-between' }}>Alex Nova</IonCardTitle>
                <IonCardSubtitle>Onboard shop keeper</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent className="ion-padding">
                <p>Full of available assortments for your Mecha Guardian to purchase and use</p>
              </IonCardContent>
            </IonCard>

            {!loading ? (

              <IonAccordionGroup className="ion-padding">
                <IonAccordion value="weapons" >
                  <IonItem slot="header">
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
                  <IonItem slot="header">
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
                  <IonItem slot="header">
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
                  <IonItem slot="header">
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
            ) : (<IonSpinner />)}
          </div>

        </IonContent>
      </IonPage>

    </React.Fragment>
  )
}

export default Shop;