import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/querie";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import { useLocation } from "react-router-dom";

type PostStatesProps = {
  post: Models.Document;
  userId: string;
};



const PostStats = ({ post, userId }: PostStatesProps) => {

  const location = useLocation();
            const likesList = post.likes.map((user: Models.Document) => user.$id);

            const [likes, setLikes] = useState<string[]>(likesList);
            const [isSaved, setisSaved] = useState(false);

            const { mutate: likePost } = useLikePost();
            const { mutate: savePost, isPending: isSaving } = useSavePost();
            const { mutate: deleteSavedPost, isPending: isDeleting } =
              useDeleteSavedPost();
            const { data: currentUser } = useGetCurrentUser();

            const savedPostRecord = currentUser?.save?.find(
              (record: Models.Document) => record.post.$id === post.$id
            );


  useEffect(() => {
    setisSaved(!!savedPostRecord);
  }, [currentUser]);
  const handleLike = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();

    let newLike = [...likes];

    const hasClicked = newLike.includes(userId);
    if (hasClicked) {
      newLike = newLike.filter((id) => id !== userId);
    } else newLike.push(userId);
    setLikes(newLike);
    likePost({ postId: post.$id, likesArray: newLike });
  };
  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setisSaved(false);
      return deleteSavedPost(savedPostRecord.$id);
    }

    savePost({ userId: userId, postId: post.$id });
    setisSaved(true);
  };
  const containerStyles = location.pathname.startsWith("/profile")
  ? "w-full"
  : "";
  return (
    <div className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }
          alt="like"
          width={20}
          height={20}
          onClick={handleLike}
          className="cursor-pointer"
        />

        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2 ">
        {isDeleting || isSaving ? (
          <Loader />
        ) : (
          <>
            <img
              src={
                isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"
              }
              alt="share"
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={(e) => handleSavePost(e)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PostStats;
