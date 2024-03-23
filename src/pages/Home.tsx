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
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonPage,
  IonPopover,
  IonRow,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { add } from 'ionicons/icons';
import React, { useContext, useEffect, useState } from 'react';
import BotOutline from '../../resources/images/BotOutline.webp';
import Header from '../components/Header';
import WeaponCard from '../components/WeaponCard';
import { PlayerContext } from '../context/PlayerContext';
import { IPlayer, IWeapon } from '../types/types';
import './Home.css';

const styles = {
  notEquipped: { backgroundColor: 'rgba(214, 214, 214, 0.467)', border: '1px solid white' },
  equipped: { backgroundColor: 'rgba(0, 255, 30, 0.23)', border: '1px solid greenyellow' }
}

const Home: React.FC = () => {
  const { player, updatePlayerData } = useContext(PlayerContext); // Assuming updatePlayerStats is a method provided by your context
  const [playerHasPoints, setPlayerHasPoints] = useState<boolean>(false);

  const handleIncreaseStat = (statName: keyof IPlayer) => {
    if (player && player?.attributePoints > 0) {
      const updatedPlayer = {
        ...player,
        [statName]: Number(player[statName]) + 1,
        attributePoints: player.attributePoints - 1, // Assuming you have attributePoints in your IPlayer interface
      };
      // Call context method or set local state here
      updatePlayerData(updatedPlayer); // Assuming this method is implemented in your context to handle player updates
    }
  };

  useEffect(() => {
    if (player && player?.attributePoints > 0) {
      setPlayerHasPoints(true);
    } else {
      setPlayerHasPoints(false);
    }
  }, [player])

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu Content</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">Side menu</IonContent>
      </IonMenu>
      <IonPage id="main-content">

        <Header title='Home' />

        <IonContent className="ion-padding home-bg">
          {player ? (
            <React.Fragment>
              <IonCard className="ion-padding card-fade ion-bot-card">
                <IonCardTitle>{player.name}</IonCardTitle>
                <IonCardSubtitle>Level: {player.level}</IonCardSubtitle>
                <IonCardContent className="bot-card-content">
                  <IonImg src={BotOutline} className="bot-outline-img" />
                  <IonButton fill="clear" id="click-trigger" className="left-arm-block" style={player.equipment?.mainHand ? styles.equipped : styles.notEquipped}>
                    <IonPopover alignment='center' trigger="click-trigger" triggerAction="click">
                      <IonContent>
                        <IonRow class="ion-align-items-stretch" style={{ height: '100%' }}> {/* Ensures row fills parent height */}
                          <IonCol size="8" className="ion-padding">
                            <IonText>
                              {player?.equipment?.mainHand?.name}
                            </IonText>
                            <IonCardSubtitle>
                              {player?.equipment?.mainHand?.grade}
                            </IonCardSubtitle>
                            <IonText>
                              {player?.equipment?.mainHand?.minDamage} - {player?.equipment?.mainHand?.maxDamage}
                            </IonText>
                          </IonCol>
                          <IonCol size="4" style={{ padding: 0 }}>
                            <div style={{ display: 'flex' }}>
                              <IonThumbnail style={{ width: '100%', height: '100%', margin: 0 }}>
                                <IonImg style={{ objectFit: 'cover' }} alt={`A ${player?.equipment?.mainHand?.name} with beautiful details`} src={`/resources/images/weapons/weapon-${player?.equipment?.mainHand?.imgId}.webp`} />
                              </IonThumbnail>
                            </div>
                          </IonCol>
                        </IonRow>
                      </IonContent>
                    </IonPopover>

                  </IonButton>
                  <div className="right-arm-block" style={styles.notEquipped}>
                  </div>
                  <div className="armor-block" style={styles.notEquipped}>
                  </div>
                  <div className="helmet-block" style={styles.notEquipped}>
                  </div>
                  <div className="right-boot-block" style={styles.notEquipped}>

                  </div>
                  <div className="left-boot-block" style={styles.notEquipped}>

                  </div>
                </IonCardContent>
                <IonAccordionGroup>
                  <IonAccordion value="first">
                    <IonItem slot="header" color="light">
                      <IonLabel>Weapons</IonLabel>
                    </IonItem>
                    <div slot="content">
                      <IonList lines='full'>
                        {player?.inventory?.map((weapon: IWeapon, index: number) => {
                          return (
                            <WeaponCard weapon={weapon} initialPlayer={player} key={index} />
                          );
                        })}
                      </IonList>
                    </div>
                  </IonAccordion>
                </IonAccordionGroup>
              </IonCard>

              <IonCard className="ion-padding card-fade">
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
                          <IonIcon icon={add} />
                        </IonButton>
                      </IonCol>

                      <IonCol>
                        <IonText>CON: {player?.con}</IonText>
                      </IonCol>
                      <IonCol>
                        <IonButton disabled={!playerHasPoints} fill="clear" size="small" onClick={() => handleIncreaseStat('con')}>
                          <IonIcon icon={add} />
                        </IonButton>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonText>DEX: {player?.dex}</IonText>
                      </IonCol>
                      <IonCol>
                        <IonButton disabled={!playerHasPoints} fill="clear" size="small" onClick={() => handleIncreaseStat('dex')}>
                          <IonIcon icon={add} />
                        </IonButton>
                      </IonCol>
                      <IonCol>
                        <IonText>INT: {player?.int}</IonText>
                      </IonCol>

                      <IonCol>
                        <IonButton disabled={!playerHasPoints} fill="clear" size="small" onClick={() => handleIncreaseStat('int')}>
                          <IonIcon icon={add} />
                        </IonButton>
                      </IonCol>
                    </IonRow>
                    {/* Add more rows and columns for additional stats as needed */}
                  </IonGrid>
                </IonCardContent>
              </IonCard>
            </React.Fragment>

          ) : <>Loading...</>}
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;
