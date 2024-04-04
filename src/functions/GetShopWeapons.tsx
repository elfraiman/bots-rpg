import * as Realm from "realm-web";
import { IShopWeapon, IWeapon } from '../types/types'; // Assuming you've renamed the import to avoid naming conflict

const app = Realm.App.getApp('application-0-vgvqx');

const getShopWeapons = async () => {


    // Ensure there's a logged-in user
    if (!app.currentUser) {
        console.error("No current user found");
        return;
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const shopWeaponCollection = mongodb.db("bots_rpg").collection<IWeapon>("weapons");

    if (!shopWeaponCollection) {
        console.error("No weapons found");
        return;
    }

    try {
        const weaponsResult = await shopWeaponCollection.find({ forSale: true }); // Or just use userId if it's a string
        return weaponsResult
    } catch (err) {
        console.error("Failed to fetch shop weapons data:", err);
    }
};



export default getShopWeapons;
