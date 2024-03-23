import { IonBadge, IonCardSubtitle, IonCol, IonGrid, IonItem, IonRow, IonThumbnail } from "@ionic/react";
import { useContext, useEffect, useRef, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { IPlayer, IWeapon } from "../types/types";
import './WeaponCard.css';
import WeaponModal from "./WeaponModal";
import getWeaponColor from "../functions/GetWeaponColor";

interface IWeaponCardProps {
  weapon: IWeapon;
  initialPlayer: IPlayer;
  isForSale?: boolean;
}

const WeaponCard = ({ weapon, initialPlayer, isForSale }: IWeaponCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const { player, setPlayer, updatePlayerData } = useContext(PlayerContext);
  const [presentingElement, setPresentingElement] = useState<HTMLElement | null>(null);
  const page = useRef(null);

  useEffect(() => {
    setPresentingElement(page.current);
  }, []);


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
            <IonGrid >
              <IonRow >
                <IonCol>
                  <IonBadge color={player?.gold > weapon.cost ? "success" : "danger"}>{weapon.cost} Gold</IonBadge>
                </IonCol>
                <IonCol>
                  <span style={{color: getWeaponColor(weapon.grade), fontSize: 14}}>{weapon.name}</span>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol>
                <span style={{fontSize: 12}}>Damage: </span>
                <IonCardSubtitle>{weapon.minDamage}-{weapon.maxDamage}</IonCardSubtitle>
                </IonCol>
                <IonCol>
                  <span style={{fontSize: 12}}>Stats required:</span> 
                  <IonCardSubtitle style={{fontSize: 12}}>
                    DEX: <span style={{ color: player?.dex >= weapon?.requirements?.dex ? 'green' : 'red' }}>{weapon.requirements?.dex}</span> STR: <span style={{ color: player?.str >= weapon?.requirements?.str ? 'green' : 'red' }}>{weapon.requirements?.str}</span>
                  </IonCardSubtitle>
                </IonCol>
              </IonRow>

            </IonGrid>
          </IonItem>

          <WeaponModal presentingElement={presentingElement} isForSale={isForSale ?? false} canPurchase={checkRequirements()} purchaseItem={purchaseItem} showModal={showModal} setShowModal={setShowModal} weapon={weapon} />
        </>
      ) : <>Loading..</>}

    </>
  );
};

export default WeaponCard;
