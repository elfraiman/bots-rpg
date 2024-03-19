import { IonBadge, IonButton, IonCol, IonGrid, IonItem, IonModal, IonRow, IonThumbnail } from "@ionic/react";
import { useContext, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { IPlayer, IWeapon } from "../types/types";
import './WeaponCard.css';
import WeaponModal from "./WeaponModal";

interface IWeaponCardProps {
  weapon: IWeapon;
  initialPlayer: IPlayer;
}

const WeaponCard = ({ weapon, initialPlayer }: IWeaponCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const { player, setPlayer, updatePlayerData } = useContext(PlayerContext);


  if (!weapon.requirements) {
    console.error("Weapon requirements not found");
    return;
  }

  const checkRequirements = () => {
      const meetsRequirements = player && player.gold >= weapon.cost && weapon.requirements && player.str >= weapon?.requirements?.str && player.dex >= weapon?.requirements.dex;

      return !!meetsRequirements;
  
  }


  const purchaseItem = async (item: IWeapon) => {
    console.log(player, 'player', initialPlayer);
    if (player && player.gold >= item.cost && item.requirements && player.str >= item?.requirements.str && player.dex >= item.requirements.dex) {
      try {
        await updatePlayerData({ ...player, gold: player.gold - item.cost, equipment: { mainHand: item } });

      } catch (e) {
        console.error(e)
      }

      setShowModal(false);
    } else {
      console.error("Player does not meet the requirements to purchase this item");
    }
  };

  return (
    <>
      {weapon && player ? (
        <>
          <IonItem onClick={() => setShowModal(true)}>
            <IonThumbnail slot="start">
              <img alt={`A ${weapon.name} with beautiful details`} src={`/resources/images/weapons/weapon-${weapon.imgId}.webp`} />
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

          <WeaponModal isForSale={true} canPurchase={checkRequirements()} purchaseItem={purchaseItem}  showModal={showModal} setShowModal={setShowModal} weapon={weapon}/>
        </>
      ) : <>Loading..</>}

    </>
  );
};

export default WeaponCard;
