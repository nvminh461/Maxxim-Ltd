import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireAdminSession } from "@/lib/api-auth";
import { getAdminResource } from "@/lib/cms-data";
import { connectToDatabase } from "@/lib/db";
import {
  Banner,
  Category,
  ContactSubmission,
  MarqueeItem,
  Property,
  SiteSettings,
} from "@/lib/models";
import { cleanupUnusedAssets } from "@/lib/r2";
import { getErrorMessage, slugify } from "@/lib/utils";
import {
  bannerSchema,
  categorySchema,
  marqueeSchema,
  propertySchema,
  settingsSchema,
} from "@/lib/validation";

export const runtime = "nodejs";

type RouteParams = {
  params: Promise<{ resource: string; parts?: string[] }>;
};

function errorResponse(error: unknown, status = 400) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Dữ liệu chưa hợp lệ.",
        fields: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status },
    );
  }

  const mongoError = error as { code?: number };
  if (mongoError?.code === 11000) {
    return NextResponse.json(
      { error: "Slug hoặc giá trị duy nhất này đã được sử dụng." },
      { status: 409 },
    );
  }

  return NextResponse.json({ error: getErrorMessage(error) }, { status });
}

async function authorize() {
  const auth = await requireAdminSession();
  return auth.response;
}

export async function GET(request: NextRequest, context: RouteParams) {
  const unauthorized = await authorize();
  if (unauthorized) return unauthorized;

  try {
    const { resource, parts } = await context.params;
    await connectToDatabase();

    if (parts?.[0]) {
      if (resource === "contacts") {
        const contact = await ContactSubmission.findById(parts[0]).lean();
        if (!contact) {
          return NextResponse.json({ error: "Không tìm thấy liên hệ." }, { status: 404 });
        }
        return NextResponse.json({
          id: String(contact._id),
          fullName: contact.fullName,
          phone: contact.phone,
          email: contact.email,
          projectBrief: contact.projectBrief,
          createdAt: contact.createdAt.toISOString(),
        });
      }
      return NextResponse.json({ error: "Không tìm thấy dữ liệu." }, { status: 404 });
    }

    const search = request.nextUrl.searchParams.get("q") || undefined;
    const page = Number(request.nextUrl.searchParams.get("page") || 1);
    return NextResponse.json(await getAdminResource(resource, search, page));
  } catch (error) {
    return errorResponse(error, 500);
  }
}

export async function POST(request: Request, context: RouteParams) {
  const unauthorized = await authorize();
  if (unauthorized) return unauthorized;

  try {
    const { resource } = await context.params;
    const body = await request.json();
    await connectToDatabase();

    if (body.action === "reorder" && Array.isArray(body.ids)) {
      const model =
        resource === "categories"
          ? Category
          : resource === "properties"
            ? Property
            : resource === "banners"
              ? Banner
              : resource === "marquee"
                ? MarqueeItem
                : null;
      if (!model) throw new Error("Tài nguyên không hỗ trợ sắp xếp.");

      await Promise.all(
        body.ids.map((id: string, order: number) =>
          model.updateOne({ _id: id }, { $set: { order } }),
        ),
      );
      return NextResponse.json({ success: true });
    }

    if (resource === "properties" && body.action === "reorder-featured") {
      const ids = Array.isArray(body.ids) ? body.ids : [];
      await Property.updateMany({}, { $set: { featured: false, featuredOrder: 0 } });
      await Promise.all(
        ids.slice(0, 8).map((id: string, featuredOrder: number) =>
          Property.updateOne(
            { _id: id },
            { $set: { featured: true, featuredOrder } },
          ),
        ),
      );
      return NextResponse.json({ success: true });
    }

    if (resource === "categories") {
      const input = categorySchema.parse({
        ...body,
        slug: body.slug || slugify(body.name || ""),
      });
      const category = await Category.create(input);
      return NextResponse.json({ id: category._id.toString() }, { status: 201 });
    }

    if (resource === "properties") {
      const input = propertySchema.parse({
        ...body,
        slug: body.slug || slugify(body.title || ""),
      });
      const property = await Property.create(input);
      return NextResponse.json({ id: property._id.toString() }, { status: 201 });
    }

    if (resource === "banners") {
      const input = bannerSchema.parse(body);
      const banner = await Banner.create(input);
      return NextResponse.json({ id: banner._id.toString() }, { status: 201 });
    }

    if (resource === "marquee") {
      const input = marqueeSchema.parse(body);
      const item = await MarqueeItem.create(input);
      return NextResponse.json({ id: item._id.toString() }, { status: 201 });
    }

    if (resource === "settings") {
      const input = settingsSchema.parse(body);
      const settings = await SiteSettings.findOneAndUpdate(
        { key: "global" },
        { $set: input },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      return NextResponse.json({ id: settings._id.toString() });
    }

    throw new Error("Tài nguyên CMS không hợp lệ.");
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request, context: RouteParams) {
  const unauthorized = await authorize();
  if (unauthorized) return unauthorized;

  try {
    const { resource, parts } = await context.params;
    const id = parts?.[0];
    const body = await request.json();
    await connectToDatabase();

    if (!id && resource !== "settings") {
      return NextResponse.json({ error: "Thiếu ID bản ghi." }, { status: 400 });
    }

    if (resource === "categories") {
      const input = categorySchema.parse({
        ...body,
        slug: body.slug || slugify(body.name || ""),
      });
      await Category.findByIdAndUpdate(id, input, { runValidators: true });
      return NextResponse.json({ success: true });
    }

    if (resource === "properties") {
      const input = propertySchema.parse({
        ...body,
        slug: body.slug || slugify(body.title || ""),
      });
      const old = await Property.findById(id).lean();
      if (!old) return NextResponse.json({ error: "Không tìm thấy bất động sản." }, { status: 404 });
      await Property.findByIdAndUpdate(id, input, { runValidators: true });
      const nextIds = new Set(input.media.map((item) => item.assetId));
      await cleanupUnusedAssets(
        old.media
          .map((item: { assetId: unknown }) => String(item.assetId))
          .filter((assetId: string) => !nextIds.has(assetId)),
      );
      return NextResponse.json({ success: true });
    }

    if (resource === "banners") {
      const input = bannerSchema.parse(body);
      const old = await Banner.findById(id).lean();
      if (!old) return NextResponse.json({ error: "Không tìm thấy banner." }, { status: 404 });
      await Banner.findByIdAndUpdate(id, input, { runValidators: true });
      if (String(old.assetId) !== input.assetId) {
        await cleanupUnusedAssets([String(old.assetId)]);
      }
      return NextResponse.json({ success: true });
    }

    if (resource === "marquee") {
      const input = marqueeSchema.parse(body);
      const old = await MarqueeItem.findById(id).lean();
      if (!old) return NextResponse.json({ error: "Không tìm thấy ảnh." }, { status: 404 });
      await MarqueeItem.findByIdAndUpdate(id, input, { runValidators: true });
      if (String(old.assetId) !== input.assetId) {
        await cleanupUnusedAssets([String(old.assetId)]);
      }
      return NextResponse.json({ success: true });
    }

    if (resource === "settings") {
      const input = settingsSchema.parse(body);
      const old = await SiteSettings.findOne({ key: "global" }).lean();
      await SiteSettings.findOneAndUpdate(
        { key: "global" },
        { $set: input },
        { upsert: true, new: true, runValidators: true },
      );
      if (old) {
        const previousIds = [
          old.logoAssetId ? String(old.logoAssetId) : "",
          ...old.socialLinks.map((item: { iconAssetId?: unknown }) =>
            item.iconAssetId ? String(item.iconAssetId) : "",
          ),
        ];
        const nextIds = new Set([
          input.logoAssetId,
          ...input.socialLinks.map((item) => item.iconAssetId),
        ]);
        await cleanupUnusedAssets(previousIds.filter((assetId) => !nextIds.has(assetId)));
      }
      return NextResponse.json({ success: true });
    }

    throw new Error("Tài nguyên CMS không hợp lệ.");
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteParams) {
  const unauthorized = await authorize();
  if (unauthorized) return unauthorized;

  try {
    const { resource, parts } = await context.params;
    const id = parts?.[0];
    if (!id) return NextResponse.json({ error: "Thiếu ID bản ghi." }, { status: 400 });
    await connectToDatabase();

    if (resource === "categories") {
      const inUse = await Property.exists({ cityId: id });
      if (inUse) {
        return NextResponse.json(
          { error: "Không thể xóa thành phố đang được bất động sản sử dụng." },
          { status: 409 },
        );
      }
      await Category.findByIdAndDelete(id);
      return NextResponse.json({ success: true });
    }

    if (resource === "properties") {
      const property = await Property.findByIdAndDelete(id);
      if (property) {
        await cleanupUnusedAssets(
          property.media.map((item: { assetId: unknown }) => String(item.assetId)),
        );
      }
      return NextResponse.json({ success: true });
    }

    if (resource === "banners") {
      if ((await Banner.countDocuments()) <= 1) {
        return NextResponse.json(
          { error: "Website phải có ít nhất một banner." },
          { status: 409 },
        );
      }
      const banner = await Banner.findByIdAndDelete(id);
      if (banner) await cleanupUnusedAssets([String(banner.assetId)]);
      return NextResponse.json({ success: true });
    }

    if (resource === "marquee") {
      const item = await MarqueeItem.findByIdAndDelete(id);
      if (item) await cleanupUnusedAssets([String(item.assetId)]);
      return NextResponse.json({ success: true });
    }

    throw new Error("Tài nguyên không hỗ trợ xóa.");
  } catch (error) {
    return errorResponse(error);
  }
}
