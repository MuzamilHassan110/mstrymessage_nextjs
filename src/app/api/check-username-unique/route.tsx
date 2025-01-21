import dbConnection from "@/app/lib/dbConnection";
import { NextResponse } from "next/server";
import UserModal from "@/app/models/user.modal";
import { usernameValidation } from "../../schemas/signupSchema";
import { z } from "zod";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});
export async function GET(NextRequest: Request) {
  // Database connection
  dbConnection();
  try {
    // get Params
    const { searchParams } = new URL(NextRequest.url);
    const queryParams = { username: searchParams.get("username") };

    // Zod validation
    const result = usernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const err = result.error.format().username?._errors;
      console.error(err);
      return NextResponse.json({ err }, { status: 400 });
    }

    const { username } = result.data;

    const user = await UserModal.findOne({
      username,
      isVerified: true,
    });

    if (user) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is Already exist",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Username Unique",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error in Fetching username", error);
    return NextResponse.json(
      { message: "Error in Fetching Username" },
      { status: 500 }
    );
  }
}
