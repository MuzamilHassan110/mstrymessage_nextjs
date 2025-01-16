import { resend } from "../lib/resendEmail";
import { ApiResponse } from "../types/apiResponse";
import  VerificationEmai  from "../../../emails/EmailVerification";


const sendEmailVerification = async (
    username: string,
    email: string,
    verifyCode: string
): Promise<ApiResponse> => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Email Verification Code',
            react: <VerificationEmai  username = {username} otp = {verifyCode}/>,
          });
       
        return { message: "Email verification sent successfully", success: true };

    } catch (error) {
        console.error("Error sending email verification", error);
        return { message: "Error sending email verification", success: false };
    }
}

export default sendEmailVerification;