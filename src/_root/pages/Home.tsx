import Loader from "@/components/ui/shared/Loader";
import PostCard from "@/components/ui/shared/PostCard";
import { toast } from "@/components/ui/use-toast";
import { useGetRecentPosts } from "@/lib/react-query/querie";
import { Models } from "appwrite";

const Home = () => {
  
  const {data :posts,isPending:isPostLoading,}=useGetRecentPosts();
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
          {isPostLoading && !posts ? <Loader /> :
           <ul className="flex flex-col gap-9  flex-1 w-full">
{posts?.documents.map((post:Models.Document) => (
 <PostCard  post={post} key={post.caption}/>
))}
            </ul>
            }
        </div>
      </div>
    </div>
  );
};

export default Home;
