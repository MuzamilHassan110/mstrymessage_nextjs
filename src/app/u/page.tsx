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
  const [questions, setQuestions] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const name = "John Doe"; 
  const { toast } = useToast();
  const { data: session } = useSession();
  
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  
  // Fetch questions from server

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    setQuestions(null);

    try {
      // const response = await fetch("/api/suggest-messages", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      // });
      const response = await axios.post("/api/suggest-messages")
        console.log("response",response)
     

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let result = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value, { stream: true });
        }
      }

      setQuestions(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };


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
       
       toast({
        title: "Error signing up",
        description: axiosError.response?.data?.message,
      });
       
    }
    finally{
        // Reset form after submission
        form.reset();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Public Profile Link</h1>
        <p className="text-gray-600 text-sm">
          Send your anonymous message to{" "}
          <span className="font-semibold text-blue-600">@{name}</span>
        </p>

        <Form {...form}>
        
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Textarea
              rows={3}
              className="w-full h-20 bg-gray-100 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Write your message here..."
              {...form.register("content")}
            />
            
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
      </div> */}

      <section className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">AI Question Generator</h1>
      <button
        onClick={fetchQuestions}
        disabled={loading}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? "Generating..." : "Generate Questions"}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {questions && (
        <div className="mt-6 p-4 bg-white rounded shadow">
          <h2 className="font-bold text-lg mb-2">Generated Questions:</h2>
          <>{questions.split("||").map((q, i) => <div key={i}>{i + 1}. {q}</div>)}</>
        </div>
      )}
    </section>
    </div>
  );
};

export default Page;
