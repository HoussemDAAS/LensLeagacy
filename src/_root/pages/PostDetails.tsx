import { useUserContext } from "@/_auth/AuthContext";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/shared/Loader";
import PostStats from "@/components/ui/shared/PostStats";
import { toast } from "@/components/ui/use-toast";
import {
  useCreateComment,
  useDeletePost,
  useGetComments,
  useGetPostById,
} from "@/lib/react-query/querie";
import { formatDateString } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const commentschema = z.object({
  comment: z.string().min(2),
});
const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");
  const { user } = useUserContext();
  const { mutate: deletePost } = useDeletePost();
  const navigate = useNavigate();

  const { mutateAsync: createComment, isPending: isLoadingComment } =
    useCreateComment(id || "");
  const { data: Comment, isPending: isLoading } = useGetComments(
    id || "",
    user.id
  );

  const form = useForm<z.infer<typeof commentschema>>({
    resolver: zodResolver(commentschema),
    defaultValues: {
      comment: "",
    },
  });
  async function onSubmit(values: z.infer<typeof commentschema>) {
    const createdComment = await createComment({
      userId: user.id,
      postId: id || "",
      comment: values.comment,
    });
    console.log(user.id);

    console.log(values);
  if (createdComment) {
    form.reset({ comment: "" });
  }
    if (!createdComment) {
      toast({
        title: "Something went wrong. Please try again",
        variant: "destructive",
      });
    }
  }
  const handleDeletePost = () => {
    if (post?.$id) {
      deletePost({
        postId: post?.$id,
        imageId: post?.imageId,
      });
      toast({
        description: "Post deleted",
      });
      navigate("/");
    }
  };

  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img src={post?.imageUrl} alt="post" className="post_details-img" />
          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="flex items-center gap-3 "
              >
                <img
                  src={
                    post?.creator?.imageUrl ||
                    "assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:h-12 lg:w-12 object-cover"
                />

                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator?.name}
                  </p>

                  <div className="flex-center gap-2 text-light-3">
                    <p className="suttle-semibold lg:small-regular">
                      {formatDateString(post?.$createdAt ?? "")}
                    </p>
                    -
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex-center gap-1">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}
                >
                  <img
                    src="/assets/icons/edit.svg"
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>
                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ghost_details-delete_btn ${
                    user.id !== post?.creator.$id && "hidden"
                  }`}
                >
                  <img
                    src="/assets/icons/delete.svg"
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2 ">
                {post?.tags?.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    {tag.startsWith("#") ? tag : `#${tag}`}
                  </li>
                ))}
              </ul>
              <hr className="border w-full border-dark-4/80 m-2" />
              <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                <p className="body-bold text-light-1 py-2">Comments</p>
                <ul className="flex flex-col gap-3 ">
                  {isLoading ? (
                    <Loader />
                  ) : (
                    Comment?.documents.map((comment) => (
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
                            <p className="small-medium md:small-medium text-light-1 ">
                              {comment.creator.name}
                            </p>
                            <p className="tiny-medium lg:subtle-semibold text-light-4 items-end">
                              {formatDateString(comment?.$createdAt ?? "")}
                            </p>
                          </div>

                          <p className="small-regular lg:base-regular text-light-3">
                            {comment.comment}
                          </p>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-row  w-full  mt-4 "
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
            <hr className="border w-full border-dark-4/80 " />
            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
