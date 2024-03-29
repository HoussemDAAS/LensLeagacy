  
import { INewComment, INewPost, INewUser, IUpdatePost, IUpdateUser} from "@/types";
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
      return {status: "success", message: "File deleted successfully", file: file};
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

 export async function likePost(postId: string, likesArray: string[]) {
   try {
     const updatedPost = await databases.updateDocument(
       appwriteConfig.databaseId,
       appwriteConfig.postsCollectionId,
       postId,
       {
         likes: likesArray,
       }
     );
 
     if (!updatedPost) throw Error;
 
     return updatedPost;
   } catch (error) {
     console.log(error);
   }
 }
   export async function savePost(userId: string, postId: string) {


      try {
        const updatedPost = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.savesCollectionId,
          ID.unique(),
          {
            user: userId,
            post: postId,
          }
        );
    
        if (!updatedPost) throw Error;
    
        return updatedPost;
      } catch (error) {
        console.log(error);
      }
    }
   export async function deleteSavedPost(savedRecordId: string) {
      try {
        const statusCode = await databases.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.savesCollectionId,
          savedRecordId
        );

    
        if (!statusCode) throw Error;
    
        return { status: "Ok" };
      } catch (error) {
        console.log(error);
      }
    }

    export async function getPostById(postId: string) {
      try {
       const post =await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        postId

       )
       return post;
      } catch (error) {
        console.log(error);
      }
    }
    export async function updatePost(post: IUpdatePost) {
      const hasFileToUpdate=post.file.length>0;
      try {
        let image={
          imageUrl:post.imageUrl,
          imageId:post.imageId
        }
        if(hasFileToUpdate){
          
          const uploadedFile = await uploadFile(post.file[0]);
          if (!uploadedFile) throw Error;
          // Get file url
          const fileUrl = getFilePreview(uploadedFile.$id);
          if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
          }
        image={...image,imageUrl:fileUrl,imageId:uploadedFile.$id}
        }
        // Upload file to appwrite storage
    
    
        // Convert tags into array
        const tags = post.tags?.replace(/ /g, "").split(",") || [];
    
        // Create post
        const updatePost = await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.postsCollectionId,
          post.postId,
          {
            
            caption: post.caption,
            imageUrl: image.imageUrl,
            imageId: image.imageId,
            location: post.location,
            tags: tags,
          }
        );
    
        if (!updatePost) {
          await deleteFile(post.imageId);
          throw Error;
        }
    
        return updatePost;
      } catch (error) {
        console.log(error);
      }
    }
    export async function deletePost(postId: string,imageId:string) {
      
      try {
        const statusCode = await databases.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.postsCollectionId,
          postId
        );
        const statusCode2 = await deleteFile(imageId);
    
        if (!statusCode||!statusCode2) throw Error;
    
        return { status: "Ok" };
      } catch (error) {
        console.log(error);
      }
    }

    export async function getInfinitePosts({pageParam}:{pageParam:number}) {
      const queries :any[] = [
        Query.orderDesc("$updatedAt"),Query.limit(10)]
        if(pageParam){
          queries.push(Query.cursorAfter(pageParam.toString()))
      
        }
    try {
      const posts=await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        queries
      )
      if(!posts) throw Error;

      return posts
    } catch (error) {
      console.log(error);
    }
      
    }
    export async function searchPosts(searchTerm:string) {
   
    try {
      const posts=await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
       [Query.search('caption',searchTerm)]
      )
      if(!posts) throw Error;
      
      return posts
    } catch (error) {
      console.log(error);
    }
      
    }
    

    export async function getUserById(userId: string) {
      try {
       const user =await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId
       )
       return user;
      } catch (error) {
        console.log(error);
      }
    }


    export async function updateUser(user: IUpdateUser) {
      const hasFileToUpdate = user.file.length > 0;
      try {
        let image = {
          imageUrl: user.imageUrl,
          imageId: user.imageId,
        };
    
        if (hasFileToUpdate) {
          // Upload new file to appwrite storage
          const uploadedFile = await uploadFile(user.file[0]);
          if (!uploadedFile) throw Error;
    
          // Get new file url
          const fileUrl = getFilePreview(uploadedFile.$id);
          if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
          }
    
          image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
        }
    
        //  Update user
        const updatedUser = await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          user.userId,
          {
            name: user.name,
            bio: user.bio,
            imageUrl: image.imageUrl,
            imageId: image.imageId,
          }
        );
    
        // Failed to update
        if (!updatedUser) {
          // Delete new file that has been recently uploaded
          if (hasFileToUpdate) {
            await deleteFile(image.imageId);
          }
          // If no new file uploaded, just throw error
          throw Error;
        }
    
        // Safely delete old file after successful update
        if (user.imageId && hasFileToUpdate) {
          await deleteFile(user.imageId);
        }
    
        return updatedUser;
      } catch (error) {
        console.log(error);
      }
    }
    export async function getUsers() {
      try {
       const users =await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId
       )
       return users;
      } catch (error) {
        console.log(error);
      }
      
    }   
    export async function createComment(Comments: INewComment) {
      console.log('thecomment is ',Comments);
      try {
          const newComment = await databases.createDocument(
              appwriteConfig.databaseId,
              appwriteConfig.commentsCollectionId,
              ID.unique(),
              {
                creator: Comments.userId,
               posts: Comments.postId,
                comment: Comments.comment,
              }
             
          );
 
          if (!newComment) {
              throw new Error('Failed to create comment');
          }
          return newComment;
      } catch (error) {
          console.error('Error creating comment:', error);
          throw error; // Rethrow the error to stop the mutation from being marked as successful
      }
  }

  export async function getComments(postId: string) {
    try {
      const comments = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.commentsCollectionId,
        [Query.equal("posts", postId)],
      );
      return comments;
    } catch (error) {
      console.log(error);
    }
  }

  export async function verifyEmail() {
    try {
      const url = `${window.location.origin}/verifemail`;
      const user = await account.createVerification(url);
      if (user) {
        console.log("Verification email sent");
      }
      return user;
    } catch (error) {
      console.log(error);
    }
  }
  export async function VerifAccount(userId:string,secret:string) {
    try {
      const verif = await account.updateVerification(userId,secret);

     return verif;
    } catch (error) {
      console.log(error);
    }
  }
  export async function VerifisValid(){
    try {
      const verif = await account.get();
        if(verif.status===true){
          return verif;
        }
    
    } catch (error) {
      console.log(error);
    }
  }
  