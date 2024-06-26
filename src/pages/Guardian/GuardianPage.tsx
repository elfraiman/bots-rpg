import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonPopover,
  IonRow,
  IonSpinner
} from '@ionic/react';
import { add } from 'ionicons/icons';
import React, { useContext, useEffect, useState } from 'react';
import * as Realm from 'realm-web';
import EquipmentCard from '../../components/EquipmentCard';
import EquipmentPopover from '../../components/EquipmentPopover';
import GeneralItemCard from '../../components/GeneralItemCard';
import Header from '../../components/Header';
import { PlayerContext } from '../../context/PlayerContext';
import { GetCombinedEquipmentStatsDetails } from '../../functions/GetCombinedEquipmentStatsDetails';
import { GetCombinedItemDetails } from '../../functions/GetCombinedItemDetails';
import { IEquipment, IPlayer, IPlayerOwnedItem } from '../../types/types';
import './GuardianPage.css';
import BotOutline from '/images/BotOutline.webp';

const styles = {
  notEquipped: { backgroundColor: 'rgba(214, 214, 214, 0.467)', border: '1px solid white' },
  equipped: { backgroundColor: 'rgba(0, 255, 30, 0.23)', border: '1px solid greenyellow' }
}

const app = Realm.App.getApp('application-0-vgvqx');


const GuardianPage: React.FC = () => {
  const { player, updatePlayerData } = useContext(PlayerContext); // Assuming updatePlayerStats is a method provided by your context
  const [playerHasPoints, setPlayerHasPoints] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [attributeLoading, setAttributeLoading] = useState(false);
  const [inventoryEquipments, setEquipmentInventoryItems] = useState<IEquipment[]>([]);
  const [inventoryItems, setInventoryItems] = useState<IPlayerOwnedItem[]>([]);
  const [equippedDetails, setEquippedDetails] = useState<any>({});



  const handleIncreaseStat = async (statName: keyof IPlayer) => {
    if (player && player?.attributePoints > 0) {
      const updatedPlayer = {
        ...player,
        [statName]: Number(player[statName]) + 1,
        attributePoints: player.attributePoints - 1, // Assuming you have attributePoints in your IPlayer interface
      };

      try {
        setAttributeLoading(true);
        // Call context method or set local state here
        await updatePlayerData(updatedPlayer); // Assuming this method is implemented in your context to handle player updates
      } catch (e) {
        console.log(e);
      } finally {
        setAttributeLoading(false);
      }

    }
  };

  const loadInventory = async () => {
    if (!player) {
      setLoading(false);
      return;
    }

    const equipmentPromises = player.equipmentInventory?.map((item: Realm.BSON.ObjectId) => GetCombinedEquipmentStatsDetails(player._id, item));
    const itemPromises = player.inventory?.map((itemId: Realm.BSON.ObjectId) => GetCombinedItemDetails(itemId));

    try {
      const equipments = await Promise.all(equipmentPromises);
      const items = await Promise.all(itemPromises);
      const filteredEquipments: any = equipments.filter(equipment => equipment !== undefined); // Filter out undefined items
      const filteredItems: any = items.filter(item => item !== undefined);

      setInventoryItems(filteredItems);
      setEquipmentInventoryItems(filteredEquipments);
    } catch (error) {
      console.error("Error loading inventory items:", error);
      // Handle any errors that occurred during fetching
    } finally {
      setLoading(false);
    }
  };

  const loadEquippedDetails = async () => {
    if (!player || !player.equipment) {
      setLoading(false);
      return;
    }

    // Example for fetching and combining details for weapon, extend this to other equipment types
    const armorDetails = player.equipment.armor ? await GetCombinedEquipmentStatsDetails(player._id, player.equipment.armor) : null;
    const helmetDetails = player.equipment.helmet ? await GetCombinedEquipmentStatsDetails(player._id, player.equipment.helmet) : null;
    const bootsDetails = player.equipment.boots ? await GetCombinedEquipmentStatsDetails(player._id, player.equipment.boots) : null;
    const weaponDetails = player.equipment.weapon ? await GetCombinedEquipmentStatsDetails(player._id, player.equipment.weapon) : null;

    setEquippedDetails({
      armor: armorDetails,
      helmet: helmetDetails,
      boots: bootsDetails,
      weapon: weaponDetails,
      // Include other equipment details here
    });

    setLoading(false);
  };

  const loadAttributePoints = () => {
    if (player && player.attributePoints > 0) {
      setPlayerHasPoints(true);
    } else {
      setPlayerHasPoints(false);
    }
  }

  useEffect(() => {
    if (!player) return;
    loadInventory();
    loadEquippedDetails();
  }, [player]);

  useEffect(() => {
    loadAttributePoints();
  }, [player?.attributePoints])

  if (loading) {
    return (
      <IonPage>
        <Header />
        <IonContent><IonSpinner /></IonContent>
      </IonPage>
    );
  } else if (!player) {
    return (
      <IonPage>
        <Header />
        <IonContent>Please login</IonContent>
      </IonPage>
    );
  }

  const logout = async () => {
    const user = app.currentUser;
    if (user) {
      await app.removeUser(user);
      window.location.reload();
    }
  }


  return (
    <>
      <IonPage id="main-content">
        <Header />
        <IonContent style={{
          '--background': `url('/images/home.webp') 0 0 / cover no-repeat`,
        }}>
          <IonCard className="ion-padding card-fade ion-bot-card corner-border">
            {loading ? <IonSpinner /> : (
              <div>
                <IonCardTitle>{player.name}</IonCardTitle>
                <IonCardSubtitle>Level: {player.level}</IonCardSubtitle>
                <IonCardContent className="bot-card-content">
                  <IonImg src={BotOutline} className="bot-outline-img" />


                  <IonButton fill="clear" id="left-weapon-click" className="left-arm-block" style={equippedDetails?.weapon ? styles.equipped : styles.notEquipped}>
                    {equippedDetails?.weapon ? (
                      <EquipmentPopover equippedDetails={equippedDetails?.weapon} trigger="left-weapon-click" />
                    ) : <></>}
                  </IonButton>

                  <IonButton fill="clear" id="right-weapon-click" className="right-arm-block" style={equippedDetails?.weapon ? styles.equipped : styles.notEquipped}>
                    {equippedDetails?.weapon ? (
                      <EquipmentPopover equippedDetails={equippedDetails?.weapon} trigger="right-weapon-click" />
                    ) : <></>}
                  </IonButton>

                  <IonButton fill="clear" id="armor-click" className="armor-block" style={equippedDetails?.armor ? styles.equipped : styles.notEquipped}>
                    {equippedDetails?.armor ? (
                      <EquipmentPopover equippedDetails={equippedDetails?.armor} trigger="armor-click" />
                    ) : <></>}
                  </IonButton>

                  <IonButton fill="clear" id="helmet-click" className="helmet-block" style={equippedDetails?.helmet ? styles.equipped : styles.notEquipped}>
                    {equippedDetails?.helmet ? (
                      <EquipmentPopover equippedDetails={equippedDetails?.helmet} trigger="helmet-click" />
                    ) : <></>}
                  </IonButton>

                  <IonButton fill="clear" id="right-boot-click" className="right-boot-block" style={equippedDetails?.boots ? styles.equipped : styles.notEquipped}>
                    <EquipmentPopover equippedDetails={equippedDetails?.boots} trigger="right-boot-click" />
                  </IonButton>

                  <IonButton fill="clear" id="left-boot-click" className="left-boot-block" style={equippedDetails?.boots ? styles.equipped : styles.notEquipped}>
                    <EquipmentPopover equippedDetails={equippedDetails?.boots} trigger="left-boot-click" />
                  </IonButton>

                </IonCardContent>
              </div>)}
          </IonCard>

          <IonCard className="corner-border">

            <IonAccordionGroup >
              <IonAccordion value="items" >
                <IonItem slot="header" color="light" >
                  <IonLabel>Equipment inventory</IonLabel>
                </IonItem>
                <div slot="content">
                  <IonList lines='full'>
                    {inventoryEquipments?.map((item: IEquipment, index: number) => {
                      return (
                        <div key={index}>
                          {item ? (
                            <EquipmentCard equipment={item} key={index} isForSell={false} />
                          ) : (<></>)}
                        </div>
                      );
                    })}
                  </IonList>
                </div>
              </IonAccordion>
            </IonAccordionGroup>

            <div>
              <IonAccordionGroup>
                <IonAccordion value="items">
                  <IonItem slot="header" color="light">
                    <IonLabel>Inventory</IonLabel>
                  </IonItem>
                  <div slot="content">
                    <IonList lines='full'>
                      {inventoryItems?.map((item: IPlayerOwnedItem, index: number) => {
                        return (
                          <div key={index}>
                            {item ? (
                              <GeneralItemCard item={item} key={index} isForSell={false} />
                            ) : (<></>)}
                          </div>
                        );
                      })}
                    </IonList>
                  </div>
                </IonAccordion>
              </IonAccordionGroup>
            </div>
          </IonCard>


          <IonCard className="ion-padding card-fade corner-border">
            <div>
              <IonCardTitle>Stats</IonCardTitle>
              <IonCardSubtitle style={{ fontSize: 15 }}>Level: {player?.level} |  Available Points: <span style={{ color: player?.attributePoints > 0 ? 'green' : 'gray' }}>{player?.attributePoints ?? 0}</span></IonCardSubtitle>
              <IonCardContent style={{ padding: 0 }}>
                <IonGrid>
                  <IonRow>
                    <IonCol size='3'>
                      <IonButton fill="clear" id="str-trigger" color="dark" className="stats-btn">STR: {player?.str}</IonButton>
                      <IonPopover trigger="str-trigger" triggerAction="hover">
                        <IonContent class="ion-padding">Strength increases your minimum and maximum physical damage.</IonContent>
                      </IonPopover>
                    </IonCol>
                    <IonCol>
                      <IonButton disabled={!playerHasPoints} fill="clear" size="small" onClick={() => handleIncreaseStat('str')}>
                        {attributeLoading ? (<IonSpinner />) : (<IonIcon icon={add} />)}
                      </IonButton>
                    </IonCol>

                    <IonCol size='3'>
                      <IonButton fill="clear" id="con-trigger" color="dark" className="stats-btn">CON: {player?.con}</IonButton>
                      <IonPopover trigger="con-trigger" triggerAction="hover">
                        <IonContent class="ion-padding">Constitution increases your maximum health.</IonContent>
                      </IonPopover>
                    </IonCol>
                    <IonCol size='3'>
                      <IonButton disabled={!playerHasPoints} fill="clear" size="small" onClick={() => handleIncreaseStat('con')}>
                        {attributeLoading ? (<IonSpinner />) : (<IonIcon icon={add} />)}
                      </IonButton>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size='3'>
                      <IonButton fill="clear" id="dex-trigger" color="dark" className="stats-btn">DEX: {player?.dex}</IonButton>
                      <IonPopover trigger="dex-trigger" triggerAction="hover">
                        <IonContent class="ion-padding">Dexterity increases your attack speed, accuracy and dodge chance.</IonContent>
                      </IonPopover>
                    </IonCol>
                    <IonCol size='3'>
                      <IonButton disabled={!playerHasPoints} fill="clear" size="small" onClick={() => handleIncreaseStat('dex')}>
                        {attributeLoading ? (<IonSpinner />) : (<IonIcon icon={add} />)}
                      </IonButton>
                    </IonCol>
                    <IonCol size='3'>
                      <IonButton fill="clear" id="int-trigger" color="dark" className="stats-btn">INT: {player?.int}</IonButton>
                      <IonPopover trigger="int-trigger" triggerAction="hover">
                        <IonContent class="ion-padding">Intelligence increases your rare loot chance and XXX</IonContent>
                      </IonPopover>
                    </IonCol>

                    <IonCol size='3'>
                      <IonButton disabled={!playerHasPoints} fill="clear" size="small" onClick={() => handleIncreaseStat('int')}>
                        {attributeLoading ? (<IonSpinner />) : (<IonIcon icon={add} />)}
                      </IonButton>
                    </IonCol>
                  </IonRow>
                  {/* Add more rows and columns for additional stats as needed */}
                </IonGrid>
              </IonCardContent>
            </div>
          </IonCard>
          <IonCard>
            <IonCardSubtitle className="ion-padding">This placement is temporary</IonCardSubtitle>
            <IonButton style={{ width: '100%' }} onClick={() => logout()}>Logout</IonButton>
          </IonCard>
        </IonContent>

      </IonPage>
    </>
  );
};

export default GuardianPage;
