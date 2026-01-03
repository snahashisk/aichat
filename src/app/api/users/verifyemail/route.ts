import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log(reqBody);
    const { userId, otp } = reqBody;
    console.log(userId);

    const user = await User.findOne({
      _id: userId,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid Token Details" },
        { status: 400 }
      );
    } else if (otp === user.verifyToken) {
      console.log(user);

      user.isVerified = true;
      user.verifyToken = undefined;
      user.verifyTokenExpiry = undefined;
      await user.save();
      return NextResponse.json(
        { message: "Email Verification successful!!!", success: true },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
