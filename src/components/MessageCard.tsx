"use client";
import {
  Card,
  CardContent,
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
import {  X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

type MessageCardProps = {  
  
  message: any;
  onMessageDelete: (messageId: any) => void;
};
const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();

  const handleConfirmDelete = async () => {
     await axios.delete(`/api/delete-message/${message._id}`);
    toast({
      title: "Success",
      description: "Message deleted successfully",
    });
    onMessageDelete(message?._id);
  };
  return (
    <div key={message._id}>
     <Card >
  <CardHeader className="flex flex-row justify-between items-center ">
    <CardTitle >Card Title</CardTitle> {/* Ensure text is white */}
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <X className="w-5 h-5 text-white" /> {/* Set text color */}
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
  </CardHeader>
  <CardContent>
    {message.content}
  </CardContent>
</Card>

    </div>
  );
};

export default MessageCard;
