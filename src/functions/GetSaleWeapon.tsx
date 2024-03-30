import * as Realm from 'realm-web';
import { IPlayer, IWeapon } from "../types/types";


const app = Realm.App.getApp('application-0-vgvqx');


export const getSaleWeapon = async (weapon: IWeapon, player: IPlayer, updatePlayerData: any): Promise<boolean | undefined> => {
    if (!app.currentUser) {
        throw new Error("No current user found. Ensure you're logged in to Realm.");
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const weaponsCollection = mongodb.db("bots_rpg").collection<IWeapon>("weapons");

    try {
        if (weapon !== undefined && player) {
            await weaponsCollection.deleteOne({ _id: weapon._id });

            updatePlayerData({
                ...player,
                gold: player.gold + (weapon.cost / 2),
                inventory: {
                ...player.inventory,
                weapons: player.inventory.weapons.filter((i: any) => i._id !== weapon._id)
            } })

            return true;
        } else {
            console.error("Cant delete weapon");
            return undefined;
        }
    } catch (err) {
        console.error("Failed to create weapon:", err);
        throw err; // Rethrow the error for the calling function to handle
    }
}