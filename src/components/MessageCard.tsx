"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Key, X } from "lucide-react";
import { Message } from "@/app/models/user.modal";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

type MessageCardProps = {
  key: any,
  message: any;
  onMessageDelete: (messageId: any) => void;
};
const MessageCard = ({ message, onMessageDelete, key }: MessageCardProps) => {
  const { toast } = useToast();
  console.log("message card", message);
  const handleConfirmDelete = async () => {
    const response = await axios.delete(`/api/delete-message/${message._id}`);
    toast({
      title: "Success",
      description: "Message deleted successfully",
    });
    onMessageDelete(message?._id);
  };
  return (
    <div key={key}>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <X className="w-5 h-5 " />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <CardDescription>{message.content}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageCard;
