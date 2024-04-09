import { IPlayerOwnedArmor, IPlayerOwnedWeapon } from "../types/types";
import { GetBaseEquipment } from "./GetBaseEquipment";
import { GetPlayerOwnedEquipment } from "./GetPlayerOwnedEquipment";
import * as Realm from 'realm-web';
import GetPlayerOwnedItem from "./GetPlayerOwnedItem";
import GetBaseItem from "./GetBaseItem";


//
export const GetCombinedItemDetails = async (itemId: Realm.BSON.ObjectId) => {
    // Fetch the player-owned item details

    try {
        const playerOwnedItemDetails = await GetPlayerOwnedItem(itemId);

        if (!playerOwnedItemDetails) return;

        // Assuming `fetchPlayerOwnedItemDetails` returns an object that includes a `baseItemId`
        const baseItemId = playerOwnedItemDetails?.baseItemId;

        // Fetch the base item details using the baseItemId
        const baseItemDetails = await GetBaseItem(baseItemId);
        if (!baseItemDetails) return;

        // Combine the details (simple example, adjust according to your data structure)
        const combinedDetails = {
            ...baseItemDetails,
            ...playerOwnedItemDetails,
        };

        return combinedDetails;

    } catch (e) {
        throw (e);
    }

};
