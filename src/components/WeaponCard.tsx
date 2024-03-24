import { IonCardSubtitle, IonCol, IonGrid, IonImg, IonRow } from "@ionic/react";
import { useContext, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import getWeaponColor from "../functions/GetWeaponColor";
import { IPlayer, IWeapon } from "../types/types";
import './WeaponCard.css';
import WeaponModal from "./WeaponModal";

interface IWeaponCardProps {
  weapon: IWeapon;
  initialPlayer: IPlayer;
  isForSale?: boolean;
}

const WeaponCard = ({ weapon, initialPlayer, isForSale }: IWeaponCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const { player, setPlayer, updatePlayerData } = useContext(PlayerContext);



  if (!weapon.requirements) {
    console.error("Weapon requirements not found");
    return;
  }

  const checkRequirements = (forPurchase: boolean) => {
    if (forPurchase) {
      const meetsRequirements = player && player.gold >= weapon.cost && weapon.requirements && player.str >= weapon?.requirements?.str && player.dex >= weapon?.requirements.dex;
      return !!meetsRequirements;
    } else {
      const requirementsToEquip = player && player.str >= weapon.requirements.str && player.dex >= weapon.requirements.dex
        && player.con >= weapon.requirements.con && player.int >= weapon.requirements.int;

      return !!requirementsToEquip;
    }
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
  const equipItem = async (item: IWeapon) => {
    // Check if there is an existing weapon in the main hand
    const currentMainHand = player?.equipment?.mainHand;

    if (player && checkRequirements(false)) {
      try {
        // Prepare the new state for the player
        let updatedPlayer: IPlayer = {
          ...player,
          equipment: {
            ...player.equipment,
            mainHand: item, // Equip the new weapon
          },
          // Filter out the new weapon from the inventory if it was there, and keep the rest.
          inventory: player.inventory.filter(invItem => invItem._id !== item._id),
        };

        // If there was a weapon in the main hand, move it to the inventory
        if (currentMainHand) {
          // Ensure that the weapon being moved to the inventory is not the same as the one being equipped
          if (currentMainHand._id !== item._id) {
            updatedPlayer.inventory.push(currentMainHand);
          }
        }

        // Call the function to update the player data
        await updatePlayerData(updatedPlayer);

        // Optionally, you can have a success message or log here
      } catch (e) {
        console.error(e);
        // Optionally, handle the error (e.g., show an error message to the user)
      }
    } else {
      console.error("Player does not meet the requirements to equip this item");
      // Optionally, handle the error (e.g., show an error message to the user)
    }
  };


  // ... your existing return statement in the WeaponCard component

  return (
    <>
      {weapon && player ? (
        <>
          <div onClick={() => setShowModal(true)} style={{ padding: 6, borderTop: '1px solid rgba(235, 235, 235, 0.11)', borderBottom: '1px solid rgba(235, 235, 235, 0.11)' }}>
            <IonGrid style={{ width: '100%', padding: 0 }}>
              <IonRow style={{ width: '100%' }}>
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



          <WeaponModal
            equipItem={equipItem}
            isForSale={isForSale ?? false}
            canPurchase={checkRequirements(isForSale ?? false)}
            purchaseItem={purchaseItem}
            showModal={showModal}
            setShowModal={setShowModal}
            weapon={weapon} />
        </>
      ) : <>Loading..</>}

    </>
  );
};

export default WeaponCard;
