import { useUserContext } from "@/_auth/AuthContext";
import { formatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link, useNavigate } from "react-router-dom";
import PostStats from "./PostStats";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { useCreateComment, useGetComments } from "@/lib/react-query/querie";
import { toast } from "../use-toast";
import Loader from "./Loader";

const commentschema = z.object({
  comment: z.string().min(2),
});
type PostCardProps = {
  post: Models.Document;
};
const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
 const navigate = useNavigate();
  const { mutateAsync: createComment, isPending: isLoadingComment } =
    useCreateComment(post.$id);
  const { data: Comment,isPending: isLoading } = useGetComments(post.$id, user.id);
  const form = useForm<z.infer<typeof commentschema>>({
    resolver: zodResolver(commentschema),
    defaultValues: {
      comment: "",
    },
  });
  async function onSubmit(values: z.infer<typeof commentschema>) {
    const createdComment = await createComment({
      userId: user.id,
      postId: post.$id,
      comment: values.comment,
    });
    console.log(user.id);
    console.log(post.$id);
    console.log(values);
    console.log(createdComment);
    if (!createdComment) {
      toast({
        title: "Something went wrong. Please try again",
        variant: "destructive",
      });
    }
  }

  if (!post.creator) {
    return;
  }

  const handleSeeMoreClick = () => {
    // Navigate to post details page with postId as parameter
    navigate(`/posts/${post.$id}`);
  };
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post?.creator?.imageUrl ||
                "assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="rounded-full w-12 h-12 lg:h-12 object-cover "
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post?.creator?.name}
            </p>

            <div className="flex-center gap-2 text-light-3 items-center">
              <p className="suttle-semibold lg:small-regular">
                {formatDateString(post.$createdAt)}
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>
        <Link
          to={`/post-details/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"}`}
        >
          <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2 ">
            {post.tags?.map((tag: string) => (
              <li key={tag} className="text-light-3">
                {tag.startsWith("#") ? tag : `#${tag}`}
              </li>
            ))}
          </ul>
        </div>
        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="postPicture"
          className="post-card_img "
        />
      </Link>
      <PostStats post={post} userId={user.id} />
      <hr className="border w-full border-dark-4/80 my-2" />
      <div>
        <p className="body-bold text-light-1 py-2">Comments</p>
        <ul className="flex flex-col gap-3 ">
          {isLoading ? <Loader /> : Comment?.documents.slice(0, 5).map((comment) => (
            <li key={comment.$id} className="flex gap-3">
              <img
                src={
                  comment.creator.imageUrl ||
                  "/assets/icons/profile-placeholder.svg"
                }
                alt="creator"
                className="rounded-full w-8 h-8 lg:h-12 lg:w-12 object-cover"
              />
              <div className="flex flex-col">
                <div className="flex flex-row gap-1 items-end sm:items-center">
                  <p className="small-medium  md:small-medium text-light-1 ">
                    {comment.creator.name}
                  </p>
                  <p className="tiny-medium  lg:subtle-semibold text-light-4 items-end">
                    {formatDateString(comment?.$createdAt ?? "")}
                  </p>
                </div>

                <p className="small-regular lg:base-regular text-light-3">
                  {comment.comment}
                </p>
              </div>
            </li>
            
          ))}
        </ul>
        {Comment && Comment.documents.length > 5 && (
                    <button onClick={handleSeeMoreClick} className="subtle-semibold text-light-3 pt-6 cursor-pointer items-center">See more</button>
                )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row  w-full pt-4  "
        >
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="add your comment"
                    {...field}
                    className="h-10 rounded-[20px] bg-dark-4 border-none text-wrap text-xs placeholder:text-light-4  focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3  "
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            {isLoadingComment ? (
              <Loader />
            ) : (
              <img
                src="/assets/icons/share.svg"
                alt="share"
                width={20}
                height={20}
              />
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PostCard;
