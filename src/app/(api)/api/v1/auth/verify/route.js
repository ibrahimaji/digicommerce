import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function POST(req) {
  const { userId, code } = await req.json();

  try {
    const findUserAndCode = await prisma.verificationCode.findFirst({
      where: {
        userId,
        code,
      },
    });
    if (!findUserAndCode) {
      return NextResponse.json(
        { errorMessage: "User not found" },
        { status: 404 }
      );
    }

    const updateUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        verified: true,
      },
    });
    return NextResponse.json({ message: "User verified, Please login!" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { errorMessage: "Something went wrong. Please try again later" },
      { status: 500 }
    );
  }
}
