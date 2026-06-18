import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/api-auth";
import { assertSmallJsonRequest } from "@/lib/media-policy";
import { createUploadUrl } from "@/lib/r2";
import { getErrorMessage } from "@/lib/utils";
import { presignSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (auth.response) return auth.response;

  try {
    assertSmallJsonRequest(request);
    const input = presignSchema.parse(await request.json());
    return NextResponse.json(await createUploadUrl(input));
  } catch (error) {
    const message = getErrorMessage(error);
    return NextResponse.json(
      { error: message },
      { status: message.includes("Payload JSON quá lớn") ? 413 : 400 },
    );
  }
}
