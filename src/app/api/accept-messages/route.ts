import dbConnection from "@/app/lib/dbConnection";
import UserModal from "@/app/models/user.modal";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { ResponseHelper } from "@/app/helpers/ResponseHelper";

export async function POST(req: Request) {
  console.log("POST");
    await dbConnection();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return ResponseHelper.jsonResponse("Unauthenticated user", 401);
  }

  try {
    const userId = user?._id;
    const { acceptingMessage } = await req.json();

    const updatedUser = await UserModal.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptingMessage },
      { new: true }
    );

    if (!updatedUser) {
      return ResponseHelper.jsonResponse(
        "Failed to update user message accepting",
        404
      );
    }

    return ResponseHelper.jsonResponse(
      "User message accepting updated successfully",
      200
    );
  } catch (error) {
    console.error("Error in authenticating user message accepting!", error);
    return ResponseHelper.jsonResponse("Error authenticating user", 500);
  }
}

export async function GET() {

  await dbConnection();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return ResponseHelper.jsonResponse("Unauthenticated user", 401);
  }
  try {
    const userId = user._id;
    const foundUser = UserModal.findById(userId);
    if (!foundUser) {
      return ResponseHelper.jsonResponse("User not found", 404);
    }
    return ResponseHelper.jsonResponse(`User found ${foundUser}`, 201);
  } catch (error) {
    console.error("Unauthenticated user in Getting in Messages", error);
    return ResponseHelper.jsonResponse("Error authenticating user", 500);
  }
}
