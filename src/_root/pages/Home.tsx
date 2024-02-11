import Loader from "@/components/ui/shared/Loader";
import PostCard from "@/components/ui/shared/PostCard";
import { toast } from "@/components/ui/use-toast";
import { useGetPosts, useGetRecentPosts } from "@/lib/react-query/querie";
import { Models } from "appwrite";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Home = () => {
  const { data: posts, fetchNextPage, hasNextPage, isPending: isPostLoading } = useGetPosts();
  const { data: recentPosts, isPending: isRecentPostLoading } = useGetRecentPosts();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  if (!navigator.onLine) {
    toast({
      title: "No Connection",
      description: "Please check your network connection.",
    });
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading || isRecentPostLoading ? (
            <Loader />
          ) : (
            <ul className="flex flex-col gap-9  flex-1 w-full">
              {recentPosts?.documents.map((post: Models.Document) => (
                <PostCard post={post} key={post.caption} />
              ))}
            </ul>
          )}
          {hasNextPage && isPostLoading===false && (
            <div ref={ref} className="mt-10">
              <Loader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
