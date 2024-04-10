import { IonCol, IonGrid, IonImg, IonRow, IonSpinner } from "@ionic/react";
import { useContext, useState } from 'react';
import toast from "react-hot-toast";
import * as Realm from 'realm-web';
import { PlayerContext } from '../context/PlayerContext';
import { GetCreatePlayerOwnedEquipment } from "../functions/GetCreatePlayerOwnedEquipment";
import getItemGradeColor from "../functions/GetItemGradeColor";
import { GetPlayerOwnedEquipment } from "../functions/GetPlayerOwnedEquipment";
import { GetSellPlayerEquipment } from "../functions/GetSellPlayerEquipment";
import { IEquipment, IPlayer } from "../types/types";
import EquipmentModal from "./EquipmentModal";

interface IEquipmentCardProps {
  equipment: IEquipment;
  isForSell: boolean;
}

const EquipmentCard = ({ equipment: equipment, isForSell }: IEquipmentCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const { player, updatePlayerData } = useContext(PlayerContext);
  const [loading, setLoading] = useState(false);

  const checkRequirements = () => {
    if (!player) return false;
    if (isForSell) {
      return player.gold >= equipment.cost;
    }
    if (!equipment.requirements) return false;
    return player.str >= equipment.requirements.str && player.dex >= equipment.requirements.dex &&
      player.con >= equipment.requirements.con && player.int >= equipment.requirements.int;
  };

  const handleArmorAction = async () => {
    if (!player) return;
    if (isForSell) {
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

  const sellEquipment = async (equipmentToSell: IEquipment) => {
    setLoading(true);
    try {
      if (!player) return;
      await GetSellPlayerEquipment(equipmentToSell, player, updatePlayerData);
      toast(`Gold + ${equipmentToSell.cost / 2}`,
        {
          icon: '🪙',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
      setLoading(false);
      setShowModal(false);
    } catch (e) {
      console.error("An error occurred while selling the armor: ", e);
    }

  };

  const equipItem = async (itemId: Realm.BSON.ObjectId) => {
    if (!player) return;
    const canEquip = checkRequirements();
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
        <div onClick={() => setShowModal(true)} style={{ height: '100%', borderTop: '1px solid rgba(235, 235, 235, 0.11)', borderBottom: '1px solid rgba(235, 235, 235, 0.11)' }}>
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
                <IonCol size="4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 6 }}>
                  <div style={{ color: getItemGradeColor(equipment.grade), fontSize: '14px', marginBottom: 6 }}>
                    {equipment.name}
                  </div>

                  {isForSell ? (<span>
                    Cost:<span style={{ color: 'gold' }}> {equipment.cost.toLocaleString()} 🪙</span>
                  </span>
                  ) : (
                    <span>
                      Sell: <span style={{ color: 'gold' }}> {(equipment.cost / 2).toLocaleString()} 🪙</span>
                    </span>
                  )}
                </IonCol>

                {/* Requirements Column */}
                <IonCol size="5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', padding: 6 }}>
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

                  <IonCol >
                    {/* <span style={{ color: checkRequirements() ? 'green' : 'red', }}>
                      {checkRequirements() ? "Yes" : "No"}
                    </span> */}

                    <IonRow style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <span style={{ marginRight: 3 }}>
                        STR:<span style={{ color: player?.str >= equipment.requirements.str ? 'green' : 'red' }}>
                          {equipment.requirements.str}
                        </span>
                      </span>

                      <span>
                        DEX: <span style={{ color: player?.dex >= equipment.requirements.dex ? 'green' : 'red', }}>
                          {equipment.requirements.dex}
                        </span>
                      </span>
                    </IonRow>
                    <IonRow style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <span style={{ marginRight: 3 }}>
                        CON: <span style={{ color: player?.con >= equipment.requirements.con ? 'green' : 'red' }}>
                          {equipment.requirements.con}
                        </span>
                      </span>

                      <span>
                        INT: <span style={{ color: player?.int >= equipment.requirements.int ? 'green' : 'red' }}>
                          {equipment.requirements.int}
                        </span>
                      </span>
                    </IonRow>

                  </IonCol>

                </IonCol>
              </IonRow>
            </IonGrid>
          )}
        </div>
      )}

      <EquipmentModal
        equipItem={() => handleArmorAction()}
        isForSell={isForSell}
        checkRequirements={checkRequirements()}
        purchaseItem={() => handleArmorAction()}
        sellItem={() => sellEquipment(equipment)}
        showModal={showModal}
        setShowModal={setShowModal}
        loading={loading}
        player={player as IPlayer}
        imgString={`/images/${equipment.type}/${equipment.type}-${equipment.imgId}.webp`}
        item={equipment}
      />
    </>
  );
};

export default EquipmentCard;
