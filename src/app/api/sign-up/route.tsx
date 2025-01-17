import dbConnection from "@/app/lib/dbConnection";
import UserModal from "@/app/models/user.modal";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import sendEmailVerification from "@/app/helpers/sendEmailVerification";

export async function POST(req: Request) {
  await dbConnection();
  try {
    const { username, email, password } = await req.json();
   

    const exstingUserWihName = await UserModal.findOne({
      username,
      isVerified: true,
    });
    if (exstingUserWihName) {
      return NextResponse.json(
        { success: false, message: "Username already exists" },
        { status: 400 }
      );
    }

    const exstingUserWihEmail = await UserModal.findOne({
      email,
    });

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    const expireDate = new Date();

    // Date to expire
    expireDate.setHours(expireDate.getHours() + 1);

    // verify code
    const verifyCode = Math.floor(Math.random() * 90000 + 10000).toString();
    if (exstingUserWihEmail) {
      if (exstingUserWihEmail.isVerified) {
        return NextResponse.json(
          { success: false, message: "Email already verified" },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        exstingUserWihEmail.password = hashedPassword;
        exstingUserWihEmail.verifyCode = verifyCode;
        exstingUserWihEmail.verifyCodeExpire = new Date(Date.now() + 360000);

        await exstingUserWihEmail.save();
      }
    } else {
      const newUser = new UserModal({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpire: expireDate,
        isAcceptingMessage: true,
        isVerified: false,
        messages: [],
      });

      await newUser.save();
    }

    // Send Email Notification
    const eamilResponse = await sendEmailVerification(
      username,
      email,
      verifyCode
    );

    if (!eamilResponse.success) {
      console.error("Error in sending email", eamilResponse.message);
      return NextResponse.json(
        { success: false, message: "Error sending email verification" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Email send Successfull please check Your eamil",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in Creating user", error);
    return NextResponse.json(
      { success: true, message: "Error is creating User" },
      { status: 500 }
    );
  }
}
