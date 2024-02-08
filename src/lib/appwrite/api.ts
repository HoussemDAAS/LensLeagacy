  
import { INewPost, INewUser} from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";


export async function createUserAccount(user:INewUser){
 try {
    const newAccount = await account.create(
        ID.unique(),
        user.email,
        user.password,
        user.name
    );
    if (!newAccount) throw Error;
    const avatarUrl=avatars.getInitials(user.name);
    const newUser=await saveUserDB({
       accountId:newAccount.$id,
       name:newAccount.name,
       email:newAccount.email,
       username:user.username,
       imageUrl:avatarUrl,
    });
    return newUser;
 } catch (error) {
    console.log(error);
    return error;
 }
}

export async function saveUserDB(user: {
accountId: string;
name: string;
email: string;
imageUrl: URL;
username?: string;
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
       const session = await account.createEmailSession(user.email,user.password);

       return session;
    } catch (error) {
        console.log(error);
    }
}
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser(){
   try {
      const currentAccount= await getAccount();
      if (!currentAccount) throw Error;
      
      const currentUser=await databases.listDocuments(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         [Query.equal("accountId",currentAccount.$id)]
      );
      
      if(!currentUser) throw new Error("User not found");
      return currentUser.documents[0];
   } catch (error) {
      console.log(error);
   }
}
export const SignoutAccount = async () => {
   try {
      const session =await account.deleteSession("current");
      return session;
   } catch (error) {
      console.log(error);
      
   }
}
export async function createPost(post: INewPost) {
   try {
     // Upload file to appwrite storage
     const uploadedFile = await uploadFile(post.file[0]);
 
     if (!uploadedFile) throw Error;
 
     // Get file url
     const fileUrl = getFilePreview(uploadedFile.$id);
     if (!fileUrl) {
       await deleteFile(uploadedFile.$id);
       throw Error;
     }
 
     // Convert tags into array
     const tags = post.tags?.replace(/ /g, "").split(",") || [];
 
     // Create post
     const newPost = await databases.createDocument(
       appwriteConfig.databaseId,
       appwriteConfig.postsCollectionId,
       ID.unique(),
       {
         creator: post.userId,
         caption: post.caption,
         imageUrl: fileUrl,
         imageId: uploadedFile.$id,
         location: post.location,
         tags: tags,
       }
     );
 
     if (!newPost) {
       await deleteFile(uploadedFile.$id);
       throw Error;
     }
 
     return newPost;
   } catch (error) {
     console.log(error);
   }
 }
 export async function uploadFile(file: File) {
    try {
      const uploadedFile = await storage.createFile(
         appwriteConfig.storageId,
         ID.unique(),
         file,
      )
      return uploadedFile;
    } catch (error) {
     console.log(error);
    }
 }
 export const getFilePreview = (fileId: string) => {
    try {
      const fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId
         ,
         2000,
         2000,"top",100);
      return fileUrl;
    } catch (error) {
      console.log(error);
    }
 }
 export const deleteFile = async (fileId: string) => {
    try {
      const file = await storage.deleteFile(appwriteConfig.storageId, fileId);
      return {status: "success", message: "File deleted successfully"};
    } catch (error) {
      console.log(error);
    }
 }
 export async function getRecentPosts() {
   const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.orderDesc(`$createdAt`), Query.limit(20)]
   )
    if (!posts) throw Error;
    return posts;
 }

   export async function likePost(postId: string,likesArray:string[]) {
      try {
         const updatedPost =await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            postId,
            {
               likes:likesArray
            }
           
         ) 
         if (!updatedPost) throw Error;
return updatedPost;
      } catch (error) {
         console.log(error);
      }
 
   }
   export async function savePost(postId: string,userId:string) {
      try {
         const updatedPost =await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
               user:userId,
               post:postId
            }
           
         ) 
         if (!updatedPost) throw Error;
return updatedPost;
      } catch (error) {
         console.log(error);
      }
 
   }
   export async function deleteSavedPost(savedId: string) {
      try {
         const updatedPost =await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedId
           
         ) 
         if (!updatedPost) throw Error;
return {status:"success"}; ;
      } catch (error) {
         console.log(error);
      }
 
   }