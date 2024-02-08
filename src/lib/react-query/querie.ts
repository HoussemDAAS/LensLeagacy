import {useQuery,useMutation,useQueryClient,useInfiniteQuery}from '@tanstack/react-query'
import { SignInAccount, SignoutAccount, createPost, createUserAccount, getRecentPosts } from '../appwrite/api'
import { INewPost, INewUser } from '@/types'
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