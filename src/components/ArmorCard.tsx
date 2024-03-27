import { IonCardSubtitle, IonCol, IonGrid, IonImg, IonRow } from "@ionic/react";
import { useContext, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { getCreateArmor } from "../functions/GetCreateArmor";
import { getSaleArmor } from "../functions/GetSaleArmor";
import getWeaponColor from "../functions/GetWeaponColor";
import { IArmor, IPlayer, IShopArmor } from "../types/types";
import ArmorModal from "./ArmorModal";
import './WeaponCard.css';

interface IArmorCardProps {
    armor: IArmor;
    initialPlayer: IPlayer;
    isForSale?: boolean;
}

const Armorcard = ({ armor, isForSale }: IArmorCardProps) => {
    const [showModal, setShowModal] = useState(false);
    const { player, updatePlayerData } = useContext(PlayerContext);

    if (!armor.requirements) {
        console.error("Weapon requirements not found");
        return;
    }

    const checkRequirements = (forPurchase: boolean) => {
        if (forPurchase) {
            const meetsRequirements = player && player.gold >= armor.cost;
            return !!meetsRequirements;
        } else {
            const requirementsToEquip = player && player.str >= armor.requirements.str && player.dex >= armor.requirements.dex
                && player.con >= armor.requirements.con && player.int >= armor.requirements.int;

            return !!requirementsToEquip;
        }
    }

    const purchaseArmor = async (armorToPurchase: IShopArmor) => {
        if (player && armorToPurchase && player.gold >= armorToPurchase.cost) {
            try {


                // Insert the new weapon into the database and retrieve the insertedId
                const insertResult = await getCreateArmor(armorToPurchase);
                const newArmorId = insertResult?._id;

                // If the insert operation was successful, update the player's data
                if (newArmorId) {
                    // Deduct the cost and add the new weapon to the player's inventory
                    const updatedPlayer = {
                        ...player,
                        gold: player.gold - armorToPurchase.cost,
                        inventory: [...player.inventory, { ...insertResult, _id: newArmorId }]
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

    const saleArmor = async (armorToSale: IArmor) => {
        if (player) {
            await getSaleArmor(armorToSale, player, updatePlayerData);
            setShowModal(false);
        }
    }

    const equipArmor = async (armor: IArmor) => {
        // Check if there is an existing weapon in the main hand
        const currentArmor = player?.equipment?.armor;

        if (player && checkRequirements(false)) {
            try {
                // Prepare the new state for the player
                let updatedPlayer: IPlayer = {
                    ...player,
                    equipment: {
                        ...player.equipment,
                        armor: armor, // Equip the new weapon
                    },
                    // Filter out the new weapon from the inventory if it was there, and keep the rest.
                    inventory: player.inventory.filter((invItem: any) => invItem._id !== armor._id),
                };

                // If there was a weapon in the main hand, move it to the inventory
                if (currentArmor) {
                    // Ensure that the weapon being moved to the inventory is not the same as the one being equipped
                    if (currentArmor._id !== armor._id) {
                        updatedPlayer.inventory.push(currentArmor);
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

    // ... your existing return statement in the Armorcard component

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
                                        src={`/images/weapons/weapon-${armor.imgId}.webp`}
                                        alt={`A ${armor.name} with beautiful details`} />
                                </IonCol>

                                {/* Gold Column */}
                                <IonCol size="4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div style={{ color: getWeaponColor(armor.grade), fontSize: '14px', marginBottom: 6 }}>
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
                                        Defense: {armor.defense}
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



                    <ArmorModal
                        equipItem={equipArmor}
                        isForSale={isForSale ?? false}
                        canPurchase={checkRequirements(isForSale ?? false)}
                        purchaseItem={purchaseArmor}
                        saleArmor={saleArmor}
                        showModal={showModal}
                        setShowModal={setShowModal}
                        armor={armor} />
                </>
            ) : <>Loading..</>}

        </>
    );
};

export default Armorcard;
