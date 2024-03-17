import { IonAccordion, IonAccordionGroup, IonBadge, IonButtons, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonImg, IonItem, IonLabel, IonList, IonListHeader, IonMenuButton, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import useWeaponsHook from '../../hooks/UseWeaponsHook';
import { IWeapon } from '../../types/types';
import './Shop.css';
import WeaponCard from '../../components/WeaponCard';
import { PlayerContext, PlayerProvider } from '../../context/PlayerContext';


const Shop = () => {
  const weapons = useWeaponsHook();
  const { player, setPlayer } = useContext(PlayerContext);
  const [weaponsData, setWeaponsData] = useState<IWeapon[]>([]);

  useEffect(() => {
    if (weapons) {
      setWeaponsData(weapons);
    }

    console.log(weapons);
  }, [weapons]);



  return (
    <React.Fragment>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Shop</IonTitle>
          </IonToolbar>
        </IonHeader>

        {player ? (
          <IonContent className="ion-padding">
            <IonImg src="resources/images/Shop.webp" alt="Futuristic looking shop with weapons on the wall and armors on display" className="banner" />
            <IonText>
            <div className="text-overlay">
              <h2><strong>The shop</strong></h2>
              <p>
                Welcome to the training room. Here you can practice your skills and level up your bot.
              </p>
            </div>
          </IonText>
            <IonCard className="ion-padding">
              <IonCardTitle></IonCardTitle>
              <IonCardSubtitle>
                <div style={{ paddingBottom: 16 }}>
                  Gold: <span style={{ color: 'gold' }}>{player.gold}</span> Str: {player.str} Dex: {player.dex}
                </div></IonCardSubtitle>

              <IonCardContent>

                {weaponsData && player ? (
                  <IonAccordionGroup>

                    <IonAccordion value="first">
                      <IonItem slot="header" color="light">
                        <IonLabel>Weapons</IonLabel>
                      </IonItem>
                      <div slot="content">
                        <IonList lines='full'>
                          {weaponsData.map((weapon: IWeapon, index: number) => { // Add type annotations for weapon and index
                            return (
                              <WeaponCard weapon={weapon} initialPlayer={player} key={index} />
                            );
                          })}
                        </IonList>
                      </div>
                    </IonAccordion>
                    <IonAccordion value="second">
                      <IonItem slot="header" color="light">
                        <IonLabel>Armor</IonLabel>
                      </IonItem>
                      <div className="ion-padding" slot="content">
                        Second Content
                      </div>
                    </IonAccordion>
                    <IonAccordion value="third">
                      <IonItem slot="header" color="light">
                        <IonLabel>Boots</IonLabel>
                      </IonItem>
                      <div className="ion-padding" slot="content">
                        Third Content
                      </div>
                    </IonAccordion>
                    <IonAccordion value="fourth">
                      <IonItem slot="header" color="light">
                        <IonLabel>Gloves</IonLabel>
                      </IonItem>
                      <div className="ion-padding" slot="content">
                        Third Content
                      </div>
                    </IonAccordion>
                    <IonAccordion value="fifth">
                      <IonItem slot="header" color="light">
                        <IonLabel>Helmets</IonLabel>
                      </IonItem>
                      <div className="ion-padding" slot="content">
                        Third Content
                      </div>
                    </IonAccordion>
                  </IonAccordionGroup>
                ) : <p>Loading...</p>}

              </IonCardContent>
            </IonCard>


          </IonContent>
        ) : <p>Loading...</p>}

      </IonPage>
    </React.Fragment>
  )
}

export default Shop;