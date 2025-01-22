import UserModal from "@/app/models/user.modal";
import dbConnection from "@/app/lib/dbConnection";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next"
import { User } from  "next-auth";
import { ResponseHelper } from "../../helpers/ResponseHelper"
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function GET(req:Request){
    await dbConnection();
    const session = await getServerSession(authOptions)
    console.log("session",session)
    const user = session?.user as User; 
    console.log(user)
    if(!session || session?.user){
        return ResponseHelper.jsonResponse("Unauthorized user", 401);
    }

    // here issue is created when we use the aggregation then id should be not a string so 
    // now i covert this id into a string

    const userId = new  mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModal.aggregate(
            [
                {
                    $match: {
                        id: userId
                    }
                },
                {
                    $unwind: '$messages',
                },
                {
                    $sort: {
                        'messages.createdAt': -1
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        messages: {
                            $push: "$messages"
                        }
                    }
                }
            ]
        )
        if(!user || user.length === 0){
            return ResponseHelper.jsonResponse("User not found", 404);
        }

        return NextResponse.json({succes: true, message: user[0].message}, {status: 200});
    } catch (error) {
        console.error("Error in Getting messages !",error);
        return ResponseHelper.jsonResponse("Error in Getting messages", 500);
    }
}