import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import ChatSession from "@/models/sessionModel";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    //validation
    console.log(reqBody);

    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 400 }
      );
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();

      //Send Verification Email
      await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

      const newSession = new ChatSession({
        user: savedUser._id,
        title: "Welcome to Clod GPT",
      });

      const savedSession = await newSession.save();

      console.log(savedSession);

      return NextResponse.json({
        message: "user Registered Successfully",
        success: true,
        savedUser,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
