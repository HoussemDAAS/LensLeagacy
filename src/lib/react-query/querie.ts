import {useQuery,useMutation,useQueryClient,useInfiniteQuery}from '@tanstack/react-query'
import { SignInAccount, SignoutAccount, createComment, createPost, createUserAccount, deletePost, deleteSavedPost, getComments, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, getUserById, getUsers, likePost, savePost, searchPosts, updatePost, updateUser } from '../appwrite/api'
import { INewComment, INewPost, INewUser, IUpdatePost, IUpdateUser } from '@/types'
import { QUERY_KEYS } from './queryKeys';

export const useCreateUserAccount = () => {
    return useMutation({
      mutationFn: (user: INewUser) => createUserAccount(user),
    });
  };
  export const useSignInAccount = () => {
    return useMutation({
      mutationFn: (user: { email: string; password: string }) =>
        SignInAccount(user),
    });
  };
  export const useSignoutAccount = () => {
    return useMutation({
      mutationFn: SignoutAccount
    });
  };
  export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (post: INewPost) => createPost(post),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
      },
    });
  };


  export const useGetRecentPosts = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      queryFn:getRecentPosts,
    })
  }
  export const useLikePost = () => {
    const queryClient= useQueryClient();
    return useMutation({
      mutationFn: ({postId,likesArray}:{postId: string,likesArray: string[]}) => likePost(postId, likesArray),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_ID,data?.$id],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    })
  }
  export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
        savePost(userId, postId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });
  };
  export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });
  };
  export const useGetCurrentUser = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      queryFn: getCurrentUser,
    });
  };
  export const useGetPostById = (postId: string) => {

    return useQuery({
      queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
      queryFn: () => getPostById(postId),
      enabled: !!postId,
    });
  };
  export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      
      mutationFn: (post:IUpdatePost) => updatePost(post),
  onSuccess: (data) => {
     queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.GET_POST_BY_ID,data?.$id],
    });
  }
  })
  };


  
  export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      
      mutationFn: ({ postId,imageId }: { postId: string,imageId: string }) => deletePost(postId,imageId),
  onSuccess: () => {
     queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.GET_RECENT_POSTS,]
    });
  }
  })
  };

  
  
  export const useGetPosts = () => {
    return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      queryFn: getInfinitePosts as any,
      getNextPageParam: (lastPage: any) => {
        // If there's no data, there are no more pages.
        if (lastPage && lastPage.documents.length === 0) {
          return null;
        }
  
        // Use the $id of the last document as the cursor.
        const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
        return lastId;
      },
      initialPageParam: null, // Provide an initial page parameter, it can be null or any other initial value
    });
  };
  


  export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
      queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm
    
    })
  }

  export const useGetUserById = (userId: string) => {

    return useQuery({
      queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
      queryFn: () => getUserById(userId),
      enabled: !!userId,
    });
  }

  export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (user: IUpdateUser) => updateUser(user),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
        });
      },
    });
  };

  export const useGetUsers = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_USERS],
      queryFn: getUsers,
    });
  }
  export const useCreateComment = (postId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (comment: INewComment) => createComment(comment),
        onSuccess: () => {
            // Invalidate the query for fetching comments for the specific post
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_COMMENTS, postId],
            });
        },
        onError: (error: any) => {
            console.error('Error creating comment:', error);
            throw error;
        },
    });
};

  export const useGetComments = (postId: string, userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_COMMENTS, postId, userId],
        queryFn: async () => {
            try {
                const comments = await getComments(postId, userId);
                return comments;
            } catch (error) {
                console.error('Error fetching comments:', error);
                throw error;
            }
        },
        enabled: !!postId && !!userId,
    });
};