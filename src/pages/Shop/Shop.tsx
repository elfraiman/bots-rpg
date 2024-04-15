import { IonAccordion, IonAccordionGroup, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonItem, IonLabel, IonList, IonPage, IonSpinner, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import EquipmentCard from '../../components/EquipmentCard';
import getShopArmors from '../../functions/GetShopEquipment';
import { IEquipment } from '../../types/types';
import './Shop.css';
import NpcCard from '../../components/NpcCard';
import { showStoryModal } from '../../functions/ShowStoryModal';
import { usePlayerData } from '../../context/PlayerContext';


interface IArmorsData {
  helmets: IEquipment[],
  boots: IEquipment[],
  armors: IEquipment[]
}
const Shop = () => {
  const { player, updatePlayerData } = usePlayerData();
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

  useIonViewDidEnter(() => {
    // Handle if player is on story step 1
    // shows Alex introduction story
    //
    if (player && player.quests.storyStep === 1) {
      showStoryModal({ storyStep: 1, player, updatePlayerData });
    }
  }, [player?.quests.storyStep])


  return (
    <IonPage className="content">
      <IonContent style={{
        '--background': `url('/images/shop.webp') 0 0/cover no-repeat `,
      }}>
        <div className="ion-padding">
          <NpcCard
            npcImgId={2}
            npcName="Alex Nova"
            npcRole="Trader"
            npcText="Hey! Make sure you can equip what you buy. I don't do refunds."
          />

          <div className="ion-padding low-fade corner-border" style={{ marginTop: 16 }}>
            <h2 style={{ marginTop: 0 }}>Trader</h2>
            <p>The items that are available for trade will restock based on Alex's plunder.</p>
          </div>

          <IonAccordionGroup >
            {!loading ? (
              <>
                <IonAccordion value="weapons" style={{ marginTop: 16 }} >
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
  )
}

export default Shop;