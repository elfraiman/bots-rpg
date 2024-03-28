import * as Realm from "realm-web";
import { IShopHelmet } from '../types/types'; // Assuming you've renamed the import to avoid naming conflict

const app = Realm.App.getApp('application-0-vgvqx');

const getShopHelmets = async () => {
    // Ensure there's a logged-in user
    if (!app.currentUser) {
        console.error("No current user found");
        return;
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const shopHelmetsCollection = mongodb.db("bots_rpg").collection<IShopHelmet>("shopHelmets");

    if (!shopHelmetsCollection) {
        console.error("No weapons found");
        return;
    }

    try {
        const helmetsResult = await shopHelmetsCollection.find({sale: true}); // Or just use userId if it's a string
        return helmetsResult
    } catch (err) {
        console.error("Failed to fetch shop weapons data:", err);
    }
};



export default getShopHelmets;
