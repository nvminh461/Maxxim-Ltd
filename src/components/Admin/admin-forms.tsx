"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import type {
  BannerValue,
  CategoryValue,
  ListingType,
  MarqueeValue,
  PropertyType,
  PropertyValue,
  SiteSettingsValue,
} from "@/lib/cms-types";
import { slugify } from "@/lib/utils";
import MediaUploader from "./media-uploader";
import SortableList from "./sortable-list";

export function EditorModal({
  children,
  onClose,
  title,
}: {
  children: ReactNode;
  onClose: () => void;
  title: string;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div aria-modal="true" className="admin-modal-backdrop" role="dialog">
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} type="button">
            Đóng
          </button>
        </div>
        <div className="admin-modal-body">{children}</div>
      </div>
    </div>
  );
}

function FormActions({ loading, onCancel }: { loading: boolean; onCancel: () => void }) {
  return (
    <div className="admin-form-actions">
      <button onClick={onCancel} type="button">
        Hủy
      </button>
      <button className="admin-primary" disabled={loading} type="submit">
        {loading ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </div>
  );
}

export function CategoryForm({
  initial,
  onCancel,
  onSave,
}: {
  initial?: CategoryValue;
  onCancel: () => void;
  onSave: (value: Omit<CategoryValue, "id">) => Promise<void>;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    await onSave({ name, slug: slug || slugify(name), order: initial?.order || 0 });
    setLoading(false);
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <label>
        <span>Tên thành phố — Nội dung tiếng Anh</span>
        <input onChange={(event) => setName(event.target.value)} required value={name} />
      </label>
      <label>
        <span>Slug</span>
        <input
          onChange={(event) => setSlug(event.target.value)}
          placeholder={slugify(name)}
          value={slug}
        />
      </label>
      <FormActions loading={loading} onCancel={onCancel} />
    </form>
  );
}

export function BannerForm({
  initial,
  onCancel,
  onSave,
}: {
  initial?: BannerValue;
  onCancel: () => void;
  onSave: (value: Omit<BannerValue, "id">) => Promise<void>;
}) {
  const [value, setValue] = useState<Omit<BannerValue, "id">>({
    assetId: initial?.assetId || "",
    type: initial?.type || "image",
    src: initial?.src || "",
    alt: initial?.alt || "",
    title: initial?.title || "",
    subtitle: initial?.subtitle || "",
    ctaLabel: initial?.ctaLabel || "",
    link: initial?.link || "",
    order: initial?.order || 0,
  });
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    await onSave(value);
    setLoading(false);
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="admin-field">
        <span>Media banner</span>
        <div className="admin-preview admin-preview-banner">
          {value.src ? (
            value.type === "video" ? (
              <video controls src={value.src} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt={value.alt} src={value.src} />
            )
          ) : (
            <p>Chưa có media</p>
          )}
        </div>
        <div className="admin-upload-row">
          <MediaUploader
            accept="image/jpeg,image/png,image/webp,image/avif"
            kind="image"
            label="Upload ảnh"
            onUploaded={(asset) =>
              setValue((current) => ({
                ...current,
                assetId: asset.id,
                src: asset.url,
                type: "image",
              }))
            }
          />
          <MediaUploader
            accept="video/mp4,video/webm"
            kind="video"
            label="Upload video"
            onUploaded={(asset) =>
              setValue((current) => ({
                ...current,
                assetId: asset.id,
                src: asset.url,
                type: "video",
              }))
            }
          />
        </div>
        <small>Preview desktop 16:9; trên mobile media được crop theo khung 9:16.</small>
      </div>
      <label>
        <span>Tiêu đề — Nội dung tiếng Anh</span>
        <input
          onChange={(event) => setValue({ ...value, title: event.target.value })}
          required
          value={value.title}
        />
      </label>
      <label>
        <span>Phụ đề — Nội dung tiếng Anh</span>
        <input
          onChange={(event) => setValue({ ...value, subtitle: event.target.value })}
          required
          value={value.subtitle}
        />
      </label>
      {value.type === "image" ? (
        <label>
          <span>Alt ảnh — Nội dung tiếng Anh</span>
          <input
            onChange={(event) => setValue({ ...value, alt: event.target.value })}
            required
            value={value.alt}
          />
        </label>
      ) : null}
      <div className="admin-form-grid">
        <label>
          <span>Nhãn nút CTA — Nội dung tiếng Anh</span>
          <input
            onChange={(event) => setValue({ ...value, ctaLabel: event.target.value })}
            value={value.ctaLabel}
          />
        </label>
        <label>
          <span>Liên kết (URL, /properties/... hoặc #anchor)</span>
          <input
            onChange={(event) => setValue({ ...value, link: event.target.value })}
            value={value.link}
          />
        </label>
      </div>
      <FormActions loading={loading} onCancel={onCancel} />
    </form>
  );
}

export function MarqueeForm({
  initial,
  onCancel,
  onSave,
}: {
  initial?: MarqueeValue;
  onCancel: () => void;
  onSave: (value: Omit<MarqueeValue, "id">) => Promise<void>;
}) {
  const [value, setValue] = useState<Omit<MarqueeValue, "id">>({
    assetId: initial?.assetId || "",
    src: initial?.src || "",
    alt: initial?.alt || "",
    order: initial?.order || 0,
  });
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="admin-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        await onSave(value);
        setLoading(false);
      }}
    >
      <div className="admin-field">
        <span>Ảnh marquee — Preview 16:10</span>
        <div className="admin-preview admin-preview-marquee">
          {value.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={value.alt} src={value.src} />
          ) : (
            <p>Chưa có ảnh</p>
          )}
        </div>
        <MediaUploader
          accept="image/jpeg,image/png,image/webp,image/avif"
          kind="image"
          label="Upload ảnh"
          onUploaded={(asset) =>
            setValue({ ...value, assetId: asset.id, src: asset.url })
          }
        />
      </div>
      <label>
        <span>Alt ảnh — Nội dung tiếng Anh</span>
        <input
          onChange={(event) => setValue({ ...value, alt: event.target.value })}
          required
          value={value.alt}
        />
      </label>
      <FormActions loading={loading} onCancel={onCancel} />
    </form>
  );
}

export function PropertyForm({
  categories,
  initial,
  onCancel,
  onSave,
}: {
  categories: CategoryValue[];
  initial?: PropertyValue;
  onCancel: () => void;
  onSave: (value: Omit<PropertyValue, "id" | "city">) => Promise<void>;
}) {
  const [value, setValue] = useState<Omit<PropertyValue, "id" | "city">>({
    slug: initial?.slug || "",
    title: initial?.title || "",
    cityId: initial?.cityId || categories[0]?.id || "",
    listingType: initial?.listingType || "sale",
    propertyType: initial?.propertyType || "apartment",
    price: initial?.price || 0,
    bedrooms: initial?.bedrooms || 1,
    bathrooms: initial?.bathrooms || 1,
    area: initial?.area || "",
    university: initial?.university || "",
    description: initial?.description || "",
    media: initial?.media || [],
    featured: initial?.featured || false,
    featuredOrder: initial?.featuredOrder || 0,
    order: initial?.order || 0,
  });
  const [loading, setLoading] = useState(false);

  const sortableMedia = value.media.map((item) => ({ ...item, id: item.assetId }));

  return (
    <form
      className="admin-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        await onSave({ ...value, slug: value.slug || slugify(value.title) });
        setLoading(false);
      }}
    >
      <div className="admin-form-grid">
        <label>
          <span>Tiêu đề — Nội dung tiếng Anh</span>
          <input
            onChange={(event) => setValue({ ...value, title: event.target.value })}
            required
            value={value.title}
          />
        </label>
        <label>
          <span>Slug</span>
          <input
            onChange={(event) => setValue({ ...value, slug: event.target.value })}
            placeholder={slugify(value.title)}
            value={value.slug}
          />
        </label>
        <label>
          <span>Thành phố</span>
          <select
            onChange={(event) => setValue({ ...value, cityId: event.target.value })}
            required
            value={value.cityId}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Mục đích</span>
          <select
            onChange={(event) =>
              setValue({ ...value, listingType: event.target.value as ListingType })
            }
            required
            value={value.listingType}
          >
            <option value="sale">Rao bán (For sale)</option>
            <option value="long-term">Cho thuê dài hạn</option>
            <option value="short-term">Cho thuê ngắn hạn / Airbnb</option>
          </select>
        </label>
        <label>
          <span>Loại hình</span>
          <select
            onChange={(event) =>
              setValue({ ...value, propertyType: event.target.value as PropertyType })
            }
            required
            value={value.propertyType}
          >
            <option value="apartment">Căn hộ (Apartment)</option>
            <option value="house">Nhà (House)</option>
          </select>
        </label>
        <label>
          <span>Giá (£)</span>
          <input
            min={1}
            onChange={(event) => setValue({ ...value, price: Number(event.target.value) })}
            required
            type="number"
            value={value.price || ""}
          />
        </label>
        <label>
          <span>Phòng ngủ</span>
          <input
            min={0}
            onChange={(event) => setValue({ ...value, bedrooms: Number(event.target.value) })}
            required
            type="number"
            value={value.bedrooms}
          />
        </label>
        <label>
          <span>Phòng tắm</span>
          <input
            min={0}
            onChange={(event) => setValue({ ...value, bathrooms: Number(event.target.value) })}
            required
            type="number"
            value={value.bathrooms}
          />
        </label>
        <label>
          <span>Diện tích — Nội dung tiếng Anh</span>
          <input
            onChange={(event) => setValue({ ...value, area: event.target.value })}
            placeholder="850 sq ft"
            required
            value={value.area}
          />
        </label>
        <label>
          <span>Gần trường đại học — Nội dung tiếng Anh (tùy chọn)</span>
          <input
            onChange={(event) => setValue({ ...value, university: event.target.value })}
            placeholder="University of Manchester"
            value={value.university}
          />
        </label>
      </div>
      <label>
        <span>Mô tả chi tiết — Nội dung tiếng Anh</span>
        <textarea
          onChange={(event) => setValue({ ...value, description: event.target.value })}
          required
          rows={5}
          value={value.description}
        />
      </label>
      <label className="admin-checkbox">
        <input
          checked={value.featured}
          onChange={(event) => setValue({ ...value, featured: event.target.checked })}
          type="checkbox"
        />
        <span>Hiển thị trong Featured Properties</span>
      </label>
      <div className="admin-field">
        <span>Album ảnh</span>
        <small>
          Kéo thả để sắp xếp. Ảnh đầu tiên là ảnh chính; album trên FE bắt đầu từ ảnh
          thứ hai.
        </small>
        <SortableList
          className="admin-media-grid"
          items={sortableMedia}
          onChange={(items) =>
            setValue({
              ...value,
              media: items.map(({ assetId, url, alt }) => ({ assetId, url, alt })),
            })
          }
          renderItem={(item, index) => (
            <div className="admin-media-card">
              <div className="admin-preview admin-preview-project">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={item.alt} src={item.url} />
              </div>
              <strong>{index === 0 ? "Ảnh chính" : `Ảnh phụ ${index}`}</strong>
              <input
                aria-label={`Alt ảnh ${index + 1}`}
                onChange={(event) => {
                  const media = [...value.media];
                  media[index] = { ...media[index], alt: event.target.value };
                  setValue({ ...value, media });
                }}
                placeholder="Alt ảnh — tiếng Anh"
                required
                value={item.alt}
              />
              <button
                className="admin-danger-text"
                onClick={() =>
                  setValue({
                    ...value,
                    media: value.media.filter((media) => media.assetId !== item.assetId),
                  })
                }
                type="button"
              >
                Xóa ảnh
              </button>
            </div>
          )}
        />
        <MediaUploader
          accept="image/jpeg,image/png,image/webp,image/avif"
          kind="image"
          label="Thêm ảnh BĐS"
          multiple
          onUploaded={(asset) =>
            setValue((current) => ({
              ...current,
              media: [
                ...current.media,
                { assetId: asset.id, url: asset.url, alt: asset.originalName },
              ],
            }))
          }
        />
        <div className="admin-ratio-note">
          Preview ảnh chính: hero 16:9, card 3:4 và 1:1. Ảnh phụ: album 4:3.
        </div>
      </div>
      <FormActions loading={loading} onCancel={onCancel} />
    </form>
  );
}

export function SettingsForm({
  initial,
  onSave,
}: {
  initial: SiteSettingsValue;
  onSave: (value: SiteSettingsValue) => Promise<void>;
}) {
  const [value, setValue] = useState(initial);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="admin-form admin-settings-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        await onSave(value);
        setLoading(false);
      }}
    >
      <div className="admin-field">
        <span>Logo footer — Preview 1:1, contain</span>
        <div className="admin-preview admin-preview-logo">
          {value.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="" src={value.logoUrl} />
          ) : (
            <p>Chưa có logo</p>
          )}
        </div>
        <MediaUploader
          accept="image/jpeg,image/png,image/webp,image/avif"
          kind="image"
          label="Thay logo"
          onUploaded={(asset) =>
            setValue({ ...value, logoAssetId: asset.id, logoUrl: asset.url })
          }
        />
      </div>
      <label>
        <span>Tên công ty — Nội dung tiếng Anh</span>
        <input
          onChange={(event) => setValue({ ...value, companyName: event.target.value })}
          required
          value={value.companyName}
        />
      </label>
      <label>
        <span>Slogan — Nội dung tiếng Anh</span>
        <input
          onChange={(event) => setValue({ ...value, slogan: event.target.value })}
          required
          value={value.slogan}
        />
      </label>
      <label>
        <span>Mô tả — Nội dung tiếng Anh</span>
        <textarea
          onChange={(event) => setValue({ ...value, description: event.target.value })}
          required
          rows={3}
          value={value.description}
        />
      </label>
      <label>
        <span>Địa chỉ — Nội dung tiếng Anh</span>
        <textarea
          onChange={(event) => setValue({ ...value, address: event.target.value })}
          required
          rows={3}
          value={value.address}
        />
      </label>
      <div className="admin-form-grid">
        <label>
          <span>Điện thoại</span>
          <input
            onChange={(event) => setValue({ ...value, phone: event.target.value })}
            required
            value={value.phone}
          />
        </label>
        <label>
          <span>Email</span>
          <input
            onChange={(event) => setValue({ ...value, email: event.target.value })}
            required
            type="email"
            value={value.email}
          />
        </label>
      </div>
      <label>
        <span>Copyright — Nội dung tiếng Anh</span>
        <input
          onChange={(event) => setValue({ ...value, copyright: event.target.value })}
          required
          value={value.copyright}
        />
      </label>
      <div className="admin-field">
        <div className="admin-section-heading">
          <span>Mạng xã hội</span>
          <button
            onClick={() =>
              setValue({
                ...value,
                socialLinks: [
                  ...value.socialLinks,
                  { label: "", href: "", iconAssetId: "", icon: "" },
                ],
              })
            }
            type="button"
          >
            Thêm mạng xã hội
          </button>
        </div>
        {value.socialLinks.map((social, index) => (
          <div className="admin-social-row" key={`${social.label}-${index}`}>
            <input
              aria-label="Tên mạng xã hội"
              onChange={(event) => {
                const socialLinks = [...value.socialLinks];
                socialLinks[index] = { ...social, label: event.target.value };
                setValue({ ...value, socialLinks });
              }}
              placeholder="Tên, ví dụ Facebook"
              required
              value={social.label}
            />
            <input
              aria-label="Liên kết mạng xã hội"
              onChange={(event) => {
                const socialLinks = [...value.socialLinks];
                socialLinks[index] = { ...social, href: event.target.value };
                setValue({ ...value, socialLinks });
              }}
              placeholder="https://..."
              required
              value={social.href}
            />
            {social.icon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="" src={social.icon} />
            ) : null}
            <MediaUploader
              accept="image/jpeg,image/png,image/webp,image/avif"
              kind="image"
              label="Icon"
              onUploaded={(asset) => {
                const socialLinks = [...value.socialLinks];
                socialLinks[index] = {
                  ...social,
                  iconAssetId: asset.id,
                  icon: asset.url,
                };
                setValue({ ...value, socialLinks });
              }}
            />
            <button
              className="admin-danger-text"
              onClick={() =>
                setValue({
                  ...value,
                  socialLinks: value.socialLinks.filter((_, itemIndex) => itemIndex !== index),
                })
              }
              type="button"
            >
              Xóa
            </button>
          </div>
        ))}
      </div>
      <div className="admin-form-actions">
        <button className="admin-primary" disabled={loading} type="submit">
          {loading ? "Đang lưu..." : "Lưu cấu hình footer"}
        </button>
      </div>
    </form>
  );
}
