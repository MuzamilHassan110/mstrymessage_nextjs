import { useState, useCallback } from "react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import type { Message } from "@/app/models/user.modal"


export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchMessages = useCallback(
    async (refresh = false) => {
      setIsLoading(true)
      try {
        const response = await axios.get("/api/get-messages");
         setMessages(response.data?.messages || [])
        if (refresh) {
          toast({
            title: "Success",
            description: "Messages fetched successfully",
          })
        }
      } catch (error) {       
        toast({
          title: "Error",
          description: "Failed to fetch messages",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const deleteMessage = useCallback((messageId: string) => {
    setMessages((prevMessages) => prevMessages.filter((message) => message._id !== messageId))
  }, [])

  return { messages, isLoading, fetchMessages, deleteMessage }
}

