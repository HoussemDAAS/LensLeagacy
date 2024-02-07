import { z } from "zod";

export const SignupValdiation = z.object({
    name: z.string().min(2,{message: "Name Too short"}).max(50),
  username: z.string().min(2,{message: "Username Too short"}).max(50),
  email: z.string().email(),
  password: z.string().min(8,{message: "Password Too short"}).max(50),
});

export const SigninValdiation = z.object({
email: z.string().email(),
password: z.string().min(8,{message: "Password Too short"}).max(50),
});