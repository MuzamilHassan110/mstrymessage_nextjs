import { z } from "zod";

export const messageSchema = z.object({
    content: z.string()
    .min(10, { message: "content must be have at least 10 character" })
    .max(1000, { message: "content must be less than or equal to 1000 character" }),
    
})