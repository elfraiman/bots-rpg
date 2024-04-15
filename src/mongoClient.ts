import * as Realm from 'realm-web';


const APP_ID: string = 'application-0-vgvqx'; // Your Realm application ID
const app: Realm.App = Realm.App.getApp(APP_ID);

let mongoClientInstance: globalThis.Realm.Services.MongoDB | null = null;

export const getMongoClient = (): globalThis.Realm.Services.MongoDB | null => {
  if (!app.currentUser) {
    console.error("No current user found. Please make sure the user is logged in.");
    return null;
  }

  // Only create the client if it doesn't already exist
  if (!mongoClientInstance) {
    mongoClientInstance = app.currentUser.mongoClient("mongodb-atlas");
  }

  return mongoClientInstance;
};
