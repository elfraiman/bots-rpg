import { IonCardSubtitle, IonCol, IonGrid, IonImg, IonRow, IonSpinner, useIonToast } from "@ionic/react";
import { useContext, useState } from 'react';
import * as Realm from 'realm-web';
import { PlayerContext } from '../context/PlayerContext';
import { GetCreatePlayerOwnedEquipment } from "../functions/GetCreatePlayerOwnedEquipment";
import { GetPlayerOwnedEquipment } from "../functions/GetPlayerOwnedEquipment";
import { GetSalePlayerEquipment } from "../functions/GetSalePlayerEquipment";
import GetItemGradeColor from "../functions/GetItemGradeColor";
import { IEquipment, IPlayer } from "../types/types";
import EquipmentModal from "./EquipmentModal";


interface IEquipmentCardProps {
  equipment: IEquipment;
  isForSale: boolean;
}

const EquipmentCard = ({ equipment: equipment, isForSale }: IEquipmentCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const { player, updatePlayerData } = useContext(PlayerContext);
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const checkRequirements = () => {
    if (!player) return false;
    if (isForSale) {
      return player.gold >= equipment.cost;
    }
    if (!equipment.requirements) return false;
    return player.str >= equipment.requirements.str && player.dex >= equipment.requirements.dex &&
      player.con >= equipment.requirements.con && player.int >= equipment.requirements.int;
  };

  const handleArmorAction = async () => {
    if (!player) return;
    if (isForSale) {
      await purchaseEquipment(equipment as IEquipment);
    } else {
      await equipItem(equipment._id);
    }
  };

  const purchaseEquipment = async (equipmentToPurchase: IEquipment) => {
    try {
      if (!player) return;
      const playerEquipment = await GetCreatePlayerOwnedEquipment(player, equipmentToPurchase);
      if (!playerEquipment) throw new Error("Failed to insert the new armor into the database.");
      updatePlayerData({
        ...player,
        gold: player.gold - equipmentToPurchase.cost,
        equipmentInventory: [...player.equipmentInventory, playerEquipment._id]
      });
      setShowModal(false);
    } catch (e) {
      console.error("An error occurred while purchasing the armor: ", e);
    }
  };

  const saleEquipment = async (equipmentToSale: IEquipment) => {
    setLoading(true);
    try {
      if (!player) return;
      await GetSalePlayerEquipment(equipmentToSale, player, updatePlayerData);
      present({ message: `Gold + ${equipmentToSale.cost / 2}`, color: 'primary', duration: 1500 });
      setLoading(false);
      setShowModal(false);
    } catch (e) {
      console.error("An error occurred while selling the armor: ", e);
    }

  };


  const equipItem = async (itemId: Realm.BSON.ObjectId) => {
    if (!player) return;
    setLoading(true);

    try {
      // Fetches the IPlayerEquipment reference for the item
      // reason for this is that the player owned equipments are unique and 
      // separate from the list of armors and weapons.
      // 
      const playerEquipmentItem = await GetPlayerOwnedEquipment(player._id, itemId);

      if (!playerEquipmentItem) {
        console.error("Item to equip not found in player's inventory");
        return;
      }

      // And equipment type can be armor, weapon, helmet, boots.
      //
      const { itemType } = playerEquipmentItem;

      // Prepare the updated equipment object and determine the correct slot
      //
      let updatedEquipment = { ...player.equipment };

      // Determine the equipment slot based on the item type
      //
      const equipmentSlot = itemType === 'armor' ? 'armor' :
        itemType === 'helmet' ? 'helmet' :
          itemType === 'boots' ? 'boots' : itemType === 'weapon' ? 'weapon' : null;

      // Make sure the slot is one that we know
      //
      if (!equipmentSlot) {
        console.error("Unknown item type. Cannot equip.");
        return;
      }

      // If there is currently an item equipped in the slot, move it back to inventory
      // because we are equipping a new one
      //
      if (updatedEquipment[equipmentSlot]) {
        player.equipmentInventory.push(updatedEquipment[equipmentSlot] as any);
      }

      // Update the player's equipment with the new item
      //
      updatedEquipment[equipmentSlot] = itemId;

      // Remove the newly equipped item from the inventory
      //
      const updatedEquipmentInventory = player.equipmentInventory.filter((item: Realm.BSON.ObjectId) => item.toString() !== itemId.toString());

      // Prepare the new state for the player
      //
      const updatedPlayer: IPlayer = {
        ...player,
        equipment: updatedEquipment,
        equipmentInventory: updatedEquipmentInventory
      };

      // Update the player's data in the database
      //
      await updatePlayerData(updatedPlayer);

      // Close the modal if applicable
      //
      setShowModal && setShowModal(false);
    } catch (e) {
      console.error("An error occurred while equipping the item: ", e);
      // Optionally, handle the error (e.g., show an error message to the user)
    }
    setLoading(false);
  };

  return (
    <>
      {equipment && player && (
        <div onClick={() => setShowModal(true)} style={{ padding: 6, borderTop: '1px solid rgba(235, 235, 235, 0.11)', borderBottom: '1px solid rgba(235, 235, 235, 0.11)' }}>
          {loading ? <IonSpinner /> : (
            <IonGrid style={{ width: '100%', padding: 0 }}>
              <IonRow style={{ width: '100%' }}>
                {/* Image Column */}
                <IonCol size="3" style={{ padding: 0 }}>
                  <IonImg
                    style={{ width: '100%', height: 'auto' }}
                    src={`/images/${equipment.type}/${equipment.type}-${equipment.imgId}.webp`}
                    alt={`A ${equipment.name} with beautiful details`} />
                </IonCol>

                {/* Gold Column */}
                <IonCol size="4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ color: GetItemGradeColor(equipment.grade), fontSize: '14px', marginBottom: 6 }}>
                    {equipment.name}
                  </div>

                  {isForSale ? (<span>
                    Cost:<span style={{ color: 'gold' }}> {equipment.cost.toLocaleString()} G</span>
                  </span>
                  ) : (
                    <span>
                      Sale: <span style={{ color: 'gold' }}> {(equipment.cost / 2).toLocaleString()} G</span>
                    </span>
                  )}
                </IonCol>

                {/* Requirements Column */}
                <IonCol size="5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '14px', color: 'white' }}>
                    {equipment.type !== "weapon" ? (
                      <>
                        DP: {equipment?.stats?.defense}
                        Evasion: {equipment?.stats?.evasion}
                      </>
                    ) : (
                      <>
                        AP: {(equipment as IEquipment)?.stats?.minAttack} ~ {(equipment as IEquipment)?.stats?.maxAttack}
                      </>)}
                  </div>

                  <span style={{ fontSize: '12px' }}>
                    Stats required:
                  </span>

                  <IonCardSubtitle style={{ fontSize: '12px' }}>
                    DEX: <span style={{ color: player?.dex >= equipment.requirements.dex ? 'green' : 'red', marginRight: 6 }}>
                      {equipment.requirements.dex}
                    </span>

                    STR: <span style={{ color: player?.str >= equipment.requirements.str ? 'green' : 'red', }}>
                      {equipment.requirements.str}
                    </span>
                  </IonCardSubtitle>
                </IonCol>
              </IonRow>
            </IonGrid>
          )}
        </div>
      )}

      <EquipmentModal
        equipItem={() => handleArmorAction()}
        isForSale={isForSale}
        canPurchase={checkRequirements()}
        purchaseItem={() => handleArmorAction()}
        saleItem={() => saleEquipment(equipment)}
        showModal={showModal}
        setShowModal={setShowModal}
        loading={loading}
        imgString={`/images/${equipment.type}/${equipment.type}-${equipment.imgId}.webp`}
        item={equipment}
      />
    </>
  );
};

export default EquipmentCard;
