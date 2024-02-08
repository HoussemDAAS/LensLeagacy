import { useUserContext } from '@/_auth/AuthContext';
import { useDeleteSavedPost, useLikePost, useSavePost } from '@/lib/react-query/querie';
import { checkIsLiked } from '@/lib/utils';
import { Models } from 'appwrite';
import React, { useState,useEffect} from 'react';


type PostStatesProps = {
    post:Models.Document,
    userId:string
}
const PostStats = ({post,userId}:PostStatesProps) => {
    const likesList=post.likes.map((user:Models.Document)=>user.$id);

    const[likes,setLikes]=useState(likesList);
    const[isSaved,setisSaved]=useState(false);


    const {mutate:likePost}=useLikePost();
    const {mutate:savePost}=useSavePost();
    const {mutate:deleteSavedPost}=useDeleteSavedPost();
    const {date:currentUser}=useUserContext();


    const handleLike=(e:React.MouseEvent)=>{
        e.stopPropagation();
    }
    const handleSave=()=>{
        
    }
  return (
    <div className='flex justify-between items-center z-20'>
     <div className='flex gap-2 mr-5'>
        <img src={checkIsLiked(likes,userId)
        ?"/assets/icons/liked.svg"
        :"/assets/icons/like.svg"} 
        alt="like" width={20} height={20} onClick={handleLike} className='cursor-pointer'/>
        <p className='small-medium lg:base-medium'>{likes.length}</p>
     </div>
     <div className='flex gap-2 '>
        <img src={isSaved
        ? "/assets/icons/saved.svg"
     : "/assets/icons/save.svg"} alt="like" width={20} height={20} onClick={handleSave} className='cursor-pointer'/>
        
     </div>
    </div>
  )
}

export default PostStats
