import { IonBadge, IonCardSubtitle, IonCol, IonGrid, IonImg, IonItem, IonRow, IonThumbnail } from "@ionic/react";
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
          <div onClick={() => setShowModal(true)} style={{padding: 6, borderTop: '1px solid rgba(235, 235, 235, 0.11)', borderBottom: '1px solid rgba(235, 235, 235, 0.11)'}}>
            <IonGrid style={{ width: '100%', padding: 0 }}>
              <IonRow style={{width: '100%'}}>
                {/* Image Column */}
                <IonCol size="3" style={{ padding: 0 }}>
                  <IonImg
                    style={{ width: '100%', height: 'auto' }}
                    src={`/resources/images/weapons/weapon-${weapon.imgId}.webp`}
                    alt={`A ${weapon.name} with beautiful details`} />
                </IonCol>

                {/* Gold Column */}
                <IonCol size="4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ color: getWeaponColor(weapon.grade), fontSize: '14px', marginBottom: 6 }}>
                    {weapon.name}
                  </div>

                  <span style={{}}>
                    Price:  <span style={{ color: 'gold' }}> {weapon.cost.toLocaleString()} G</span>
                  </span>


                </IonCol>

                {/* Requirements Column */}
                <IonCol size="5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '14px', color: 'white' }}>
                    Damage: {weapon.minDamage}-{weapon.maxDamage}
                  </div>
                  <span style={{ fontSize: '12px' }}>
                    Stats required:
                  </span>

                  <IonCardSubtitle style={{ fontSize: '12px' }}>
                    DEX: <span style={{ color: player?.dex >= weapon.requirements.dex ? 'green' : 'red', marginRight: 6 }}>
                      {weapon.requirements.dex}
                    </span>

                    STR: <span style={{ color: player?.str >= weapon.requirements.str ? 'green' : 'red', }}>
                      {weapon.requirements.str}
                    </span>
                  </IonCardSubtitle>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>




          <WeaponModal presentingElement={presentingElement} isForSale={isForSale ?? false} canPurchase={checkRequirements()} purchaseItem={purchaseItem} showModal={showModal} setShowModal={setShowModal} weapon={weapon} />
        </>
      ) : <>Loading..</>}

    </>
  );
};

export default WeaponCard;
