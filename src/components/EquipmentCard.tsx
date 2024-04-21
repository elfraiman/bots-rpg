import { IonCol, IonGrid, IonImg, IonRow, IonSpinner } from "@ionic/react";
import { useContext, useState } from 'react';
import toast from "react-hot-toast";
import * as Realm from 'realm-web';
import { PlayerContext } from '../context/PlayerContext';
import { GetCreatePlayerOwnedEquipment } from "../functions/GetCreatePlayerOwnedEquipment";
import { getItemGradeColor } from "../functions/GetColor";
import { getPlayerOwnedEquipment } from "../functions/GetPlayerOwnedEquipment";
import { SellPlayerEquipment } from "../functions/GetSellPlayerEquipment";
import { IEquipment, IPlayer } from "../types/types";
import EquipmentModal from "./EquipmentModal";
import { BASE_EQUIPMENT_SALE_PRICE } from "../types/stats";

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
    setLoading(true);
    try {
      if (!player) return;
      await GetCreatePlayerOwnedEquipment(player, equipmentToPurchase, updatePlayerData);
      toast.success(`${equipmentToPurchase.name}`,
        {
          style: {
            borderRadius: 0,
            background: 'black',
            color: getItemGradeColor(equipmentToPurchase.grade ?? 'common'),
          },
        },
      );
      setShowModal(false);
    } catch (e) {
      console.error("An error occurred while purchasing the armor: ", e);
    }
    setLoading(false);
  };

  const sellEquipment = async (equipmentToSell: IEquipment) => {
    setLoading(true);
    try {
      if (!player) return;
      const sold = await SellPlayerEquipment(equipmentToSell, player, updatePlayerData);

      if (sold) {
        toast.success(`${sold} 🪙`,
          {
            style: {
              borderRadius: 0,
              background: 'black',
              color: getItemGradeColor(equipmentToSell.grade ?? 'common'),
            },
          }
        );
        setLoading(false);
        setShowModal(false);
      }

    } catch (e) {
      console.error("An error occurred while selling the armor: ", e);
      toast.error(`Failed to sell ${equipmentToSell.name}`,
        {
          style: {
            borderRadius: 0,
            background: 'black',
            color: '#fff',
          },
        }
      );
    }

  };

  const equipItem = async (itemId: Realm.BSON.ObjectId) => {
    if (!player) return;
    const canEquip = checkRequirements();
    if (!canEquip) return;
    setLoading(true);

    try {
      // Fetches the IPlayerEquipment reference for the item
      // reason for this is that the player owned equipments are unique and
      // separate from the list of armors and weapons.
      //
      const playerEquipmentItem = await getPlayerOwnedEquipment(player._id, itemId);

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
        <div className="quick-fade-in" onClick={() => setShowModal(true)} style={{ height: '100%', borderTop: '1px solid rgba(235, 235, 235, 0.11)', borderBottom: '1px solid rgba(235, 235, 235, 0.11)' }}>
          {loading ? <IonSpinner /> : (
            <IonGrid style={{ width: '100%', height: '100%', padding: 0 }}>
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
                      Sell: <span style={{ color: 'gold' }}> {(Math.round(equipment.cost * (1 - BASE_EQUIPMENT_SALE_PRICE))).toLocaleString()} 🪙</span>
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
