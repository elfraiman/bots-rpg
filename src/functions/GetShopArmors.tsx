import * as Realm from "realm-web";
import { IShopArmor } from '../types/types'; // Assuming you've renamed the import to avoid naming conflict

const app = Realm.App.getApp('application-0-vgvqx');

const getShopArmors = async () => {
    // Ensure there's a logged-in user
    if (!app.currentUser) {
        console.error("No current user found");
        return;
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const shopArmorsCollection = mongodb.db("bots_rpg").collection<IShopArmor>("shopArmor");

    if (!shopArmorsCollection) {
        console.error("No weapons found");
        return;
    }

    try {
        const armorsResult = await shopArmorsCollection.find({sale: true}); // Or just use userId if it's a string
        return armorsResult
    } catch (err) {
        console.error("Failed to fetch shop weapons data:", err);
    }
};



export default getShopArmors;
