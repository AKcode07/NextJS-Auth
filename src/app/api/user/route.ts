import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from 'bcrypt';
import * as z from 'zod';

const userSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
  })


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email , password } = userSchema.parse(body);

    const existingUserByEmail = await db.users.findFirst({ where: { email } });
    if (existingUserByEmail) {
      return NextResponse.json({users: null, message: "Email already exists" }, { status: 409 });
    }

    const existingUserByUsername = await db.users.findFirst({ where: { username } });
    if (existingUserByUsername) {
      return NextResponse.json({users: null, message: "Username already exists" }, { status: 409 });
    }

    const hashedPassword = await hash(password, 10);
    const newuser = await db.users.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    const { password: newUserPassword, ...rest } = newuser;

    return NextResponse.json({
      users: rest,
      message: "User created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Something went wrong"
    },{status: 500});
  }
}
