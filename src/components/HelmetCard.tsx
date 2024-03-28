import { IonCardSubtitle, IonCol, IonGrid, IonImg, IonRow } from "@ionic/react";
import { useContext, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { getCreateHelmet } from "../functions/GetCreateHelmet";
import { getSaleHelmet } from "../functions/GetSaleHelmet";
import getItemGradeColor from "../functions/GetWeaponColor";
import { IHelmet, IPlayer, IShopHelmet } from "../types/types";
import ItemModal from "./ItemModal";
import './WeaponCard.css';

interface IHelmetCardProps {
    helmet: IHelmet;
    initialPlayer: IPlayer;
    isForSale?: boolean;
}

const HelmetCard = ({ helmet, isForSale }: IHelmetCardProps) => {
    const [showModal, setShowModal] = useState(false);
    const { player, updatePlayerData } = useContext(PlayerContext);

    if (!helmet.requirements) {
        console.error("helmet requirements not found");
        return;
    }

    const checkRequirements = (forPurchase: boolean) => {

        if (forPurchase) {
            const meetsRequirements = player && player.gold >= helmet.cost;
            return !!meetsRequirements;
        } else {
            const requirementsToEquip = player && player.str >= helmet.requirements.str && player.dex >= helmet.requirements.dex
                && player.con >= helmet.requirements.con && player.int >= helmet.requirements.int;

            return !!requirementsToEquip;
        }
    }

    const purchaseHelmet = async (helmetToPurchase: IShopHelmet) => {
        if (player && helmetToPurchase && player.gold >= helmetToPurchase.cost) {
            try {

                // Insert the new weapon into the database and retrieve the insertedId
                const insertResult = await getCreateHelmet(helmetToPurchase);
                const newHelmetId = insertResult?._id;

                // If the insert operation was successful, update the player's data
                if (newHelmetId) {
                    // Deduct the cost and add the new weapon to the player's inventory
                    const updatedPlayer = {
                        ...player,
                        gold: player.gold - helmetToPurchase.cost,
                        inventory: {
                            ...player.inventory,
                            helmets: [...player.inventory.helmets, { ...insertResult, _id: newHelmetId }]
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

    const saleHelmet = async (helmetToSale: IHelmet) => {
        if (player) {
            await getSaleHelmet(helmetToSale, player, updatePlayerData);
            setShowModal(false);
        }
    }

    const equipHelmet = async (helmet: IHelmet) => {
        // Check if there is an existing weapon in the main hand
        const currentHelmet = player?.equipment?.helmet;

        if (player && checkRequirements(false)) {
            try {
                // Prepare the new state for the player
                let updatedPlayer: IPlayer = {
                    ...player,
                    equipment: {
                        ...player.equipment,
                        helmet: helmet, // Equip the new weapon
                    },
                    // Filter out the new weapon from the inventory if it was there, and keep the rest.
                    inventory: {
                        ...player.inventory,
                        helmets: player.inventory.helmets.filter((invHelmet: IHelmet) => invHelmet._id !== helmet._id)
                    }
                };

                // If there was a weapon in the main hand, move it to the inventory
                if (currentHelmet) {
                    // Ensure that the weapon being moved to the inventory is not the same as the one being equipped
                    if (currentHelmet._id !== helmet._id) {
                        updatedPlayer.inventory.helmets.push(currentHelmet);
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
            {helmet && player ? (
                <>
                    <div onClick={() => setShowModal(true)} style={{ padding: 6, borderTop: '1px solid rgba(235, 235, 235, 0.11)', borderBottom: '1px solid rgba(235, 235, 235, 0.11)' }}>
                        <IonGrid style={{ width: '100%', padding: 0 }}>
                            <IonRow style={{ width: '100%' }}>
                                {/* Image Column */}
                                <IonCol size="3" style={{ padding: 0 }}>
                                    <IonImg
                                        style={{ width: '100%', height: 'auto' }}
                                        src={`/images/helmets/helmet-${helmet.imgId}.webp`}
                                        alt={`A ${helmet.name} with beautiful details`} />
                                </IonCol>

                                {/* Gold Column */}
                                <IonCol size="4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div style={{ color: getItemGradeColor(helmet.grade), fontSize: '14px', marginBottom: 6 }}>
                                        {helmet.name}
                                    </div>


                                    {isForSale ? (<span>
                                        Cost:<span style={{ color: 'gold' }}> {helmet.cost.toLocaleString()} G</span>
                                    </span>
                                    ) : (
                                        <span>
                                            Sale: <span style={{ color: 'gold' }}> {(helmet.cost / 2).toLocaleString()} G</span>
                                        </span>
                                    )}


                                </IonCol>

                                {/* Requirements Column */}
                                <IonCol size="5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <div style={{ fontSize: '14px', color: 'white' }}>
                                        Defense: {helmet.defense}
                                    </div>
                                    <span style={{ fontSize: '12px' }}>
                                        Stats required:
                                    </span>

                                    <IonCardSubtitle style={{ fontSize: '12px' }}>
                                        DEX: <span style={{ color: player?.dex >= helmet.requirements.dex ? 'green' : 'red', marginRight: 6 }}>
                                            {helmet.requirements.dex}
                                        </span>

                                        STR: <span style={{ color: player?.str >= helmet.requirements.str ? 'green' : 'red', }}>
                                            {helmet.requirements.str}
                                        </span>
                                    </IonCardSubtitle>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </div>



                    <ItemModal
                        equipItem={equipHelmet}
                        isForSale={isForSale ?? false}
                        canPurchase={checkRequirements(isForSale ?? false)}
                        purchaseItem={purchaseHelmet}
                        saleItem={saleHelmet}
                        showModal={showModal}
                        setShowModal={setShowModal}
                        imgString={`/images/helmets/helmet-${helmet.imgId}.webp`}
                        item={helmet} />
                </>
            ) : <>Loading..</>}

        </>
    );
};

export default HelmetCard;
