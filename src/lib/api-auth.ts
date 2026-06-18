import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    return {
      session: null,
      response: NextResponse.json(
        { error: "Bạn cần đăng nhập bằng tài khoản quản trị." },
        { status: 401 },
      ),
    };
  }

  return { session, response: null };
}
