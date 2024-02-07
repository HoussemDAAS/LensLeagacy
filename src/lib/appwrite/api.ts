  
import { INewUser,IUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";
import { ID } from "appwrite";
export async function createUserAccount(user:INewUser){
 try {
    const newAccount = await account.create(
        ID.unique(),
        user.email,
        user.password,
        user.name
    );
    if(!newAccount) throw new Error('Account not created');
    const avatarUrl=avatars.getInitials(user.name);
    const newUser=await saveUserDB({
       accountId:newAccount.$id,
       name:newAccount.name,
       email:newAccount.email,
       imageUrl:avatarUrl,
       username:user.username
    })
    return newUser;
 } catch (error) {
    console.log(error);
    return error;
 }
}

export async function saveUserDB(user: {
accountId: string;
name: string;
username?: string;
email: string;
imageUrl: URL;
}) {
   try {
      const newUser = await databases.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         ID.unique(),
         user
      
      )
      return newUser; 
   } catch (error) {
      console.log(error);
   }
   
}


export async function SignInAccount(user:{email:string,password:string}){
    try {
       const session = await account.createEmailSession(
          user.email,
          user.password
       )
       return session;
    } catch (error) {
        console.log(error);
    }
}