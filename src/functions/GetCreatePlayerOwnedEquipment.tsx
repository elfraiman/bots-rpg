import * as Realm from 'realm-web';
import { IEquipment, IPlayer, IPlayerEquipment } from "../types/types";

const app = Realm.App.getApp('application-0-vgvqx');


export const GetCreatePlayerOwnedEquipment = async (
    player: IPlayer,
    equipment: IEquipment,
): Promise<IPlayerEquipment | undefined> => {
    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const playerEquipments = mongodb.db("bots_rpg").collection<IPlayerEquipment>("playerEquipments");

    try {
        // No need for instanceof checks. Use the type property directly.
        const itemType = equipment.type;

        // Create a new unique equipment in the database
        const newEquipment: IPlayerEquipment = {
            _id: new Realm.BSON.ObjectId(),
            baseItemId: equipment._id,
            itemType: itemType,
            ownerId: player._id,
            modifications: {
                enhancementLevel: 0
            }
        };

        await playerEquipments.insertOne(newEquipment);
        // Return the new equipment including its generated _id
        return newEquipment;

    } catch (err) {
        console.error(`Failed to create ${equipment.type}:`, err);
        throw err;
    }
}
