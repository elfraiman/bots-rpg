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
import BotOutline from '/images/BotOutline.webp';
import Header from '../components/Header';
import WeaponCard from '../components/WeaponCard';
import { PlayerContext } from '../context/PlayerContext';
import { IArmor, IBoots, IHelmet, IPlayer, IWeapon } from '../types/types';
import './GuardianPage.css';
import getItemGradeColor from '../functions/GetWeaponColor';
import ArmorCard from '../components/ArmorCard';
import HelmetCard from '../components/HelmetCard';
import BootsCard from '../components/BootsCard';

const styles = {
  notEquipped: { backgroundColor: 'rgba(214, 214, 214, 0.467)', border: '1px solid white' },
  equipped: { backgroundColor: 'rgba(0, 255, 30, 0.23)', border: '1px solid greenyellow' }
}

const GuardianPage: React.FC = () => {
  const { player, updatePlayerData } = useContext(PlayerContext); // Assuming updatePlayerStats is a method provided by your context
  const [playerHasPoints, setPlayerHasPoints] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [attributeLoading, setAttributeLoading] = useState(false);

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

  useEffect(() => {
    setLoading(true)
    if (player && player?.attributePoints > 0) {
      setPlayerHasPoints(true);
    } else {
      setPlayerHasPoints(false);
    }

    setLoading(false);

  }, [player])


  return (
    <>
      <IonPage id="main-content">
        <Header />

        <IonContent className="ion-padding home-bg">
          {player ? (
            <React.Fragment>
              <IonCard className="ion-padding card-fade ion-bot-card">
                {loading ? <IonSpinner /> : (
                  <div>
                    <IonCardTitle>{player.name}</IonCardTitle>
                    <IonCardSubtitle>Level: {player.level}</IonCardSubtitle>
                    <IonCardContent className="bot-card-content">
                      <IonImg src={BotOutline} className="bot-outline-img" />

                      <IonButton fill="clear" id="weapon-click" className="left-arm-block" style={player.equipment?.mainHand ? styles.equipped : styles.notEquipped}>
                        <IonPopover alignment='center' trigger="weapon-click" triggerAction="click">
                          <IonContent>
                            <IonRow class="ion-align-items-stretch" style={{ height: '100%' }}> {/* Ensures row fills parent height */}
                              <IonCol size="8" className="ion-padding">
                                <IonText>
                                  <span style={{ color: getItemGradeColor(player.equipment?.mainHand?.grade ?? "common") }}>{player?.equipment?.mainHand?.name}</span>
                                </IonText>
                                <IonCardSubtitle>
                                  <span style={{ color: getItemGradeColor(player.equipment?.mainHand?.grade ?? "common") }}>{player?.equipment?.mainHand?.grade}</span>
                                </IonCardSubtitle>
                                <IonText>
                                  Damage: {player?.equipment?.mainHand?.minDamage} - {player?.equipment?.mainHand?.maxDamage}
                                </IonText>
                              </IonCol>
                              <IonCol size="4" style={{ padding: 0 }}>
                                <div style={{ display: 'flex' }}>
                                  <IonThumbnail style={{ width: '100%', height: '100%', margin: 0 }}>
                                    <IonImg style={{ objectFit: 'cover' }} alt={`A ${player?.equipment?.mainHand?.name} with beautiful details`} src={`/images/weapons/weapon-${player?.equipment?.mainHand?.imgId}.webp`} />
                                  </IonThumbnail>
                                </div>
                              </IonCol>
                            </IonRow>
                          </IonContent>
                        </IonPopover>

                      </IonButton>

                      <div className="right-arm-block" style={styles.notEquipped}>
                      </div>

                      <IonButton fill="clear" id="armor-click" className="armor-block" style={player.equipment?.armor ? styles.equipped : styles.notEquipped}>
                        <IonPopover alignment='center' trigger="armor-click" triggerAction="click">
                          <IonContent>
                            <IonRow class="ion-align-items-stretch" style={{ height: '100%' }}> {/* Ensures row fills parent height */}
                              <IonCol size="8" className="ion-padding">
                                <IonText>
                                  <span style={{ color: getItemGradeColor(player.equipment?.armor?.grade ?? "common") }}>{player?.equipment?.armor?.name}</span>
                                </IonText>
                                <IonCardSubtitle>
                                  <span style={{ color: getItemGradeColor(player.equipment?.armor?.grade ?? "common") }}>{player?.equipment?.armor?.grade}</span>
                                </IonCardSubtitle>
                                <IonText>
                                  Defense: {player?.equipment?.armor?.defense}
                                </IonText>
                              </IonCol>
                              <IonCol size="4" style={{ padding: 0 }}>
                                <div style={{ display: 'flex' }}>
                                  <IonThumbnail style={{ width: '100%', height: '100%', margin: 0 }}>
                                    <IonImg style={{ objectFit: 'cover' }} alt={`A ${player?.equipment?.armor?.name} with beautiful details`} src={`/images/armors/armor-${player?.equipment?.armor?.imgId}.webp`} />
                                  </IonThumbnail>
                                </div>
                              </IonCol>
                            </IonRow>
                          </IonContent>
                        </IonPopover>
                      </IonButton>

                      <IonButton fill="clear" id="helmet-click" className="helmet-block" style={player.equipment?.helmet ? styles.equipped : styles.notEquipped}>
                        <IonPopover alignment='center' trigger="helmet-click" triggerAction="click">
                          <IonContent>
                            <IonRow class="ion-align-items-stretch" style={{ height: '100%' }}> {/* Ensures row fills parent height */}
                              <IonCol size="8" className="ion-padding">
                                <IonText>
                                  <span style={{ color: getItemGradeColor(player.equipment?.helmet?.grade ?? "common") }}>{player?.equipment?.helmet?.name}</span>
                                </IonText>
                                <IonCardSubtitle>
                                  <span style={{ color: getItemGradeColor(player.equipment?.helmet?.grade ?? "common") }}>{player?.equipment?.helmet?.grade}</span>
                                </IonCardSubtitle>
                                <IonText>
                                  Defense: {player?.equipment?.helmet?.defense}
                                </IonText>
                              </IonCol>
                              <IonCol size="4" style={{ padding: 0 }}>
                                <div style={{ display: 'flex' }}>
                                  <IonThumbnail style={{ width: '100%', height: '100%', margin: 0 }}>
                                    <IonImg style={{ objectFit: 'cover' }} alt={`A ${player?.equipment?.helmet?.name} with beautiful details`} src={`/images/helmets/helmet-${player?.equipment?.armor?.imgId}.webp`} />
                                  </IonThumbnail>
                                </div>
                              </IonCol>
                            </IonRow>
                          </IonContent>
                        </IonPopover>
                      </IonButton>


                      <IonButton fill="clear" id="right-boot-click" className="right-boot-block" style={player.equipment?.boots ? styles.equipped : styles.notEquipped}>
                        <IonPopover alignment='center' trigger="right-boot-click" triggerAction="click">
                          <IonContent>
                            <IonRow class="ion-align-items-stretch" style={{ height: '100%' }}> {/* Ensures row fills parent height */}
                              <IonCol size="8" className="ion-padding">
                                <IonText>
                                  <span style={{ color: getItemGradeColor(player.equipment?.boots?.grade ?? "common") }}>{player?.equipment?.boots?.name}</span>
                                </IonText>
                                <IonCardSubtitle>
                                  <span style={{ color: getItemGradeColor(player.equipment?.boots?.grade ?? "common") }}>{player?.equipment?.boots?.grade}</span>
                                </IonCardSubtitle>
                                <IonText>
                                  Defense: {player?.equipment?.boots?.defense}
                                </IonText>
                              </IonCol>
                              <IonCol size="4" style={{ padding: 0 }}>
                                <div style={{ display: 'flex' }}>
                                  <IonThumbnail style={{ width: '100%', height: '100%', margin: 0 }}>
                                    <IonImg style={{ objectFit: 'cover' }} alt={`A ${player?.equipment?.boots?.name} with beautiful details`} src={`/images/boots/boots-${player?.equipment?.armor?.imgId}.webp`} />
                                  </IonThumbnail>
                                </div>
                              </IonCol>
                            </IonRow>
                          </IonContent>
                        </IonPopover>
                      </IonButton>

                  
                      <IonButton fill="clear" id="left-boot-click" className="left-boot-block" style={player.equipment?.boots ? styles.equipped : styles.notEquipped}>
                        <IonPopover alignment='center' trigger="left-boot-click" triggerAction="click">
                          <IonContent>
                            <IonRow class="ion-align-items-stretch" style={{ height: '100%' }}> {/* Ensures row fills parent height */}
                              <IonCol size="8" className="ion-padding">
                                <IonText>
                                  <span style={{ color: getItemGradeColor(player.equipment?.boots?.grade ?? "common") }}>{player?.equipment?.boots?.name}</span>
                                </IonText>
                                <IonCardSubtitle>
                                  <span style={{ color: getItemGradeColor(player.equipment?.boots?.grade ?? "common") }}>{player?.equipment?.boots?.grade}</span>
                                </IonCardSubtitle>
                                <IonText>
                                  Defense: {player?.equipment?.boots?.defense}
                                </IonText>
                              </IonCol>
                              <IonCol size="4" style={{ padding: 0 }}>
                                <div style={{ display: 'flex' }}>
                                  <IonThumbnail style={{ width: '100%', height: '100%', margin: 0 }}>
                                    <IonImg style={{ objectFit: 'cover' }} alt={`A ${player?.equipment?.boots?.name} with beautiful details`} src={`/images/boots/boots-${player?.equipment?.armor?.imgId}.webp`} />
                                  </IonThumbnail>
                                </div>
                              </IonCol>
                            </IonRow>
                          </IonContent>
                        </IonPopover>
                      </IonButton>
                    </IonCardContent>


                    <IonAccordionGroup>
                      <IonAccordion value="weapons">
                        <IonItem slot="header" color="light">
                          <IonLabel>Weapons</IonLabel>
                        </IonItem>
                        <div slot="content">
                          <IonList lines='full'>
                            {player?.inventory?.weapons.map((weapon: IWeapon, index: number) => {
                              return (
                                <WeaponCard weapon={weapon} initialPlayer={player} key={index} isForSale={false} />
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
                            {player?.inventory?.armors.map((armor: IArmor, index: number) => {
                              return (
                                <ArmorCard armor={armor} initialPlayer={player} key={index} isForSale={false} />
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
                            {player?.inventory?.helmets.map((helmet: IHelmet, index: number) => {
                              return (
                                <HelmetCard helmet={helmet} initialPlayer={player} key={index} isForSale={false} />
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
                            {player?.inventory?.boots.map((boots: IBoots, index: number) => {
                              return (
                                <BootsCard boots={boots} initialPlayer={player} key={index} isForSale={false} />
                              );
                            })}
                          </IonList>
                        </div>
                      </IonAccordion>
                    </IonAccordionGroup>
                  </div>
                )}
              </IonCard>



              <IonCard className="ion-padding card-fade">
                <div>
                  <IonCardTitle>Stats</IonCardTitle>
                  <IonCardSubtitle>Level: {player?.level} |  Attribute Points: <span style={{ color: player?.attributePoints > 0 ? 'green' : 'gray' }}>{player?.attributePoints ?? 0}</span></IonCardSubtitle>
                  <IonCardContent>
                    <IonGrid>
                      <IonRow>
                        <IonCol>
                          <IonText>STR: {player?.str}</IonText>
                        </IonCol>
                        <IonCol>
                          <IonButton disabled={!playerHasPoints} fill="clear" size="small" onClick={() => handleIncreaseStat('str')}>
                            {attributeLoading ? (<IonSpinner />) : (<IonIcon icon={add} />)}
                          </IonButton>
                        </IonCol>

                        <IonCol>
                          <IonText>CON: {player?.con}</IonText>
                        </IonCol>
                        <IonCol>
                          <IonButton disabled={!playerHasPoints} fill="clear" size="small" onClick={() => handleIncreaseStat('con')}>
                            {attributeLoading ? (<IonSpinner />) : (<IonIcon icon={add} />)}
                          </IonButton>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol>
                          <IonText>DEX: {player?.dex}</IonText>
                        </IonCol>
                        <IonCol>
                          <IonButton disabled={!playerHasPoints} fill="clear" size="small" onClick={() => handleIncreaseStat('dex')}>
                            {attributeLoading ? (<IonSpinner />) : (<IonIcon icon={add} />)}
                          </IonButton>
                        </IonCol>
                        <IonCol>
                          <IonText>INT: {player?.int}</IonText>
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
            </React.Fragment>

          ) : <><IonSpinner /></>}
        </IonContent>
      </IonPage>
    </>
  );
};

export default GuardianPage;
