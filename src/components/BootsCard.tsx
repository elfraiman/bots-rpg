import { IonCardSubtitle, IonCol, IonGrid, IonImg, IonRow } from "@ionic/react";
import { useContext, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { getCreateBoots } from "../functions/GetCreateBoots";
import { getSaleBoots } from "../functions/GetSaleBoots";
import getItemGradeColor from "../functions/GetWeaponColor";
import { IBoots, IPlayer, IShopBoots } from "../types/types";
import ItemModal from "./ItemModal";
import './WeaponCard.css';

interface IBootsCardProps {
    boots: IBoots;
    initialPlayer: IPlayer;
    isForSale?: boolean;
}

const BootsCard = ({ boots, isForSale }: IBootsCardProps) => {
    const [showModal, setShowModal] = useState(false);
    const { player, updatePlayerData } = useContext(PlayerContext);

    if (boots.requirements === undefined) {
        console.error("boots requirements not found");
        return;
    }

    const checkRequirements = (forPurchase: boolean) => {

        if (forPurchase) {
            const meetsRequirements = player && player.gold >= boots.cost;
            return !!meetsRequirements;
        } else {
            const requirementsToEquip = player && player.str >= boots.requirements.str && player.dex >= boots.requirements.dex
                && player.con >= boots.requirements.con && player.int >= boots.requirements.int;

            return !!requirementsToEquip;
        }
    }

    const purchaseBoots = async (bootsToPurchase: IShopBoots) => {
        if (player && bootsToPurchase && player.gold >= bootsToPurchase.cost) {
            try {

                // Insert the new weapon into the database and retrieve the insertedId
                const insertResult = await getCreateBoots(bootsToPurchase);
                const newBootsId = insertResult?._id;

                // If the insert operation was successful, update the player's data
                if (newBootsId) {
                    // Deduct the cost and add the new weapon to the player's inventory
                    const updatedPlayer = {
                        ...player,
                        gold: player.gold - bootsToPurchase.cost,
                        inventory: {
                            ...player.inventory,
                            boots: [...player.inventory.boots, { ...insertResult, _id: newBootsId }]
                        }
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

    const saleBoots = async (bootsToSale: IBoots) => {
        if (player) {
            await getSaleBoots(bootsToSale, player, updatePlayerData);
            setShowModal(false);
        }
    }

    const equipBoots = async (bootsToEquip: IBoots) => {
        // Check if there is an existing weapon in the main hand
        const currentBoots = player?.equipment?.boots;

        if (player && checkRequirements(false)) {
            try {
                // Prepare the new state for the player
                let updatedPlayer: IPlayer = {
                    ...player,
                    equipment: {
                        ...player.equipment,
                        boots: bootsToEquip, // Equip the new weapon
                    },
                    // Filter out the new weapon from the inventory if it was there, and keep the rest.
                    inventory: {
                        ...player.inventory,
                        boots: player.inventory.boots.filter((invBoots: IBoots) => invBoots._id !== bootsToEquip._id)
                    }
                };

                // If there was a weapon in the main hand, move it to the inventory
                if (currentBoots) {
                    // Ensure that the weapon being moved to the inventory is not the same as the one being equipped
                    if (currentBoots._id !== boots._id) {
                        updatedPlayer.inventory.boots.push(currentBoots);
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

    return (
        <>
            {boots && player ? (
                <>
                    <div onClick={() => setShowModal(true)} style={{ padding: 6, borderTop: '1px solid rgba(235, 235, 235, 0.11)', borderBottom: '1px solid rgba(235, 235, 235, 0.11)' }}>
                        <IonGrid style={{ width: '100%', padding: 0 }}>
                            <IonRow style={{ width: '100%' }}>
                                {/* Image Column */}
                                <IonCol size="3" style={{ padding: 0 }}>
                                    <IonImg
                                        style={{ width: '100%', height: 'auto' }}
                                        src={`/images/boots/boots-${boots.imgId}.webp`}
                                        alt={`A ${boots.name} with beautiful details`} />
                                </IonCol>

                                {/* Gold Column */}
                                <IonCol size="4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div style={{ color: getItemGradeColor(boots.grade), fontSize: '14px', marginBottom: 6 }}>
                                        {boots.name}
                                    </div>


                                    {isForSale ? (<span>
                                        Cost:<span style={{ color: 'gold' }}> {boots.cost.toLocaleString()} G</span>
                                    </span>
                                    ) : (
                                        <span>
                                            Sale: <span style={{ color: 'gold' }}> {(boots.cost / 2).toLocaleString()} G</span>
                                        </span>
                                    )}


                                </IonCol>

                                {/* Requirements Column */}
                                <IonCol size="5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <div style={{ fontSize: '14px', color: 'white' }}>
                                        Defense: {boots.defense}
                                    </div>
                                    <span style={{ fontSize: '12px' }}>
                                        Stats required:
                                    </span>

                                    <IonCardSubtitle style={{ fontSize: '12px' }}>
                                        DEX: <span style={{ color: player?.dex >= boots.requirements.dex ? 'green' : 'red', marginRight: 6 }}>
                                            {boots.requirements.dex}
                                        </span>

                                        STR: <span style={{ color: player?.str >= boots.requirements.str ? 'green' : 'red', }}>
                                            {boots.requirements.str}
                                        </span>
                                    </IonCardSubtitle>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </div>



                    <ItemModal
                        equipItem={equipBoots}
                        isForSale={isForSale ?? false}
                        canPurchase={checkRequirements(isForSale ?? false)}
                        purchaseItem={purchaseBoots}
                        saleItem={saleBoots}
                        showModal={showModal}
                        setShowModal={setShowModal}
                        imgString={`/images/boots/boots-${boots.imgId}.webp`}
                        item={boots} />
                </>
            ) : <>Loading..</>}

        </>
    );
};

export default BootsCard;
