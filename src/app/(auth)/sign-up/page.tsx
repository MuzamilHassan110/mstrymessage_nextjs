"use client";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDebounceCallback } from "usehooks-ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupSchema } from "@/app/schemas/signupSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/app/types/apiResponse";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const router = useRouter();

  //  Implementations of the Zod
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  //  Check the unique name
  useEffect(() => {
    const checkUsernameUniqueness = async () => {
      if (!username.trim()) return;

      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          let message = response.data.message;
          setUsernameMessage(message);
        } catch (error) {
          const axiosError = error as any;
          let message = axiosError.response?.data.err[0];

          setUsernameMessage(message ?? "An unexpected error occurred.");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUniqueness();
  }, [username]);

  //  Handle submit request
  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("api/sign-up", data);
      toast({
        title: response.data.message,
        description: response.data.success
          ? "You have successfully signed up!"
          : "Error signing up",
      });
      router.replace(`/verify-code/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Error signing up",
        description: errorMessage,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage>
                    {/* Zod validation error */}
                    {form.formState.errors.username?.message}
                  </FormMessage>

                  {/* Username availability message */}
                  {isCheckingUsername ? (
                    <FormMessage>
                      <Loader2 className="animate-spin" /> Checking username...
                    </FormMessage>
                  ) : (
                    <FormMessage></FormMessage>
                  )}
                  <p
                    className={`${usernameMessage === "Username Unique" ? "text-green-500" : "text-red-500"}`}
                  >
                    {usernameMessage}
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-3 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Signup"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?
            <Link href="/login" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
