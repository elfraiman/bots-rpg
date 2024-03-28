import * as Realm from "realm-web";
import { IShopBoots } from "../types/types";

const app = Realm.App.getApp('application-0-vgvqx');

const getShopBoots = async () => {
    // Ensure there's a logged-in user
    if (!app.currentUser) {
        console.error("No current user found");
        return;
    }

    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const shopBootsCollection = mongodb.db("bots_rpg").collection<IShopBoots>("shopBoots");

    if (!shopBootsCollection) {
        console.error("No weapons found");
        return;
    }

    try {
        const bootsResult = await shopBootsCollection.find({sale: true}); // Or just use userId if it's a string
        return bootsResult
    } catch (err) {
        console.error("Failed to fetch shop weapons data:", err);
    }
};



export default getShopBoots;
