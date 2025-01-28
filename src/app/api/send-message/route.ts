import UserModal from "@/app/models/user.modal";
import dbConnection from "@/app/lib/dbConnection";
import { Message } from "@/app/models/user.modal";
import { ResponseHelper } from "@/app/helpers/ResponseHelper";

export async function POST(req: Request) {
  await dbConnection();
  const { username, content } = await req.json();
  console.log(username, content)

  try {
    const user = await UserModal.findOne({ username });
    if (!user) {
      return ResponseHelper.jsonResponse("User not found", 404);
    }
    // User Accepting the messages
    if (!user.isAcceptingMessage) {
      return ResponseHelper.jsonResponse("User is not accepting messages", 403);
    }
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return ResponseHelper.jsonResponse("message send successfully", 200);
  } catch (error) {
    console.error("Error in sending message", error);
    return ResponseHelper.jsonResponse("Error sending message", 500);
  }
}
