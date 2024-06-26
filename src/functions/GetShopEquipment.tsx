import * as Realm from "realm-web";
import { IArmor, IEquipment, IWeapon } from '../types/types'; // Assuming you've renamed the import to avoid naming conflict

const app = Realm.App.getApp('application-0-vgvqx');

const getShopArmors = async () => {
    // Ensure there's a logged-in user
    if (!app.currentUser) {
        console.error("No current user found");
        return;
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const shopArmorsCollection = mongodb.db("bots_rpg").collection<IEquipment>("armors");

    if (!shopArmorsCollection) {
        console.error("No armors found");
        return;
    }

    try {
        const armorsResult = await shopArmorsCollection.find({ forSell: true }); // Or just use userId if it's a string
        return armorsResult.sort((a, b) => a.cost - b.cost);
    } catch (err) {
        console.error("Failed to fetch shop weapons data:", err);
    }
};



export default getShopArmors;
