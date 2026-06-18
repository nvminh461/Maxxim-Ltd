import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ContactSubmission, RateLimitBucket } from "@/lib/models";
import { getRateLimitConfig, getRateLimitKey } from "@/lib/rate-limit";
import { getErrorMessage } from "@/lib/utils";
import { contactSchema } from "@/lib/validation";

export const runtime = "nodejs";

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  try {
    const input = contactSchema.parse(await request.json());
    const secret =
      process.env.CONTACT_RATE_LIMIT_SECRET ||
      process.env.AUTH_SECRET ||
      process.env.NEXTAUTH_SECRET;

    if (!secret) {
      throw new Error("Thiếu CONTACT_RATE_LIMIT_SECRET.");
    }

    await connectToDatabase();
    const { max, windowSeconds } = getRateLimitConfig();
    const { key, expiresAt } = getRateLimitKey(getClientIp(request), secret);
    const bucket = await RateLimitBucket.findOneAndUpdate(
      { key },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    if (bucket.count > max) {
      return NextResponse.json(
        { error: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau." },
        {
          status: 429,
          headers: { "Retry-After": String(windowSeconds) },
        },
      );
    }

    await ContactSubmission.create(input);
    return NextResponse.json(
      { message: "Thank you. We will contact you shortly." },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
  }
}
