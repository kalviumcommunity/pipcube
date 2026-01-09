import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { createUserSchema } from "@/lib/schemas/userSchema";
import { formatZodError } from "@/lib/schemas/zodErrorFormatter";
import { ZodError } from "zod";
import { handleError } from "@/lib/errorHandler";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Simulate error check for POST
    // We can't easily query params on POST body without parsing, but let's stick to GET for the simple simulation

    const validatedData = createUserSchema.parse(body);

    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newUser = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email || "",
        password: hashedPassword,
        role: validatedData.role === 'ADMIN' ? 'ADMIN' : 'USER',
      },
    });

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    if (error instanceof ZodError) {
      // We can use handleError here too but typically validation is 400, not 500.
      // Keeping specific handling for expectation of previous tasks, but wrapping unhandled ones.
      return NextResponse.json(
        {
          error: "Validation Error",
          details: formatZodError(error)
        },
        { status: 400 }
      );
    }
    return handleError(error, 'POST /api/users');
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get('simulateError') === 'true') {
      throw new Error("Simulated Database Error for Testing");
    }

    const users = await db.user.findMany();

    const sanitizedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }));

    return NextResponse.json({
      success: true,
      message: "Users retrieved successfully",
      data: sanitizedUsers
    });
  } catch (error) {
    return handleError(error, 'GET /api/users');
  }
}
