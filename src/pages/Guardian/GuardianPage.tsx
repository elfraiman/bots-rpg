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
import { add, informationCircleOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import * as Realm from 'realm-web';
import EquipmentCard from '../../components/EquipmentCard';
import EquipmentPopover from '../../components/EquipmentPopover';
import GeneralItemCard from '../../components/GeneralItemCard';
import { usePlayerData } from '../../context/PlayerContext';
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
  const { player, updatePlayerData } = usePlayerData(); // Assuming updatePlayerStats is a method provided by your context
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

  const loadEquipmentInventory = async () => {
    if (!player) {
      setLoading(false);
      return;
    }
    const equipmentPromises = player.equipmentInventory?.map((item: Realm.BSON.ObjectId) => GetCombinedEquipmentStatsDetails(player._id, item));

    try {
      setLoading(true);
      const equipments = await Promise.all(equipmentPromises);
      const filteredEquipments: any = equipments.filter(equipment => equipment !== undefined); // Filter out undefined items

      setEquipmentInventoryItems(filteredEquipments);
    } catch (error) {
      console.error("Error loading equipment items:", error);
      // Handle any errors that occurred during fetching
    } finally {
      setLoading(false);
    }
  }

  const loadInventory = async () => {
    if (!player) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const itemPromises = player.inventory?.map((itemId: Realm.BSON.ObjectId) => GetCombinedItemDetails(itemId, player._id));
    try {
      const items = await Promise.all(itemPromises);
      const filteredItems: any = items.filter(item => item !== undefined);

      setInventoryItems(filteredItems);
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
    // Create an array of promises for each piece of equipment that the player has
    const equipmentTypes = ['armor', 'helmet', 'boots', 'weapon']; // Extend this list with other equipment types if needed
    const equipmentPromises = equipmentTypes.map((type) =>
      // @ts-ignore
      player.equipment[type] as any ? GetCombinedEquipmentStatsDetails(player._id, player.equipment[type]) : Promise.resolve(null)
    );

    try {
      // Execute all promises concurrently
      const results = await Promise.all(equipmentPromises);

      // Map results back to the respective equipment type
      const equippedDetails = results.reduce((details, result, index) => {
        const type = equipmentTypes[index];
        // @ts-ignore
        details[type] = result;
        return details;
      }, {});

      setEquippedDetails(equippedDetails);
    } catch (error) {
      console.error("Failed to load equipment details:", error);
      // Handle errors as appropriate
    }

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
    loadEquippedDetails();
  }, [player?.equipment]);

  useEffect(() => {
    if (!player) return;
    loadEquipmentInventory()
  }, [player?.equipmentInventory]);

  useEffect(() => {
    if (!player) return;
    loadInventory();
  }, [player?.gold]);

  useEffect(() => {
    loadAttributePoints();
  }, [player?.attributePoints])


  const logout = async () => {
    const user = app.currentUser;
    if (user) {
      await app.removeUser(user);
      window.location.reload();
    }
  }

  return (
    <IonPage className="content">
      <IonContent style={{
        '--background': `url('/images/home.webp') 0 0/cover no-repeat`,
      }}>
        <IonCard className="card-fade ion-padding corner-border" style={{ minHeight: 380 }}>
          <div>
            {!player || loading ? <IonSpinner /> : (
              <>
                <IonCardTitle className="player-name">{player.name}</IonCardTitle>
                <IonCardSubtitle>Level: {player.level}</IonCardSubtitle>
                <IonCardContent >
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
              </>
            )}

          </div>
        </IonCard>

        <IonCard className="corner-border">
          <IonAccordionGroup >
            <IonAccordion value="items" >
              <IonItem slot="header"  >
                <IonLabel>Equipment inventory</IonLabel>
              </IonItem>
              <div slot="content">
                <IonList lines='full'>
                  {inventoryEquipments?.map((item: IEquipment, index: number) => {
                    return (
                      <IonItem key={index}>
                        {item ? (
                          <EquipmentCard equipment={item} key={index} isForSell={false} />
                        ) : (<></>)}
                      </IonItem>
                    );
                  })}
                </IonList>
              </div>
            </IonAccordion>
          </IonAccordionGroup>

          <div>
            <IonAccordionGroup>
              <IonAccordion value="items">
                <IonItem slot="header" >
                  <IonLabel>Inventory</IonLabel>
                </IonItem>
                <div slot="content">
                  <IonList lines='full'>
                    {inventoryItems?.map((item: IPlayerOwnedItem, index: number) => {
                      return (
                        <IonItem key={index}>
                          {item ? (
                            <GeneralItemCard item={item} key={index} isForSell={false} />
                          ) : (<></>)}
                        </IonItem>
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
            <IonCardTitle>Attributes</IonCardTitle>
            <IonCardSubtitle style={{ fontSize: 15 }}>Level: {player?.level} |  Available Points: <span style={{ color: player?.attributePoints ?? 0 > 0 ? 'green' : 'gray' }}>{player?.attributePoints ?? 0}</span></IonCardSubtitle>
            <IonCardContent style={{ padding: 0 }}>
              <IonGrid style={{ padding: 0, marginTop: 16 }}>
                <IonRow>

                  <IonCol size='4'>
                    <IonButton fill="clear" id="str-trigger" className="stats-btn"><IonIcon src={informationCircleOutline} style={{ marginRight: 6 }} />STR: {player?.str} </IonButton>
                    <IonPopover trigger="str-trigger" triggerAction="hover">
                      <IonContent class="ion-padding">Strength increases your minimum and maximum physical damage.</IonContent>
                    </IonPopover>
                  </IonCol>

                  <IonCol size="2">
                    <IonButton disabled={!playerHasPoints} fill="clear" size="small" onClick={() => handleIncreaseStat('str')}>
                      {attributeLoading ? (<IonSpinner />) : (<IonIcon icon={add} />)}
                    </IonButton>
                  </IonCol>

                  <IonCol size='4'>
                    <IonButton fill="clear" id="con-trigger" className="stats-btn"><IonIcon src={informationCircleOutline} style={{ marginRight: 6 }} />CON: {player?.con}</IonButton>
                    <IonPopover trigger="con-trigger" triggerAction="hover">
                      <IonContent class="ion-padding">Constitution increases your maximum health.</IonContent>
                    </IonPopover>
                  </IonCol>

                  <IonCol size="2" >
                    <IonButton disabled={!playerHasPoints} fill="clear" size="small" onClick={() => handleIncreaseStat('con')}>
                      {attributeLoading ? (<IonSpinner />) : (<IonIcon icon={add} />)}
                    </IonButton>
                  </IonCol>

                </IonRow>
                <IonRow>
                  <IonCol size='4'>
                    <IonButton fill="clear" id="dex-trigger" className="stats-btn"><IonIcon src={informationCircleOutline} style={{ marginRight: 6 }} />DEX: {player?.dex}</IonButton>
                    <IonPopover trigger="dex-trigger" triggerAction="hover">
                      <IonContent class="ion-padding">Dexterity increases your attack speed, accuracy and dodge chance.</IonContent>
                    </IonPopover>
                  </IonCol>
                  <IonCol size="2">
                    <IonButton disabled={!playerHasPoints} fill="clear" size="small" onClick={() => handleIncreaseStat('dex')}>
                      {attributeLoading ? (<IonSpinner />) : (<IonIcon icon={add} />)}
                    </IonButton>
                  </IonCol>
                  <IonCol size='4'>
                    <IonButton fill="clear" id="int-trigger" className="stats-btn"><IonIcon src={informationCircleOutline} style={{ marginRight: 6 }} />INT: {player?.int}</IonButton>
                    <IonPopover trigger="int-trigger" triggerAction="hover">
                      <IonContent class="ion-padding">Intelligence increases your rare loot chance and XXX</IonContent>
                    </IonPopover>
                  </IonCol>

                  <IonCol size="2">
                    <IonButton disabled={!playerHasPoints} fill="clear" size="small" onClick={() => handleIncreaseStat('int')}>
                      {attributeLoading ? (<IonSpinner />) : (<IonIcon icon={add} />)}
                    </IonButton>
                  </IonCol>
                </IonRow>
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
  );
};

export default GuardianPage;
