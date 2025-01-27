"use client";

import type { Message } from "@/app/models/user.modal";
import { isAcceptingMessageSchema } from "@/app/schemas/acceptingMessageSchema";
import type { ApiResponse } from "@/app/types/apiResponse";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { type AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitching, setIsSwitching] = useState<boolean>(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };
  const { data: session } = useSession();
  const username = session?.user?.username;

  const form = useForm({
    resolver: zodResolver(isAcceptingMessageSchema),
  });
  const { setValue, watch } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages", {
        
      });
      setValue("acceptMessages", response.data.isAccesptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data?.message || "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setIsSwitching(false);
    }
  }, [setValue]);

  
  const fetchMessages = useCallback(
    async (refresh = false) => {
      try {
        const response = await axios.get("/api/get-messages");
        setMessages(response.data?.
          messages || []);
     
        if (refresh) {
          toast({
            title: "Success",
            description: "Messages fetched successfully",
          });
          console.log(response);
          console.log(messages);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data?.message || "Failed to fetch messages",
            variant: "destructive",
        });
      }finally{
       
      }
    },
    [] 
  );
  
  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages(true);
    fetchAcceptMessages();
  }, [session, fetchMessages, fetchAcceptMessages]);

  // handle switch messages
  const handleSwitchMessages = async (checked: boolean) => {
    setIsSwitching(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/accept-messages`, {
        isAcceptingMessage: checked,
      });
      setValue("acceptMessages", checked);
      toast({
        title: "Success",
        description: "Messages accepting status switched successfully",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data?.message || "Failed to switch messages",
        variant: "destructive",
      });
      // Revert the switch if the API call fails
      setValue("acceptMessages", !checked);
    } finally {
      setIsSwitching(false);
    }
  };

  useEffect(() => {
    setBaseUrl(`${window.location.protocol}//${window.location.hostname}`);
  }, [baseUrl]);

  const profileUlr = `${baseUrl}/u/${username}`;

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(profileUlr);
    toast({
      title: "Link Copied",
      description: "Link has been copied to your clipboard",
    });
  };

  if (!session || !session.user) {
    return <div>Please Login </div>;
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-boldmb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semiboldmb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUlr}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={handleCopyToClipboard}>Copy</Button>
        </div>
      </div>
      <div className="mb-4">
        <Controller
          name="acceptMessages"
          control={form.control}
          render={({ field }) => (
            <>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  handleSwitchMessages(checked);
                }}
                disabled={isSwitching}
              />
              <span className="ml-2">
                Accept Messages: {acceptMessages ? "On" : "Off"}
              </span>
              {isSwitching && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </>
          )}
        />
      </div>
      <Separator />
      <Button
        className="mt-4"
        variant={"outline"}
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-3 h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
            <RefreshCcw className="w-4 h-4" />
          </>
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => {
            return (        
            
               <MessageCard
               key={message._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            
            );
          })
        ) : (
          <p>No Message To Dispaly</p>
        )}
      </div>
    </div>
   
   
  );
};

export default page;
