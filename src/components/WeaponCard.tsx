import { IonCardSubtitle, IonCol, IonGrid, IonImg, IonRow } from "@ionic/react";
import { useContext, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { getCreateWeapon } from "../functions/GetCreateWeapon";
import getWeaponColor from "../functions/GetWeaponColor";
import { IPlayer, IWeapon } from "../types/types";
import './WeaponCard.css';
import WeaponModal from "./WeaponModal";
import { getSaleWeapon } from "../functions/GetSaleWeapon";

interface IWeaponCardProps {
  weapon: IWeapon;
  initialPlayer: IPlayer;
  isForSale?: boolean;
}

const WeaponCard = ({ weapon, isForSale }: IWeaponCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const { player, updatePlayerData } = useContext(PlayerContext);



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

  const purchaseItem = async (itemToPurchase: IWeapon) => {
    if (player && player.gold >= itemToPurchase.cost && itemToPurchase.requirements &&
      player.str >= itemToPurchase.requirements.str && player.dex >= itemToPurchase.requirements.dex) {
      try {


        // Insert the new weapon into the database and retrieve the insertedId
        const insertResult = await getCreateWeapon(itemToPurchase);
        const newWeaponId = insertResult?._id;

        // If the insert operation was successful, update the player's data
        if (newWeaponId) {
          // Deduct the cost and add the new weapon to the player's inventory
          const updatedPlayer = {
            ...player,
            gold: player.gold - itemToPurchase.cost,
            inventory: [...player.inventory, { ...insertResult, _id: newWeaponId }]
          };

          // Update the player's data in the database
          await updatePlayerData(updatedPlayer);

          // Close the modal
          setShowModal(false);
        } else {
          throw new Error("Failed to insert the new weapon into the database.");
        }

      } catch (e) {
        console.error("An error occurred while purchasing the item: ", e);
      }
    } else {
      console.error("Player does not meet the requirements to purchase this item");
    }
  };

  const saleItem = async (itemToSale: IWeapon) => {
    if (player && itemToSale) {
      await getSaleWeapon(itemToSale, player, updatePlayerData);
      setShowModal(false);
    }
  }


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
          inventory: player.inventory.filter((invItem: any) => invItem._id !== item._id),
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
    setShowModal(false);
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


                  {isForSale ? (<span>
                    Cost:<span style={{ color: 'gold' }}> {weapon.cost.toLocaleString()} G</span>
                  </span>
                  ) : (
                    <span>
                      Sale: <span style={{ color: 'gold' }}> {(weapon.cost / 2).toLocaleString()} G</span>
                    </span>
                  )}


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
            saleItem={saleItem}
            showModal={showModal}
            setShowModal={setShowModal}
            weapon={weapon} />
        </>
      ) : <>Loading..</>}

    </>
  );
};

export default WeaponCard;
