import test from "node:test";
import assert from "node:assert/strict";
import { getRateLimitKey, hashRateLimitIdentity } from "../src/lib/rate-limit";
import { validateMediaFile } from "../src/lib/r2";
import { slugify } from "../src/lib/utils";
import { contactSchema, projectSchema } from "../src/lib/validation";

test("slugify tạo slug ổn định từ nội dung có dấu", () => {
  assert.equal(slugify("Biệt thự Ánh Sáng 2026!"), "biet-thu-anh-sang-2026");
});

test("contactSchema validate dữ liệu form liên hệ", () => {
  const valid = contactSchema.parse({
    fullName: "Alex Nguyen",
    phone: "0900 000 000",
    email: "alex@example.com",
    projectBrief: "I want to discuss a new villa project.",
  });
  assert.equal(valid.email, "alex@example.com");

  assert.throws(() =>
    contactSchema.parse({
      fullName: "A",
      phone: "1",
      email: "bad",
      projectBrief: "short",
    }),
  );
});

test("projectSchema giữ thứ tự media và yêu cầu ảnh chính + ảnh phụ", () => {
  const project = projectSchema.parse({
    title: "Aurora Villa",
    slug: "aurora-villa",
    categoryId: "0123456789abcdef01234567",
    year: "2026",
    location: "Phu Quoc",
    area: "1,000 sq m",
    summary: "A private villa with a calm coastal atmosphere.",
    media: [
      {
        assetId: "0123456789abcdef01234567",
        url: "https://assets.example.com/main.jpg",
        alt: "Main image",
      },
      {
        assetId: "0123456789abcdef01234568",
        url: "https://assets.example.com/album.jpg",
        alt: "Album image",
      },
    ],
  });

  assert.equal(project.media[0].alt, "Main image");
  assert.throws(() => projectSchema.parse({ ...project, media: project.media.slice(0, 1) }));
});

test("validateMediaFile kiểm tra loại file và dung lượng upload", () => {
  process.env.R2_MAX_IMAGE_MB = "10";
  assert.doesNotThrow(() => validateMediaFile("image", "image/webp", 10 * 1024 * 1024));
  assert.throws(() => validateMediaFile("image", "image/gif", 1024));
  assert.throws(() => validateMediaFile("image", "image/jpeg", 11 * 1024 * 1024));
});

test("rate limit key không lưu IP thô và ổn định trong cùng cửa sổ", () => {
  process.env.CONTACT_RATE_LIMIT_WINDOW_SECONDS = "900";
  const secret = "test-secret";
  const ip = "203.0.113.10";
  const first = getRateLimitKey(ip, secret, 1_800_000);
  const second = getRateLimitKey(ip, secret, 1_801_000);

  assert.equal(first.key, second.key);
  assert.ok(!first.key.includes(ip));
  assert.equal(first.key.split(":")[0], hashRateLimitIdentity(ip, secret));
});
