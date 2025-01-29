import { ResponseHelper } from "@/app/helpers/ResponseHelper";
import dbConnection from "@/app/lib/dbConnection";
import UserModal from "@/app/models/user.modal";
import { NextRequest } from "next/server";
export async function POST(request: NextRequest) {
  await dbConnection();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModal.findOne({ username: decodedUsername });
    if (!user) {
      return ResponseHelper.jsonResponse("User not found", 404);
    }
    if (user.verifyCode !== code) {
      return ResponseHelper.jsonResponse("Verification code is incorrect", 401);
    }
    const updatedUser = await UserModal.findByIdAndUpdate(
      user._id,
      { isVerified: true },
      { new: true }
    );
    if (!updatedUser) {
      return ResponseHelper.jsonResponse("Failed to verify user", 404);
    }
    return ResponseHelper.jsonResponse("User verified successfully", 200);
  } catch (error) {
    console.error("error in Verify-code ", error);
    return ResponseHelper.jsonResponse("error in Verify-code", 500);
  }
}
