import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SigninValdiation } from "@/lib";
import { z } from "zod";
import Loader from "@/components/ui/shared/Loader";

import { useToast } from "@/components/ui/use-toast";
import {useSignInAccount} from "@/lib/react-query/querie";
import { useUserContext } from "./AuthContext";
import { useState } from "react";

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAutherUser, isLoading: isUserLoading } = useUserContext();
  const [error, setError] = useState('');
  const form = useForm<z.infer<typeof SigninValdiation>>({
  resolver: zodResolver(SigninValdiation),
  defaultValues: {
  
    email: "",
    password: "",
  },
});

  const { mutateAsync: signInAccount, isPending: isSigningInUser } =useSignInAccount();


  async function handleSignin(user: z.infer<typeof SigninValdiation>) {
    setError('');
    try {
      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        setError("Invalid email or password.");
        
        navigate("/sign-in");
        
        return;
      }

      const isLoggedIn = await checkAutherUser();

      if (isLoggedIn) {
        form.reset();

        navigate("/");
      } else {
        toast({ title: "Login failed. Please try again.", });
        
        return;
      }
    } catch (error) {
      console.log({ error });
    }
  }
  return (
    <Form {...form}>
      <div className="sm:w420 flex-center flex-col gap-5" >
        <img src="/assets/images/LensLegacy.png" alt="logo" width={170} height={36}  className="sm:w-48" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log In</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use LensLegacy, Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit( handleSignin)}
          className="flex-col gap-5 w-full mt-4 "
        >
         
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="enter your Email"
                    type="email"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="***"
                    type="password"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && (
            <p className="text-red text-small-semibold text-center">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="shad-button_primary flex justify-center items-center mt-3 gap-2"
          >
            {isUserLoading|| isSigningInUser ? (
              <div className="flex-center gap-2">
                <Loader />
                Loading...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
          <p className="text-light-2 text-small-regular text-center mt-4 mb-4">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
