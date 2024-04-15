import { IonAccordion, IonAccordionGroup, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonItem, IonLabel, IonList, IonPage, IonSpinner, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import EquipmentCard from '../../components/EquipmentCard';
import getShopArmors from '../../functions/GetShopEquipment';
import { IEquipment } from '../../types/types';
import './Shop.css';
import NpcCard from '../../components/NpcCard';



interface IArmorsData {
  helmets: IEquipment[],
  boots: IEquipment[],
  armors: IEquipment[]
}
const Shop = () => {
  const [weaponsData, setWeaponsData] = useState<IEquipment[]>([]);
  const [armorsData, setArmorsData] = useState<IArmorsData>({
    helmets: [],
    boots: [],
    armors: []
  });
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
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

        setArmorsData({
          helmets,
          boots,
          armors
        });
        setWeaponsData(weapons);
      }

    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  useIonViewWillEnter(() => {
    getData();

  })

  return (
    <React.Fragment>
      <IonPage className="content">
        <IonContent style={{
          '--background': `url('/images/shop.webp') 0 0/cover no-repeat `,
        }}>
          <div className="ion-padding">
            <NpcCard
              npcImgId={0}
              npcName="Alex Nova"
              npcRole="Trader"
              npcText="Hey! Make sure you can equip what you buy. I don't do refunds."
            />

            <div className="ion-padding low-fade" style={{ marginTop: 16 }}>
              <h2>Travel</h2>
              <p>Here's a list of planets you've located.</p>
            </div>

            <IonAccordionGroup >
              {!loading ? (
                <>
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
                        {armorsData.armors?.map((armor: IEquipment, index: number) => { // Add type annotations for weapon and index
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
                        {armorsData.boots?.map((boot: IEquipment, index: number) => { // Add type annotations for weapon and index
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
                        {armorsData.helmets?.map((helmet: IEquipment, index: number) => { // Add type annotations for weapon and index
                          return (
                            <EquipmentCard equipment={helmet} key={index} isForSell={true} />
                          );
                        })}
                      </IonList>
                    </div>
                  </IonAccordion>
                </>
              ) : (<IonSpinner />)}
            </IonAccordionGroup>
          </div>
        </IonContent>
      </IonPage>
    </React.Fragment>
  )
}

export default Shop;