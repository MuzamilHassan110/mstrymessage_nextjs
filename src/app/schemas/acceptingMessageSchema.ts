import { z } from "zod"

export const isAcceptingMessageSchema = z.object({
        acceptMessage: z.boolean(),
})