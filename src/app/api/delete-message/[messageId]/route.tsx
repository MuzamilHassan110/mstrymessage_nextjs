import { NextRequest, NextResponse } from 'next/server';
import mongoose from "mongoose";
import UserModal from "@/app/models/user.modal";
import dbConnection from "@/app/lib/dbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import { ResponseHelper } from "@/app/helpers/ResponseHelper";


export async function DELETE(
  req: NextRequest,
  request: Request, { params }: { params: { messageId: string } } 
)  {
  const { messageId } = params;
  await dbConnection();
  const session = await getServerSession(authOptions);

  const user = session?.user as User; 
  if (!session || !user) {
    return ResponseHelper.jsonResponse("Unauthorized user", 401);
  }

  try {
    const updateResult = await UserModal.updateOne(
      { _id: new mongoose.Types.ObjectId(user._id) },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return ResponseHelper.jsonResponse(
        "Message not found or already deleted",
        404
      );
    }

    return ResponseHelper.jsonResponse("Message deleted successfully", 200);
  } catch (error) {
    console.error("Error in Deleting Message", error);
    return ResponseHelper.jsonResponse("Error Deleting Message", 500);
  }
}
