import { z } from "zod"

export const verifySchema = z.object({
    code: z.string().min(6, { message: " verification must be contain 6 digits" })
})