"use client"
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Form } from "@/components/ui/form";
import * as z from "zod";
import { messageSchema } from "../schemas/messageSchema"; // Ensure your messageSchema is correct
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"; // Shadcn form component
import { ApiResponse } from "../types/apiResponse";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

const Page = () => {
  const name = "John Doe"; 
  const { toast } = useToast();
  const { data: session } = useSession();
  
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    
    try {
        const response = await axios.post("api/send-message", {
             username: session?.user?.username,  
            content: data.content,
        });
       if(response.status === 200) {
           toast({
               title: "Success",
               description: "Message sent successfully",
           });
           form.reset();
       }
        
    } catch (error) {
       const axiosError = error as AxiosError<ApiResponse>; 
       console.error("API Error:", axiosError.response?.data?.message); 
       toast({
        title: "Error signing up",
        description: axiosError.response?.data?.message,
      });
       
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Public Profile Link</h1>
        <p className="text-gray-600 text-sm">
          Send your anonymous message to{" "}
          <span className="font-semibold text-blue-600">@{name}</span>
        </p>

        <Form {...form}>
          {/* Connect handleSubmit to the form */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Textarea
              rows={3}
              className="w-full h-20 bg-gray-100 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Write your message here..."
              {...form.register("content")}
            />
            {/* Show error message if validation fails */}
            {form.formState.errors.content && (
              <p className="text-red-500">
                {form.formState.errors.content.message}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-300 mt-4"
              disabled={!form.formState.isValid}
            >
              Send Message
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
