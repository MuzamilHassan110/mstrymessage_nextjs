import { z } from "zod";

export const usernameValidation = z
.string()
.min(3, {message: "username must be at least 3 characters"})
.max(15, {message: "username must be at most 15 characters"})
.regex(/^[a-zA-Z_]+$/, "username must  not be contains any special characters or spaces");

export const signupSchema = z.object({
    username: usernameValidation,
    password: z.string().min(8, {message: "password must be at least 8 characters"}),    
    email: z.string().email({message: "invalid email address"}),
    
})