


// const Page = () => {
//   const [questions, setQuestions] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const name = "John Doe";
//   const { toast } = useToast();
//   const { data: session } = useSession();

//   const form = useForm<z.infer<typeof messageSchema>>({
//     resolver: zodResolver(messageSchema),
//     defaultValues: {
//       content: "",
//     },
//   });

//   // Fetch questions from server

//   const fetchQuestions = async () => {
//     try {
//       const response = await axios.post("/api/suggest-messages");
//       console.log("response", response.data.message);
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle form submission
//   const onSubmit = async (data: z.infer<typeof messageSchema>) => {
//     try {
//       const response = await axios.post("api/send-message", {
//         username: session?.user?.username,
//         content: data.content,
//       });
//       if (response.status === 200) {
//         toast({
//           title: "Success",
//           description: "Message sent successfully",
//         });
//         form.reset();
//       }
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>;

//       toast({
//         title: "Error signing up",
//         description: axiosError.response?.data?.message,
//       });
//     } finally {
//       // Reset form after submission
//       form.reset();
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
//       <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl text-center space-y-6">
//         <h1 className="text-2xl font-bold text-gray-800">Public Profile Link</h1>
//         <p className="text-gray-600 text-sm">
//           Send your anonymous message to{" "}
//           <span className="font-semibold text-blue-600">@{name}</span>
//         </p>

//         <Form {...form}>
        
//           <form onSubmit={form.handleSubmit(onSubmit)}>
//             <Textarea
//               rows={3}
//               className="w-full h-20 bg-gray-100 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
//               placeholder="Write your message here..."
//               {...form.register("content")}
//             />
            
//             {form.formState.errors.content && (
//               <p className="text-red-500">
//                 {form.formState.errors.content.message}
//               </p>
//             )}
//             <button
//               type="submit"
//               className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-300 mt-4"
//               disabled={!form.formState.isValid}
//             >
//               Send Message
//             </button>
//           </form>
//         </Form>
//       </div>

    
//     </div>
//   );
// };

// export default Page;




"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Form } from "@/components/ui/form";
import * as z from "zod";
import { messageSchema } from "../../schemas/messageSchema"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"; // Shadcn form component
import { ApiResponse } from "../../types/apiResponse";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { use } from "react";

const suggestions = [
  "What's a dream destination you've always wanted to visit?",
  "If you could only eat one food for the rest of your life, what would it be?",
  "What's something you've always wanted to do but haven't had the chance yet?",
];


const page =  ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = use(params);
 
  const { toast } = useToast();

  const [message, setMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState("");
  const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
          content: "",
        },
      });

      const onSubmit = async (data: z.infer<typeof messageSchema>) => {
            try {
              const response = await axios.post("api/send-message", {
                username: username,
                content: data.content,
              });
              if (response.status === 200) {
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
            } finally {
              // Reset form after submission
              form.reset();
            }
          };
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {/* Input Field */}
      <h2 className="text-lg font-semibold">Send Anonymous Message to @{username}</h2>
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

      {/* Suggested Messages */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setMessage(suggestions[Math.floor(Math.random() * suggestions.length)])}
      >
        Suggest Messages
      </Button>

      <p className="text-gray-500 text-sm">Click on any message below to select it.</p>

      <Card className="p-4 border">
        <h3 className="font-semibold">Messages</h3>
        <div className="space-y-2 mt-2">
          {suggestions.map((msg, index) => (
            <button
              key={index}
              className={`block w-full text-left p-2 rounded-lg border transition ${
                selectedMessage === msg ? "bg-gray-200 border-gray-400" : "hover:bg-gray-100"
              }`}
              onClick={() => {
                setMessage(msg);
                setSelectedMessage(msg);
              }}
            >
              {index + 1}. {msg}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default page;
