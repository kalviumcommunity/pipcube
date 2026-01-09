import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { createUserSchema } from "@/lib/schemas/userSchema";
import { formatZodError } from "@/lib/schemas/zodErrorFormatter";
import { ZodError } from "zod";
import { handleError } from "@/lib/errorHandler";
import redis from "@/lib/redis";
import { logger } from "@/lib/logger";

const USERS_CACHE_KEY = 'users:all';
const CACHE_TTL = 60; // seconds

export async function POST(req: Request) {
  try {
    const body = await req.json();

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

    // Invalidate Cache
    await redis.del(USERS_CACHE_KEY);
    logger.info("Cache Invalidated", { key: USERS_CACHE_KEY });

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

    // 1. Check Redis Cache
    const cachedUsers = await redis.get(USERS_CACHE_KEY);

    if (cachedUsers) {
      logger.info("Cache Hit", { key: USERS_CACHE_KEY });
      return NextResponse.json({
        success: true,
        message: "Users retrieved successfully (Cached)",
        data: JSON.parse(cachedUsers)
      });
    }

    logger.info("Cache Miss", { key: USERS_CACHE_KEY });

    // 2. Fetch from DB
    const users = await db.user.findMany();

    const sanitizedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }));

    // 3. Store in Redis
    await redis.setex(USERS_CACHE_KEY, CACHE_TTL, JSON.stringify(sanitizedUsers));

    return NextResponse.json({
      success: true,
      message: "Users retrieved successfully",
      data: sanitizedUsers
    });
  } catch (error) {
    return handleError(error, 'GET /api/users');
  }
}
