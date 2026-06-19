"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  BannerValue,
  CategoryValue,
  ContactSubmissionValue,
  MarqueeValue,
  PropertyValue,
  SiteSettingsValue,
} from "@/lib/cms-types";
import {
  BannerForm,
  CategoryForm,
  EditorModal,
  MarqueeForm,
  PropertyForm,
  SettingsForm,
} from "./admin-forms";
import SortableList from "./sortable-list";

type DashboardData = {
  banners: number;
  properties: number;
  categories: number;
  marquee: number;
  contacts: number;
};

type ContactsPage = {
  items: ContactSubmissionValue[];
  total: number;
  page: number;
  pages: number;
};

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Không thể xử lý yêu cầu.");
  return result as T;
}

function PageHeader({
  action,
  description,
  title,
}: {
  action?: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <div className="admin-page-header">
      <div>
        <p className="admin-kicker">CMS Maxxim Ltd.</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function ErrorNotice({ message }: { message: string }) {
  return message ? <div className="admin-notice admin-error">{message}</div> : null;
}

export default function AdminResource({ section }: { section: string }) {
  const [data, setData] = useState<unknown>(null);
  const [categories, setCategories] = useState<CategoryValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchSectionData = useCallback(async () => {
    const query =
      section === "contacts" ? `?q=${encodeURIComponent(search)}&page=${page}` : "";
    if (section === "properties") {
      const [propertiesData, categoryData] = await Promise.all([
        requestJson<PropertyValue[]>("/api/admin/properties"),
        requestJson<CategoryValue[]>("/api/admin/categories"),
      ]);
      return { nextData: propertiesData, nextCategories: categoryData };
    }

    return {
      nextData: await requestJson(`/api/admin/${section}${query}`),
      nextCategories: null,
    };
  }, [page, search, section]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { nextData, nextCategories } = await fetchSectionData();
      setData(nextData);
      if (nextCategories) setCategories(nextCategories);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [fetchSectionData]);

  useEffect(() => {
    let ignore = false;

    void fetchSectionData()
      .then(({ nextData, nextCategories }) => {
        if (ignore) return;
        setData(nextData);
        if (nextCategories) setCategories(nextCategories);
        setError("");
      })
      .catch((loadError) => {
        if (ignore) return;
        setError(
          loadError instanceof Error ? loadError.message : "Không thể tải dữ liệu.",
        );
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [fetchSectionData]);

  async function saveResource(resource: string, id: string | undefined, value: unknown) {
    setError("");
    try {
      await requestJson(`/api/admin/${resource}${id ? `/${id}` : ""}`, {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(value),
      });
      setEditing(null);
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Không thể lưu dữ liệu.");
      throw saveError;
    }
  }

  async function deleteResource(resource: string, id: string) {
    if (!window.confirm("Bạn chắc chắn muốn xóa nội dung này?")) return;
    setError("");
    try {
      await requestJson(`/api/admin/${resource}/${id}`, { method: "DELETE" });
      await load();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Không thể xóa dữ liệu.");
    }
  }

  async function reorder<T extends { id: string }>(
    resource: string,
    items: T[],
    update: (items: T[]) => void,
  ) {
    update(items);
    try {
      await requestJson(`/api/admin/${resource}`, {
        method: "POST",
        body: JSON.stringify({ action: "reorder", ids: items.map((item) => item.id) }),
      });
    } catch (reorderError) {
      setError(
        reorderError instanceof Error ? reorderError.message : "Không thể lưu thứ tự.",
      );
      await load();
    }
  }

  if (loading && !data) {
    return <div className="admin-loading">Đang tải dữ liệu CMS...</div>;
  }

  if (section === "dashboard") {
    const dashboard = data as DashboardData | null;
    const cards = dashboard
      ? [
          ["Banner", dashboard.banners],
          ["Bất động sản", dashboard.properties],
          ["Thành phố", dashboard.categories],
          ["Ảnh marquee", dashboard.marquee],
          ["Liên hệ", dashboard.contacts],
        ]
      : [];
    return (
      <>
        <PageHeader
          description="Tổng quan các nội dung đang được quản lý trên website."
          title="Bảng điều khiển"
        />
        <ErrorNotice message={error} />
        <div className="admin-stat-grid">
          {cards.map(([label, value]) => (
            <div className="admin-stat-card" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (section === "categories") {
    const items = (data || []) as CategoryValue[];
    const selected = editing && editing !== "new" ? items.find((item) => item.id === editing) : undefined;
    return (
      <>
        <PageHeader
          action={
            <button className="admin-primary" onClick={() => setEditing("new")} type="button">
              Thêm thành phố
            </button>
          }
          description="Kéo thả để thay đổi thứ tự bộ lọc thành phố trên website."
          title="Quản lý thành phố"
        />
        <ErrorNotice message={error} />
        <SortableList
          className="admin-list"
          items={items}
          onChange={(next) =>
            void reorder("categories", next, (updated) => setData(updated))
          }
          renderItem={(item) => (
            <div className="admin-list-content">
              <div>
                <strong>{item.name}</strong>
                <small>/{item.slug}</small>
              </div>
              <div className="admin-row-actions">
                <button onClick={() => setEditing(item.id)} type="button">
                  Sửa
                </button>
                <button
                  className="admin-danger-text"
                  onClick={() => void deleteResource("categories", item.id)}
                  type="button"
                >
                  Xóa
                </button>
              </div>
            </div>
          )}
        />
        {editing ? (
          <EditorModal
            onClose={() => setEditing(null)}
            title={editing === "new" ? "Thêm thành phố" : "Sửa thành phố"}
          >
            <CategoryForm
              initial={selected}
              onCancel={() => setEditing(null)}
              onSave={(value) =>
                saveResource(
                  "categories",
                  editing === "new" ? undefined : editing,
                  value,
                )
              }
            />
          </EditorModal>
        ) : null}
      </>
    );
  }

  if (section === "banners") {
    const items = (data || []) as BannerValue[];
    const selected = editing && editing !== "new" ? items.find((item) => item.id === editing) : undefined;
    return (
      <>
        <PageHeader
          action={
            <button className="admin-primary" onClick={() => setEditing("new")} type="button">
              Thêm banner
            </button>
          }
          description="Quản lý ảnh/video hero. Website luôn cần ít nhất một banner."
          title="Quản lý banner"
        />
        <ErrorNotice message={error} />
        <SortableList
          className="admin-card-list"
          items={items}
          onChange={(next) => void reorder("banners", next, (updated) => setData(updated))}
          renderItem={(item, index) => (
            <div className="admin-card-row">
              <div className="admin-thumbnail admin-thumbnail-wide">
                {item.type === "video" ? (
                  <video muted src={item.src} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt={item.alt} src={item.src} />
                )}
              </div>
              <div className="admin-card-copy">
                <small>Banner {index + 1} · {item.type === "video" ? "Video" : "Ảnh"}</small>
                <strong>{item.title}</strong>
                <span>{item.subtitle}</span>
              </div>
              <div className="admin-row-actions">
                <button onClick={() => setEditing(item.id)} type="button">Sửa</button>
                <button
                  className="admin-danger-text"
                  onClick={() => void deleteResource("banners", item.id)}
                  type="button"
                >
                  Xóa
                </button>
              </div>
            </div>
          )}
        />
        {editing ? (
          <EditorModal
            onClose={() => setEditing(null)}
            title={editing === "new" ? "Thêm banner" : "Sửa banner"}
          >
            <BannerForm
              initial={selected}
              onCancel={() => setEditing(null)}
              onSave={(value) =>
                saveResource("banners", editing === "new" ? undefined : editing, value)
              }
            />
          </EditorModal>
        ) : null}
      </>
    );
  }

  if (section === "marquee") {
    const items = (data || []) as MarqueeValue[];
    const selected = editing && editing !== "new" ? items.find((item) => item.id === editing) : undefined;
    return (
      <>
        <PageHeader
          action={
            <button className="admin-primary" onClick={() => setEditing("new")} type="button">
              Thêm ảnh
            </button>
          }
          description="Kéo thả để thay đổi thứ tự dải ảnh marquee trên trang chủ."
          title="Quản lý ảnh marquee"
        />
        <ErrorNotice message={error} />
        <SortableList
          className="admin-card-list"
          items={items}
          onChange={(next) => void reorder("marquee", next, (updated) => setData(updated))}
          renderItem={(item) => (
            <div className="admin-card-row">
              <div className="admin-thumbnail admin-thumbnail-wide">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={item.alt} src={item.src} />
              </div>
              <div className="admin-card-copy"><strong>{item.alt}</strong></div>
              <div className="admin-row-actions">
                <button onClick={() => setEditing(item.id)} type="button">Sửa</button>
                <button
                  className="admin-danger-text"
                  onClick={() => void deleteResource("marquee", item.id)}
                  type="button"
                >
                  Xóa
                </button>
              </div>
            </div>
          )}
        />
        {editing ? (
          <EditorModal
            onClose={() => setEditing(null)}
            title={editing === "new" ? "Thêm ảnh marquee" : "Sửa ảnh marquee"}
          >
            <MarqueeForm
              initial={selected}
              onCancel={() => setEditing(null)}
              onSave={(value) =>
                saveResource("marquee", editing === "new" ? undefined : editing, value)
              }
            />
          </EditorModal>
        ) : null}
      </>
    );
  }

  if (section === "properties") {
    const items = (data || []) as PropertyValue[];
    const selected = editing && editing !== "new" ? items.find((item) => item.id === editing) : undefined;
    const featured = items
      .filter((item) => item.featured)
      .sort((a, b) => a.featuredOrder - b.featuredOrder)
      .slice(0, 8);

    async function reorderFeatured(next: PropertyValue[]) {
      const nextIds = new Set(next.map((item) => item.id));
      setData(
        items.map((item) => ({
          ...item,
          featured: nextIds.has(item.id),
          featuredOrder: next.findIndex((featuredItem) => featuredItem.id === item.id),
        })),
      );
      try {
        await requestJson("/api/admin/properties", {
          method: "POST",
          body: JSON.stringify({
            action: "reorder-featured",
            ids: next.map((item) => item.id),
          }),
        });
      } catch (featuredError) {
        setError(featuredError instanceof Error ? featuredError.message : "Không thể lưu Featured.");
        await load();
      }
    }

    return (
      <>
        <PageHeader
          action={
            <button className="admin-primary" onClick={() => setEditing("new")} type="button">
              Thêm bất động sản
            </button>
          }
          description="Quản lý nội dung, album và thứ tự các bất động sản hiển thị trên website."
          title="Quản lý bất động sản"
        />
        <ErrorNotice message={error} />
        <section className="admin-panel">
          <div className="admin-section-heading">
            <div>
              <h2>Featured Properties</h2>
              <p>Tối đa 8 bất động sản. Chọn Featured trong form, sau đó kéo để sắp xếp.</p>
            </div>
            <span>{featured.length}/8</span>
          </div>
          <SortableList
            className="admin-featured-list"
            items={featured}
            onChange={(next) => void reorderFeatured(next)}
            renderItem={(item, index) => (
              <div className="admin-list-content">
                <strong>{index + 1}. {item.title}</strong>
                <span>{item.city} · £{item.price.toLocaleString("en-GB")}</span>
              </div>
            )}
          />
        </section>
        <section className="admin-panel">
          <div className="admin-section-heading"><h2>Tất cả bất động sản</h2></div>
          <SortableList
            className="admin-card-list"
            items={items}
            onChange={(next) => void reorder("properties", next, (updated) => setData(updated))}
            renderItem={(item) => (
              <div className="admin-card-row">
                <div className="admin-thumbnail">
                  {item.media[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt={item.media[0].alt} src={item.media[0].url} />
                  ) : null}
                </div>
                <div className="admin-card-copy">
                  <small>{item.city} · {item.listingType} · {item.bedrooms} bed</small>
                  <strong>{item.title}</strong>
                  <span>{item.featured ? "Đang Featured" : "Không Featured"} · £{item.price.toLocaleString("en-GB")}</span>
                </div>
                <div className="admin-row-actions">
                  <button onClick={() => setEditing(item.id)} type="button">Sửa</button>
                  <button
                    className="admin-danger-text"
                    onClick={() => void deleteResource("properties", item.id)}
                    type="button"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            )}
          />
        </section>
        {editing ? (
          <EditorModal
            onClose={() => setEditing(null)}
            title={editing === "new" ? "Thêm bất động sản" : "Sửa bất động sản"}
          >
            <PropertyForm
              categories={categories}
              initial={selected}
              onCancel={() => setEditing(null)}
              onSave={(value) =>
                saveResource("properties", editing === "new" ? undefined : editing, value)
              }
            />
          </EditorModal>
        ) : null}
      </>
    );
  }

  if (section === "contacts") {
    const contacts = data as ContactsPage | null;
    return (
      <>
        <PageHeader
          description="Danh sách yêu cầu được gửi từ form liên hệ trên website."
          title="Thông tin liên hệ"
        />
        <ErrorNotice message={error} />
        <form
          className="admin-search"
          onSubmit={(event) => {
            event.preventDefault();
            setPage(1);
            void load();
          }}
        >
          <input
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo tên, email hoặc số điện thoại"
            value={search}
          />
          <button type="submit">Tìm kiếm</button>
        </form>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ngày gửi</th>
                <th>Họ tên</th>
                <th>Điện thoại</th>
                <th>Email</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {contacts?.items.map((contact) => (
                <tr key={contact.id}>
                  <td>{new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(contact.createdAt))}</td>
                  <td>{contact.fullName}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.email}</td>
                  <td><button onClick={() => setEditing(contact.id)} type="button">Xem</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-pagination">
          <button disabled={(contacts?.page || 1) <= 1} onClick={() => setPage((current) => current - 1)} type="button">Trang trước</button>
          <span>Trang {contacts?.page || 1}/{contacts?.pages || 1} · {contacts?.total || 0} liên hệ</span>
          <button disabled={(contacts?.page || 1) >= (contacts?.pages || 1)} onClick={() => setPage((current) => current + 1)} type="button">Trang sau</button>
        </div>
        {editing ? (
          <EditorModal onClose={() => setEditing(null)} title="Chi tiết liên hệ">
            <ContactDetail
              contact={contacts?.items.find((item) => item.id === editing)}
            />
          </EditorModal>
        ) : null}
      </>
    );
  }

  if (section === "settings") {
    const settings = data as SiteSettingsValue | null;
    return (
      <>
        <PageHeader
          description="Quick Links và design credit vẫn được giữ cố định trong mã nguồn."
          title="Cấu hình footer"
        />
        <ErrorNotice message={error} />
        {settings ? (
          <section className="admin-panel">
            <SettingsForm
              initial={settings}
              onSave={(value) => saveResource("settings", settings.id, value)}
            />
          </section>
        ) : null}
      </>
    );
  }

  return null;
}

function ContactDetail({ contact }: { contact?: ContactSubmissionValue }) {
  if (!contact) return <p>Không tìm thấy thông tin liên hệ.</p>;
  return (
    <dl className="admin-contact-detail">
      <div><dt>Họ tên</dt><dd>{contact.fullName}</dd></div>
      <div><dt>Điện thoại</dt><dd>{contact.phone}</dd></div>
      <div><dt>Email</dt><dd>{contact.email}</dd></div>
      <div><dt>Thời gian gửi</dt><dd>{new Date(contact.createdAt).toLocaleString("vi-VN")}</dd></div>
      <div><dt>Nội dung dự án</dt><dd>{contact.projectBrief}</dd></div>
    </dl>
  );
}
