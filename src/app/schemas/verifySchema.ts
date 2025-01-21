import { z } from "zod"

export const verifySchema = z.object({
    code: z.string().min(5, { message: " verification must be contain 5 digits" })
})