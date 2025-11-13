//Nextjs server runs on edge by default
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

//routes in the app directory use the new NextRequest and NextResponse objects (https://nextjs.org/docs/15/app/api-reference/file-conventions/route)
export async function GET(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }
    await connectToDatabase();
    const exisitingUser = await User.findOne({ email });
    if (exisitingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 422 }
      );
    }
    const newUser = await User.create({ email, password });
    return NextResponse.json(
      { message: "User created successfully", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
