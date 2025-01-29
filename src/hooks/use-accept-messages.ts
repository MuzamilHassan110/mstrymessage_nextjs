import { useState, useCallback } from "react"
import axios, { type AxiosError } from "axios"
import { useToast } from "@/hooks/use-toast"
import type { ApiResponse } from "@/app/types/apiResponse"

export function useAcceptMessages() {
  const [acceptMessages, setAcceptMessages] = useState(true)
  const [isSwitching, setIsSwitching] = useState(false)
  const { toast } = useToast()

  const setAcceptMessagesState = useCallback(
    async (checked: boolean) => {
      setIsSwitching(true)
      try {
        await axios.post<ApiResponse>(`/api/accept-messages`, {
          isAcceptingMessage: checked,
        });
        toast({
          title: "Success",
          description: "Message is Accepted",
          
        })
        setAcceptMessages(checked)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast({
          title: "Error",
          description: axiosError.response?.data?.message || "Failed to switch messages",
          variant: "destructive",
        })
        throw error
      } finally {
        setIsSwitching(false)
      }
    },
    [toast],
  )

  return { acceptMessages, setAcceptMessages: setAcceptMessagesState, isSwitching }
}

