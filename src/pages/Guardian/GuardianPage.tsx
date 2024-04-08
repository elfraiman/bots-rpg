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
  IonSpinner,
  IonText,
  IonThumbnail
} from '@ionic/react';
import { add } from 'ionicons/icons';
import React, { useContext, useEffect, useState } from 'react';
import * as Realm from 'realm-web';
import BotOutline from '/images/BotOutline.webp';
import EquipmentCard from '../../components/EquipmentCard';
import GeneralItemCard from '../../components/GeneralItemCard';
import Header from '../../components/Header';
import { PlayerContext } from '../../context/PlayerContext';
import { GetCombinedEquipmentStatsDetails } from '../../functions/GetCombinedEquipmentStatsDetails';
import { GetCombinedItemDetails } from '../../functions/GetCombinedItemDetails';
import getItemGradeColor from '../../functions/GetItemGradeColor';
import { IEquipment, IPlayer, IPlayerItem, IPlayerOwnedItem } from '../../types/types';
import './GuardianPage.css';

const styles = {
  notEquipped: { backgroundColor: 'rgba(214, 214, 214, 0.467)', border: '1px solid white' },
  equipped: { backgroundColor: 'rgba(0, 255, 30, 0.23)', border: '1px solid greenyellow' }
}

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
        <IonContent className="ion-padding"><IonSpinner /></IonContent>
      </IonPage>
    );
  } else if (!player) {
    return (
      <IonPage>
        <Header />
        <IonContent className="ion-padding">Please login</IonContent>
      </IonPage>
    );
  }

  return (
    <>
      <IonPage id="main-content">
        <Header />
        <IonContent className="home-bg">


          <IonCard className="ion-padding card-fade ion-bot-card">
            {loading ? <IonSpinner /> : (
              <div>
                <IonCardTitle>{player.name}</IonCardTitle>
                <IonCardSubtitle>Level: {player.level}</IonCardSubtitle>
                <IonCardContent className="bot-card-content">
                  <IonImg src={BotOutline} className="bot-outline-img" />

                  <div className="gear">
                    <IonButton fill="clear" id="left-weapon-click" className="left-arm-block" style={equippedDetails?.weapon ? styles.equipped : styles.notEquipped}>
                      {equippedDetails?.weapon ? (
                        <IonPopover alignment='center' trigger="left-weapon-click" triggerAction="click">
                          <IonContent>
                            <IonRow class="ion-align-items-stretch" style={{ height: '100%' }}> {/* Ensures row fills parent height */}
                              <IonCol size="8" className="ion-padding">
                                <IonText>
                                  <span style={{ color: getItemGradeColor(equippedDetails?.weapon?.grade ?? "common") }}>{equippedDetails?.weapon?.name}</span>
                                </IonText>
                                <IonCardSubtitle>
                                  <span style={{ color: getItemGradeColor(equippedDetails?.weapon?.grade ?? "common") }}>{equippedDetails?.weapon?.grade}</span>
                                </IonCardSubtitle>
                                <IonText>
                                  AP: {equippedDetails?.weapon?.stats.minAttack} ~ {equippedDetails?.weapon?.stats.maxAttack}
                                </IonText>
                              </IonCol>
                              <IonCol size="4" style={{ padding: 0 }}>
                                <div style={{ display: 'flex' }}>
                                  <IonThumbnail style={{ width: '100%', height: '100%', margin: 0 }}>
                                    <IonImg style={{ objectFit: 'cover' }} alt={`A ${equippedDetails?.weapon?.name} with beautiful details`} src={`/images/weapon/weapon-${equippedDetails?.weapon?.imgId}.webp`} />
                                  </IonThumbnail>
                                </div>
                              </IonCol>
                            </IonRow>
                          </IonContent>
                        </IonPopover>
                      ) : <></>}

                    </IonButton>

                    <IonButton fill="clear" id="right-weapon-click" className="right-arm-block" style={equippedDetails?.weapon ? styles.equipped : styles.notEquipped}>
                      {equippedDetails?.weapon ? (
                        <IonPopover alignment='center' trigger="right-weapon-click" triggerAction="click">
                          <IonContent>
                            <IonRow class="ion-align-items-stretch" style={{ height: '100%' }}> {/* Ensures row fills parent height */}
                              <IonCol size="8" className="ion-padding">
                                <IonText>
                                  <span style={{ color: getItemGradeColor(equippedDetails?.weapon?.grade ?? "common") }}>{equippedDetails?.weapon?.name}</span>
                                </IonText>
                                <IonCardSubtitle>
                                  <span style={{ color: getItemGradeColor(equippedDetails?.weapon?.grade ?? "common") }}>{equippedDetails?.weapon?.grade}</span>
                                </IonCardSubtitle>
                                <IonText>
                                  AP: {equippedDetails?.weapon?.stats.minAttack} ~ {equippedDetails?.weapon?.stats.maxAttack}
                                </IonText>
                              </IonCol>
                              <IonCol size="4" style={{ padding: 0 }}>
                                <div style={{ display: 'flex' }}>
                                  <IonThumbnail style={{ width: '100%', height: '100%', margin: 0 }}>
                                    <IonImg style={{ objectFit: 'cover' }} alt={`A ${equippedDetails?.weapon?.name} with beautiful details`} src={`/images/weapon/weapon-${equippedDetails?.weapon?.imgId}.webp`} />
                                  </IonThumbnail>
                                </div>
                              </IonCol>
                            </IonRow>
                          </IonContent>
                        </IonPopover>
                      ) : <></>}

                    </IonButton>

                    <IonButton fill="clear" id="armor-click" className="armor-block" style={equippedDetails?.armor ? styles.equipped : styles.notEquipped}>
                      {equippedDetails?.armor ? (
                        <IonPopover alignment='center' trigger="armor-click" triggerAction="click">
                          <IonContent>
                            <IonRow class="ion-align-items-stretch" style={{ height: '100%' }}> {/* Ensures row fills parent height */}
                              <IonCol size="8" className="ion-padding">
                                <IonText>
                                  <span style={{ color: getItemGradeColor(equippedDetails?.armor?.grade ?? "common") }}>{equippedDetails?.armor?.name}</span>
                                </IonText>
                                <IonCardSubtitle>
                                  <span style={{ color: getItemGradeColor(equippedDetails?.armor?.grade ?? "common") }}>{equippedDetails?.armor?.grade}</span>
                                </IonCardSubtitle>
                                <IonText>
                                  DP: {equippedDetails?.armor?.stats?.defense} <br />
                                  Evasion: {equippedDetails?.armor?.stats?.evasion}
                                </IonText>
                              </IonCol>
                              <IonCol size="4" style={{ padding: 0 }}>
                                <div style={{ display: 'flex' }}>
                                  <IonThumbnail style={{ width: '100%', height: '100%', margin: 0 }}>
                                    <IonImg style={{ objectFit: 'cover' }} alt={`A ${equippedDetails?.armor?.name} with beautiful details`} src={`/images/armor/armor-${equippedDetails?.armor?.imgId}.webp`} />
                                  </IonThumbnail>
                                </div>
                              </IonCol>
                            </IonRow>
                          </IonContent>
                        </IonPopover>
                      ) : <></>}
                    </IonButton>

                    <IonButton fill="clear" id="helmet-click" className="helmet-block" style={equippedDetails?.helmet ? styles.equipped : styles.notEquipped}>
                      {equippedDetails?.helmet ? (
                        <IonPopover alignment='center' trigger="helmet-click" triggerAction="click">
                          <IonContent>
                            <IonRow class="ion-align-items-stretch" style={{ height: '100%' }}> {/* Ensures row fills parent height */}
                              <IonCol size="8" className="ion-padding">
                                <IonText>
                                  <span style={{ color: getItemGradeColor(equippedDetails?.helmet?.grade ?? "common") }}>{equippedDetails?.helmet?.name}</span>
                                </IonText>
                                <IonCardSubtitle>
                                  <span style={{ color: getItemGradeColor(equippedDetails?.helmet?.grade ?? "common") }}>{equippedDetails?.helmet?.grade}</span>
                                </IonCardSubtitle>
                                <IonText>
                                  DP: {equippedDetails?.helmet?.stats.defense} <br />
                                  Evasion: {equippedDetails?.helmet?.stats?.evasion}
                                </IonText>
                              </IonCol>
                              <IonCol size="4" style={{ padding: 0 }}>
                                <div style={{ display: 'flex' }}>
                                  <IonThumbnail style={{ width: '100%', height: '100%', margin: 0 }}>
                                    <IonImg style={{ objectFit: 'cover' }} alt={`A ${equippedDetails?.helmet?.name} with beautiful details`} src={`/images/helmet/helmet-${equippedDetails?.armor?.imgId}.webp`} />
                                  </IonThumbnail>
                                </div>
                              </IonCol>
                            </IonRow>
                          </IonContent>
                        </IonPopover>
                      ) : <></>}
                    </IonButton>

                    <IonButton fill="clear" id="right-boot-click" className="right-boot-block" style={equippedDetails?.boots ? styles.equipped : styles.notEquipped}>
                      <IonPopover alignment='center' trigger="right-boot-click" triggerAction="click">
                        <IonContent>
                          <IonRow class="ion-align-items-stretch" style={{ height: '100%' }}> {/* Ensures row fills parent height */}
                            <IonCol size="8" className="ion-padding">
                              <IonText>
                                <span style={{ color: getItemGradeColor(equippedDetails?.boots?.grade ?? "common") }}>{equippedDetails?.boots?.name}</span>
                              </IonText>
                              <IonCardSubtitle>
                                <span style={{ color: getItemGradeColor(equippedDetails?.boots?.grade ?? "common") }}>{equippedDetails?.boots?.grade}</span>
                              </IonCardSubtitle>
                              <IonText>
                                DP: {equippedDetails?.boots?.stats.defense} <br />
                                Evasion: {equippedDetails?.boots?.stats?.evasion}
                              </IonText>
                            </IonCol>
                            <IonCol size="4" style={{ padding: 0 }}>
                              <div style={{ display: 'flex' }}>
                                <IonThumbnail style={{ width: '100%', height: '100%', margin: 0 }}>
                                  <IonImg style={{ objectFit: 'cover' }} alt={`A ${equippedDetails?.boots?.name} with beautiful details`} src={`/images/boots/boots-${equippedDetails?.armor?.imgId}.webp`} />
                                </IonThumbnail>
                              </div>
                            </IonCol>
                          </IonRow>
                        </IonContent>
                      </IonPopover>
                    </IonButton>

                    <IonButton fill="clear" id="left-boot-click" className="left-boot-block" style={equippedDetails?.boots ? styles.equipped : styles.notEquipped}>
                      <IonPopover alignment='center' trigger="left-boot-click" triggerAction="click">
                        <IonContent>
                          <IonRow class="ion-align-items-stretch" style={{ height: '100%' }}> {/* Ensures row fills parent height */}
                            <IonCol size="8" className="ion-padding">
                              <IonText>
                                <span style={{ color: getItemGradeColor(equippedDetails?.boots?.grade ?? "common") }}>{equippedDetails?.boots?.name}</span>
                              </IonText>
                              <IonCardSubtitle>
                                <span style={{ color: getItemGradeColor(equippedDetails?.boots?.grade ?? "common") }}>{equippedDetails?.boots?.grade}</span>
                              </IonCardSubtitle>
                              <IonText>
                                DP: {equippedDetails?.boots?.stats.defense} <br />
                                Evasion: {equippedDetails?.boots?.stats?.evasion}
                              </IonText>
                            </IonCol>
                            <IonCol size="4" style={{ padding: 0 }}>
                              <div style={{ display: 'flex' }}>
                                <IonThumbnail style={{ width: '100%', height: '100%', margin: 0 }}>
                                  <IonImg style={{ objectFit: 'cover' }} alt={`A ${equippedDetails?.boots?.name} with beautiful details`} src={`/images/boots/boots-${equippedDetails?.armor?.imgId}.webp`} />
                                </IonThumbnail>
                              </div>
                            </IonCol>
                          </IonRow>
                        </IonContent>
                      </IonPopover>
                    </IonButton>

                  </div>
                </IonCardContent>
              </div>)}
          </IonCard>

          <IonCard>
            <div>
              <IonAccordionGroup>
                <IonAccordion value="items">
                  <IonItem slot="header" color="light">
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
            </div>
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


          <IonCard className="ion-padding card-fade">
            <div>
              <IonCardTitle>Stats</IonCardTitle>
              <IonCardSubtitle>Level: {player?.level} |  Attribute Points: <span style={{ color: player?.attributePoints > 0 ? 'green' : 'gray' }}>{player?.attributePoints ?? 0}</span></IonCardSubtitle>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <h2>STR: {player?.str}</h2>
                    </IonCol>
                    <IonCol>
                      <IonButton disabled={!playerHasPoints} fill="clear" size="small" onClick={() => handleIncreaseStat('str')}>
                        {attributeLoading ? (<IonSpinner />) : (<IonIcon icon={add} />)}
                      </IonButton>
                    </IonCol>

                    <IonCol>
                      <h2>CON: {player?.con}</h2>
                    </IonCol>
                    <IonCol>
                      <IonButton disabled={!playerHasPoints} fill="clear" size="small" onClick={() => handleIncreaseStat('con')}>
                        {attributeLoading ? (<IonSpinner />) : (<IonIcon icon={add} />)}
                      </IonButton>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <h2>DEX: {player?.dex}</h2>
                    </IonCol>
                    <IonCol>
                      <IonButton disabled={!playerHasPoints} fill="clear" size="small" onClick={() => handleIncreaseStat('dex')}>
                        {attributeLoading ? (<IonSpinner />) : (<IonIcon icon={add} />)}
                      </IonButton>
                    </IonCol>
                    <IonCol>
                      <h2>INT: {player?.int}</h2>
                    </IonCol>

                    <IonCol>
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
        </IonContent>

      </IonPage>
    </>
  );
};

export default GuardianPage;
