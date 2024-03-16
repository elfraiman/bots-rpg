import { IonAccordion, IonAccordionGroup, IonBadge, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonMenuButton, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import useWeaponsHook from '../../hooks/UseWeaponsHook.tsx';
import { IWeapon } from '../../types/schemas';
import './Shop.css';
import WeaponCard from '../../components/WeaponCard.js';
import usePlayerHook from '../../hooks/UsePlayerHook.js';


const Shop = () => {
  const weapons = useWeaponsHook();
  const player = usePlayerHook();
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
            <IonText>
              <p>Welcome to <strong>the Shop</strong></p>
              <div style={{paddingBottom: 16}}>
                Gold: <span style={{ color: 'gold' }}>{player.gold}</span> Str: {player.str} Dex: {player.dex}
              </div>
            </IonText>
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
                          <WeaponCard weapon={weapon} player={player} key={index} />
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

          </IonContent>
        ) : <p>Loading...</p>}

      </IonPage>
    </React.Fragment>
  )
}

export default Shop;