// components/email/EmailTemplate.tsx

import React from "react";
import {
  Html,
  Head,
  Font,
  Section,
  Preview,
  Body,
  Container,
  Heading,
  Row,
  Text,
  Button,
} from "@react-email/components";

export type EmailTemplateProps = {
  username: string;
  otp: string;
};

const VerificationEmai: React.FC<EmailTemplateProps> = ({ username, otp }) => {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
      </Head>

      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Welcome to Our Platform</Heading>
          <Text style={paragraph}>Hi {username},</Text>
          <Text>Here&apos;s your Verification code: {otp}</Text>
          <Text style={paragraph}>
            Thanks Your Registering. Please use the following Verification code
            to complete your Verification
          </Text>
          {/* <Button style={button} href={actionUrl}>
            Get Started
          </Button> */}
          <Text style={paragraph}>
            If you have any questions, feel free to reach out.
          </Text>
          <Text style={paragraph}>
            Cheers,
            <br />
            The Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmai;

// Styles
const main = {
  backgroundColor: "#f5f5f5",
  fontFamily: "Arial, sans-serif",
  padding: "20px",
};
const container = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "10px",
};
const heading = { fontSize: "24px", color: "#333333", margin: "0 0 20px 0" };
const paragraph = { fontSize: "16px", lineHeight: "1.5", color: "#555555" };
const button = {
  backgroundColor: "#007bff",
  color: "#ffffff",
  padding: "10px 20px",
  textDecoration: "none",
  borderRadius: "5px",
  display: "inline-block",
  fontWeight: "bold",
};
