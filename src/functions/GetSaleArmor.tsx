import * as Realm from 'realm-web';
import { IArmor, IPlayer } from "../types/types";


const app = Realm.App.getApp('application-0-vgvqx');


export const getSaleArmor = async (armor: IArmor, player: IPlayer, updatePlayerData: any): Promise<boolean | undefined> => {
    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const armorsCollection = mongodb.db("bots_rpg").collection<IArmor>("armors");

    try {
        if (armor !== undefined && player) {
            await armorsCollection.deleteOne({ _id: armor._id });

            updatePlayerData({
                ...player, 
                gold: player.gold + (armor.cost / 2),
                inventory: {
                    ...player.inventory,
                    armors: player.inventory.armors.filter((i: any) => i._id !== armor._id)
                }
            })

            return true;
        } else {
            console.error("Cant delete armor");
            return undefined;
        }
    } catch (err) {
        console.error("Failed to create armor:", err);
        throw err; // Rethrow the error for the calling function to handle
    }
}