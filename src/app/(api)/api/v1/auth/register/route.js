import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { customAlphabet } from "nanoid";
import { resend } from "@/utils/resend";

export async function POST(req) {
  const { firstName, lastName, username, email, password } = await req.json();

  try {
    // Create hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user to database
    const createUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
      },
    });

    // If user created successfully, create verification code
    if (createUser) {
      const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890", 10);
      const generatedCode = nanoid(4);
      const generateCode = await prisma.verificationCode.create({
        data: {
          userId: createUser.id,
          code: generatedCode,
        },
      });
      const sendEmail = await resend.emails.send({
        from: "Ibrahimcious <ibrahimcious@devscale.id>",
        to: createUser.email,
        subject: "Verification Code - Digicommerce",
        html: `<h3>Thank you for registering</h3>
        <p>Your verification code is <strong>${generatedCode}</strong></p>
        <a href="http://localhost:3000/verify?userid=${createUser.id}&code=${generatedCode}">Click here to verify your account</a>
        `,
      });
      console.log(sendEmail);
    }

    return NextResponse.json(
      { data: createUser, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { errorMessage: "Something went wrong. Please try again later" },
      { status: 500 }
    );
  }
}
