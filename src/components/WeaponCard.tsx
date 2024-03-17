import React, { useContext, useState } from 'react';
import { IonAlert, IonBadge, IonButton, IonCol, IonGrid, IonItem, IonLabel, IonModal, IonRow, IonThumbnail } from "@ionic/react";
import { IPlayer, IWeapon } from "../types/schemas";
import UsePurchaseItem from '../hooks/PurchaseItem';
import { PlayerContext, PlayerProvider, usePlayer } from '../context/PlayerContext';

interface IWeaponCardProps {
  weapon: IWeapon;
  initialPlayer: IPlayer;
}

const InnerWeaponCard = ({ weapon, initialPlayer }: IWeaponCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const { player, setPlayer } = useContext(PlayerContext);


  if (!weapon.requirements) {
    console.error("Weapon requirements not found");
    return;
  }


  const purchaseItem = async (item: IWeapon) => {
    console.log(player, 'player', initialPlayer);
    
    if (player) {
      const updatedPlayer = await UsePurchaseItem({ item, player });
      if (updatedPlayer) {
        setPlayer(updatedPlayer); // This now correctly handles the updated player object
      } else {
        // Handle the case where the purchase operation failed or didn't return a player
        console.error("Failed to update player or player data was not returned.");
      }
      setShowModal(false);
    } else {
      setPlayer(initialPlayer)
    }
  };

  return (
    <>
      {weapon ? (
        <>
          <IonItem onClick={() => setShowModal(true)}>
            <IonThumbnail slot="start">
              <img alt={`A ${weapon.name} with beautiful details`} src={`../../resources/images/weapons/${weapon._id}.webp`} />
            </IonThumbnail>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonBadge color={player?.gold > weapon.cost ? "primary" : "danger"}>{weapon.cost} Gold</IonBadge>
                </IonCol>
                <IonCol>
                  {weapon.name}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  Damage: {weapon.minDamage}-{weapon.maxDamage}
                </IonCol>
                <IonCol>
                  DEX <span style={{ color: player?.dex >= weapon?.requirements?.dex ? 'green' : 'red' }}>{weapon.requirements?.dex}</span> STR <span style={{ color: player?.str >= weapon?.requirements?.str ? 'green' : 'red' }}>{weapon.requirements?.str}</span>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>

          <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
            <img alt={`A ${weapon.name} with beautiful details`} src={`../../resources/images/weapons/${weapon._id}.webp`} style={{ width: '100%' }} />
            <IonGrid>
              <IonRow>
                <IonCol>
                  <h2>{weapon.name}</h2>
                  <p>Cost: {weapon.cost} Gold</p>
                  <p>Damage: {weapon.minDamage}-{weapon.maxDamage}</p>
                  <p>Requirements: DEX {weapon?.requirements?.dex}, STR {weapon?.requirements?.str}</p>
                  <IonButton onClick={() => purchaseItem(weapon)}>Confirm Purchase</IonButton>
                  <IonButton onClick={() => setShowModal(false)}>Cancel</IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonModal>
        </>
      ) : <>Loading..</>}

    </>
  );
};

const WeaponCard = ({ weapon, initialPlayer }: IWeaponCardProps) => {
  return (
    <PlayerProvider>
      <InnerWeaponCard weapon={weapon} initialPlayer={initialPlayer} />
    </PlayerProvider>
  );
}

export default WeaponCard;
