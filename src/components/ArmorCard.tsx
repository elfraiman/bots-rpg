import { IonCardSubtitle, IonCol, IonGrid, IonImg, IonRow, useIonToast } from "@ionic/react";
import { useContext, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { GetCreatePlayerEquipment } from "../functions/GetCreatePlayerEquipment";
import { GetSalePlayerEquipment } from "../functions/GetSalePlayerEquipment";
import getItemGradeColor from "../functions/GetWeaponColor";
import { IArmor, IPlayerOwnedArmor, IPlayer, IWeapon, IEquipment } from "../types/types";
import ItemModal from "./ItemModal";
import './WeaponCard.css';
import { GetPlayerOwnedEquipment } from "../functions/GetPlayerOwnedEquipment";
import * as Realm from 'realm-web';

interface IArmorCardProps {
  armor: IEquipment | IPlayerOwnedArmor;
  initialPlayer: IPlayer;
  isForSale: boolean;
}

const ArmorCard = ({ armor, isForSale }: IArmorCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const { player, updatePlayerData } = useContext(PlayerContext);
  const [present] = useIonToast();

  if (!armor) {
    console.error("No Armor");
    return;
  }

  const checkRequirements = (forPurchase: boolean) => {
    if (forPurchase) {
      return player && player.gold >= armor.cost ? true : false;
    } else if (armor.requirements) {
      return player &&
        player.str >= armor?.requirements?.str &&
        player.dex >= armor.requirements.dex &&
        player.con >= armor.requirements.con &&
        player.int >= armor.requirements.int ? true : false;
    } else {
      return false;
    }
  }

  const purchaseArmor = async (armorToPurchase: IArmor) => {
    if (player && armorToPurchase && player.gold >= armorToPurchase.cost) {
      try {

        // Insert the new weapon into the database and retrieve the insertedId
        const playerEquipment = await GetCreatePlayerEquipment(player, armorToPurchase);

        // If the insert operation was successful, update the player's data
        if (playerEquipment) {
          // Deduct the cost and add the new weapon to the player's inventory
          const updatedPlayer = {
            ...player,
            gold: player.gold - armorToPurchase.cost,
            inventory: [...player.inventory, playerEquipment?._id]
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

  const saleArmor = async (armorToSale: IPlayerOwnedArmor) => {
    if (player) {
      await GetSalePlayerEquipment(armorToSale, player, updatePlayerData);
      present({ message: `Gold + ${armorToSale.cost / 2}`, color: 'primary', duration: 1500 });
      setShowModal(false);
    }
  }

  const equipItem = async (itemId: Realm.BSON.ObjectId) => {
    if (!player) return;

    try {
      // Fetches the IPlayerItem reference for the item
      const playerEquipmentItem = await GetPlayerOwnedEquipment(player._id, itemId);

      if (!playerEquipmentItem) {
        console.error("Item to equip not found in player's inventory");
        return;
      }

      // Assuming GetPlayerOwnedEquipment also provides the itemType, e.g., 'armor', 'helmet', 'boots'
      const { itemType } = playerEquipmentItem;

      // Prepare the updated equipment object and determine the correct slot
      let updatedEquipment = { ...player.equipment };

      // Determine the equipment slot based on the item type
      const equipmentSlot = itemType === 'armor' ? 'armor' :
        itemType === 'helmet' ? 'helmet' :
          itemType === 'boots' ? 'boots' : itemType === 'weapon' ? 'weapon' : null;

      if (!equipmentSlot) {
        console.error("Unknown item type. Cannot equip.");
        return;
      }

      // If there is currently an item equipped in the slot, move it back to inventory
      //
      if (updatedEquipment[equipmentSlot]) {
        player.inventory.push(updatedEquipment[equipmentSlot] as any);
      }

      // Update the player's equipment with the new item
      updatedEquipment[equipmentSlot] = itemId;

      // Remove the newly equipped item from the inventory
      const updatedInventory = player.inventory.filter((item: Realm.BSON.ObjectId) => item.toString() !== itemId.toString());

      // Prepare the new state for the player
      let updatedPlayer: IPlayer = {
        ...player,
        equipment: updatedEquipment,
        inventory: updatedInventory
      };

      // Update the player's data in the database
      await updatePlayerData(updatedPlayer);

      // Close the modal if applicable
      setShowModal && setShowModal(false);
    } catch (e) {
      console.error("An error occurred while equipping the item: ", e);
      // Optionally, handle the error (e.g., show an error message to the user)
    }
  };


  return (
    <>
      {armor && player ? (
        <>
          <div onClick={() => setShowModal(true)} style={{ padding: 6, borderTop: '1px solid rgba(235, 235, 235, 0.11)', borderBottom: '1px solid rgba(235, 235, 235, 0.11)' }}>
            <IonGrid style={{ width: '100%', padding: 0 }}>
              <IonRow style={{ width: '100%' }}>
                {/* Image Column */}
                <IonCol size="3" style={{ padding: 0 }}>
                  <IonImg
                    style={{ width: '100%', height: 'auto' }}
                    src={`/images/${armor.type}/${armor.type}-${armor.imgId}.webp`}
                    alt={`A ${armor.name} with beautiful details`} />
                </IonCol>

                {/* Gold Column */}
                <IonCol size="4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ color: getItemGradeColor(armor.grade), fontSize: '14px', marginBottom: 6 }}>
                    {armor.name}
                  </div>


                  {isForSale ? (<span>
                    Cost:<span style={{ color: 'gold' }}> {armor.cost.toLocaleString()} G</span>
                  </span>
                  ) : (
                    <span>
                      Sale: <span style={{ color: 'gold' }}> {(armor.cost / 2).toLocaleString()} G</span>
                    </span>
                  )}


                </IonCol>

                {/* Requirements Column */}
                <IonCol size="5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '14px', color: 'white' }}>
                    {armor.type !== "weapon" ? (
                      <>
                        DP: {armor?.stats?.defense}
                        Evasion: {armor?.stats?.evasion}
                      </>
                    ) : (
                      <>
                        AP: {armor?.stats?.minAttack} ~ {armor?.stats?.maxAttack}
                      </>)}

                  </div>
                  <span style={{ fontSize: '12px' }}>
                    Stats required:
                  </span>

                  <IonCardSubtitle style={{ fontSize: '12px' }}>
                    DEX: <span style={{ color: player?.dex >= armor.requirements.dex ? 'green' : 'red', marginRight: 6 }}>
                      {armor.requirements.dex}
                    </span>

                    STR: <span style={{ color: player?.str >= armor.requirements.str ? 'green' : 'red', }}>
                      {armor.requirements.str}
                    </span>
                  </IonCardSubtitle>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>



          <ItemModal
            equipItem={equipItem}
            isForSale={isForSale ?? false}
            canPurchase={checkRequirements(isForSale)}
            purchaseItem={purchaseArmor}
            saleItem={saleArmor}
            showModal={showModal}
            setShowModal={setShowModal}
            imgString={`/images/${armor.type}/${armor.type}-${armor.imgId}.webp`}
            item={armor} />
        </>
      ) : <>Loading..</>}

    </>
  );
};

export default ArmorCard;
