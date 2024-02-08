
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "@/components/ui/form"
import { Textarea } from "../textarea"
import FileUploder from "../shared/FileUploder"
import { Input } from "../input"
import { PostValdiation } from "@/lib"
import { Models } from "appwrite"
import { useCreatePost } from "@/lib/react-query/querie"
import { useUserContext } from "@/_auth/AuthContext"
import { toast } from "../use-toast"
import { useNavigate } from "react-router-dom"
import Loader from "../shared/Loader"


type PostFormProps = {
    post?: Models.Document;
}
const PostForm = ({post} :PostFormProps) => {
const {mutateAsync: createPost,isPending :isLoadingCreate} = useCreatePost();
const {user} =useUserContext();
const navigate = useNavigate();
    const form = useForm<z.infer<typeof PostValdiation>>({
        resolver: zodResolver(PostValdiation),
        defaultValues: {
          caption: post ? post?.caption : "",
          file : [],
          location: post ? post?.location : "",
          tags: post ? post?.tags.join(',') : '',

        },
      })
     
      // 2. Define a submit handler.
      async function onSubmit(values: z.infer<typeof PostValdiation>) {
        const newPost = await createPost({
            userId: user.id, // Include userId property here
            caption: values.caption,
            file: values.file,
            location: values.location,
            tags: values.tags
        });
        if (!newPost){
            toast({
                title: "Something went wrong. Please try again",
                variant: "destructive",
            })
        }
navigate ("/");
    }
    
  return (
   
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full  max-w-5xl">
      <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploder filedChange={field.onChange} mediaUrl={post?.imageUrl}/>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
              <Input {...field} type="text" className="shad-input" />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags(separated by comma "," )</FormLabel>
              <FormControl>
              <Input {...field} type="text" className="shad-input" placeholder="#tag1, #tag2"/>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
        <Button type="button" className="shad-button_dark_4">Cancel</Button>
        <Button type="submit" className="shad-button_primary whitespace-nowrap">{isLoadingCreate && <Loader />  }submit</Button>
        </div>
        
      </form>
    </Form>
   
  )
}

export default PostForm
