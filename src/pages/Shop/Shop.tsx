import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import useWeaponsHook from '../../hooks/UseWeaponsHook.tsx';
import { IWeapon } from '../../types/schemas';
import './Shop.css';


const Shop = () => {
  const weapons = useWeaponsHook();
  const [weaponsData, setWeaponsData] = useState<IWeapon[]>([]);



  useEffect(() => {
    if (weapons) {
      setWeaponsData(weapons);
    }
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

        <IonContent className="ion-padding">
          <IonText>
            <p>Welcome to <strong>the Shop</strong></p>
          </IonText>
        </IonContent>
      </IonPage>
    </React.Fragment>
  )
}

export default Shop;