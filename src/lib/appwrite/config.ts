import {Client, Account, Databases, Storage,Avatars} from 'appwrite'

export const appwriteConfig = {
    projectId:import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url:import.meta.env.VITE_APPWRITE_URL,
    databaseId:import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId:import.meta.env.VITE_APPWRITE_STORAGE_ID,
    userCollectionId:import.meta.env.VITE_APPWRITE_USERS_ID,
    postsCollectionId:import.meta.env.VITE_APPWRITE_POSTES_ID,
    savesCollectionId:import.meta.env.VITE_APPWRITE_SAVES_ID,
    commentsCollectionId:import.meta.env.VITE_APPWRITE_COMMENTS_ID,
}
// export const account = new Account(appwriteConfig);
export const client = new Client();

client.setEndpoint(appwriteConfig.url);
client.setProject(appwriteConfig.projectId);
export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);



