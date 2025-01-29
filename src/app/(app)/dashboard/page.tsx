"use client"
import React, { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, RefreshCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useMessages } from "../../../hooks/use-messages"
import { useAcceptMessages } from "../../../hooks/use-accept-messages"
import { isAcceptingMessageSchema } from "@/app/schemas/acceptingMessageSchema"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import MessageCard from "@/components/MessageCard"
import { Input } from "@/components/ui/input"


export default function UserDashboard() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [baseUrl, setBaseUrl] = useState("")
  const { messages, fetchMessages, isLoading, deleteMessage } = useMessages()
  const { acceptMessages, setAcceptMessages, isSwitching } = useAcceptMessages()

  const form = useForm({
    resolver: zodResolver(isAcceptingMessageSchema),
    defaultValues: {
      acceptMessages: true,
    },
  })

  const { control, setValue } = form

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(`${window.location.protocol}//${window.location.hostname}:${window.location.port}`)
    }
  }, [])

  const username = session?.user?.username
  const profileUrl = `${baseUrl}/u/${username}`

  const handleCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: "Link Copied",
      description: "Link has been copied to your clipboard",
    })
  }, [profileUrl, toast])

  const handleSwitchMessages = useCallback(
    async (checked: boolean) => {
      try {
        await setAcceptMessages(checked)
        setValue("acceptMessages", checked)
        toast({
          title: "Success",
          description: "Messages accepting status switched successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to switch messages",
          variant: "destructive",
        })
        setValue("acceptMessages", !checked)
      }
    },
    [setAcceptMessages, setValue, toast],
  )

  useEffect(() => {
    if (session?.user) {
      fetchMessages()
    }
  }, [session, fetchMessages])

  if (!session || !session.user) {
    return <div>Please Login</div>
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <Input type="text" value={profileUrl} readOnly className="input input-bordered w-full p-2 mr-2" />
          <Button onClick={handleCopyToClipboard}>Copy</Button>
        </div>
      </div>
      <div className="mb-4">
        <Controller
          name="acceptMessages"
          control={control}
          render={({ field }) => (
            <>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked)
                  handleSwitchMessages(checked)
                }}
                disabled={isSwitching}
              />
              <span className="ml-2">Accept Messages: {field.value ? "On" : "Off"}</span>
              {isSwitching && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </>
          )}
        />
      </div>
      <Separator />
      <Button className="mt-4" variant="outline" onClick={() => fetchMessages(true)} disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 w-4 h-4" />}
        Refresh Messages
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => 
          <React.Fragment key={index}>
          <MessageCard 
            message={message} 
          onMessageDelete={deleteMessage} />
          </React.Fragment>
        )
        ) : (
          <p>No Messages to Display</p>
        )}
      </div>
    </div>
  )
}

