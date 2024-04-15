import { IPlayerOwnedArmor, IPlayerOwnedWeapon } from "../types/types";
import { GetBaseEquipment } from "./GetBaseEquipment";
import { getPlayerOwnedEquipment } from "./GetPlayerOwnedEquipment";
import * as Realm from 'realm-web';


//
export const GetCombinedEquipmentStatsDetails = async (playerId: string, playerOwnedItemId: Realm.BSON.ObjectId) => {
    // Fetch the player-owned item details

    try {
        const playerOwnedEquipmentDetails = await getPlayerOwnedEquipment(playerId, playerOwnedItemId);

        if (!playerOwnedEquipmentDetails) return;

        // Assuming `fetchplayerOwnedEquipmentDetails` returns an object that includes a `baseItemId`
        const baseItemId = playerOwnedEquipmentDetails?.baseItemId;

        // Fetch the base item details using the baseItemId
        const baseEquipmentDetails = await GetBaseEquipment(baseItemId);
        if (!baseEquipmentDetails) return;

        // Combine the details (simple example, adjust according to your data structure)
        const combinedDetails = {
            ...baseEquipmentDetails,
            ...playerOwnedEquipmentDetails,
        };

        if (playerOwnedEquipmentDetails.itemType === 'weapon') {
            return combinedDetails as IPlayerOwnedWeapon;
        } else {
            return combinedDetails as IPlayerOwnedArmor;
        }
    } catch (e) {
        throw (e);
    }

};
