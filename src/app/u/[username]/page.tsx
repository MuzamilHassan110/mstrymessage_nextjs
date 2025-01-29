"use client"
import React, { useState, useCallback } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField } from "@/components/ui/form"
import type * as z from "zod"
import { messageSchema } from "../../schemas/messageSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { ApiResponse } from "../../types/apiResponse"
import axios, { type AxiosError } from "axios"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { use } from "react"

const initialSuggestions = [
  "What's a dream destination you've always wanted to visit?",
  "If you could only eat one food for the rest of your life, what would it be?",
  "What's something you've always wanted to do but haven't had the chance yet?",
]

const Page = ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = use(params)
  const { toast } = useToast()
  const [selectedMessage, setSelectedMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [suggestionsMessage, setSuggestionsMessage] = useState(initialSuggestions)

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  })

  const makeApiCall = useCallback(
    (endpoint: string) => async (data: any) => {
      setLoading(true)
      try {
        const response = await axios.post(endpoint, data)
        if (response.status === 200) {
          toast({
            title: "Success",
            description: "Operation completed successfully",
          })
          return response.data
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast({
          title: "Error",
          description: axiosError.response?.data?.message || "An error occurred",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const sendMessage = makeApiCall("/api/send-message")
  const getSuggestedMessages = makeApiCall("/api/suggest-messages")

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    await sendMessage({ username, content: data.content })
    form.reset()
  }

  const submitMessage = async (message: string) => {
    await sendMessage({ username, content: message })
    setSelectedMessage(message)
  }

  const handleSuggestedMessage = async () => {
    const result = await getSuggestedMessages({})
    if (result?.message) {
      setSuggestionsMessage(result.message.split("||"))
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-lg font-semibold">Send Anonymous Message to @{username}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Textarea
            rows={3}
            className="w-full h-20 bg-gray-100 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Write your message here..."
            {...form.register("content")}
          />
          {form.formState.errors.content && <p className="text-red-500">{form.formState.errors.content.message}</p>}
          <Button type="submit" className="w-full mt-4" disabled={!form.formState.isValid || loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </Form>

      <Button variant="outline" className="w-full" onClick={handleSuggestedMessage} disabled={loading}>
        {loading ? "Fetching..." : "Suggest Messages"}
      </Button>

      <p className="text-black">Click on any message below to select it.</p>
      <Card className="p-4 border">
    <h3 className="font-semibold">Messages</h3>
    <div className="space-y-2 mt-2">
      {suggestionsMessage.map((msg, index) => (
        <button
          key={index}         
          className={`block w-full text-left p-2 rounded-lg border transition ${
            selectedMessage === msg ? "bg-gray-200 border-gray-400" : "hover:bg-gray-100"
          }`}
          onClick={() => submitMessage(msg)}
          disabled={loading}
        >
          {index + 1}. {msg}
        </button>
      ))}
    </div>
  </Card>
    </div>
  )
}

export default Page

