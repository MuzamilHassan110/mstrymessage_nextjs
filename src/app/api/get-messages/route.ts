import UserModal from "@/app/models/user.modal";
import dbConnection from "@/app/lib/dbConnection";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { User } from "next-auth";
import { ResponseHelper } from "../../helpers/ResponseHelper";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("GET");
  await dbConnection();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;
  console.log("user", user, session, "session");

  if (!session) {
    return ResponseHelper.jsonResponse("Unauthorized user", 401);
  }
  const userId = new mongoose.Types.ObjectId(user._id);
  console.log("userId: " + userId);

  try {
    const user = await UserModal.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);
   
    if (!user || user.length === 0) {
      return ResponseHelper.jsonResponse("There is No Message ", 404);
    }
   

    return NextResponse.json(
      { succes: true, messages: user[0].messages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in Getting messages !", error);
    return ResponseHelper.jsonResponse("Error in Getting messages", 500);
  }
}
