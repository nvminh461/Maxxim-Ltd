import test from "node:test";
import assert from "node:assert/strict";
import { getRateLimitKey, hashRateLimitIdentity } from "../src/lib/rate-limit";
import { validateMediaFile } from "../src/lib/r2";
import { slugify } from "../src/lib/utils";
import { contactSchema, propertySchema } from "../src/lib/validation";

test("slugify tạo slug ổn định từ nội dung có dấu", () => {
  assert.equal(slugify("Căn hộ Kensington 2026!"), "can-ho-kensington-2026");
});

test("contactSchema validate dữ liệu form liên hệ", () => {
  const valid = contactSchema.parse({
    fullName: "Alex Nguyen",
    phone: "0900 000 000",
    email: "alex@example.com",
    projectBrief: "I want to discuss renting out spare bedrooms in London.",
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

test("propertySchema giữ thứ tự media và yêu cầu ảnh chính + ảnh phụ", () => {
  const property = propertySchema.parse({
    title: "Kensington Student Flat",
    slug: "kensington-student-flat",
    cityId: "0123456789abcdef01234567",
    listingType: "sale",
    propertyType: "apartment",
    price: 875000,
    bedrooms: 2,
    bathrooms: 1,
    area: "720 sq ft",
    university: "Imperial College London",
    description: "A bright two-bedroom flat near Imperial College.",
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

  assert.equal(property.media[0].alt, "Main image");
  assert.throws(() =>
    propertySchema.parse({ ...property, media: property.media.slice(0, 1) }),
  );
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
