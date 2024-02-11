import { z } from "zod";

export const SignupValdiation = z.object({
    name: z.string().min(2,{message: "Name Too short"}).max(50),
  username: z.string().min(2,{message: "Username Too short"}).max(50),
  email: z.string().email(),
  password: z.string().min(8,{message: "Password Too short"}).max(50),
});

export const SigninValdiation = z.object({
email: z.string().email(),
password: z.string().min(8).max(50),
});
export const PostValdiation = z.object({
  caption :z.string().min(5).max(100),
  file: z.custom<File[]>(),
  location: z.string().min(2,{message: "Location Too short"}).max(50),
  tags: z.string().min(2,{message: "Tags Too short"}).max(50),
  });
  export const ProfileValidation = z.object({
    file: z.custom<File[]>(),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    username: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email(),
    bio: z.string(),
  });