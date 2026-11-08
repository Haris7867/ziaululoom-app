import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminPage } from "@/lib/admin-guard";
import { can } from "@/lib/auth";
import {
  getAllAnnouncements, getAllPdfResources, getAllProgrammes, getEvents, getSeasonalBanners,
} from "@/lib/data";
import {
  bulkPhotosAction, createAnnouncementAction, createEventAction, createPdfAction, toggleAnnouncementAction,
  togglePdfStatusAction, toggleSeasonalAction,
} from "../actions";
import { formatDate, formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Content admin", robots: { index: false } };

const TABS = ["announcements", "events", "photos", "library", "seasonal", "programmes"] as const;
type Tab = (typeof TABS)[number];

export default async function AdminContentPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await requireAdminPage();
  const { tab: rawTab } = await searchParams;
  const tab: Tab = (TABS as readonly string[]).includes(rawTab ?? "") ? (rawTab as Tab) : "announcements";
  const [announcements, events, pdfs, seasonal, programmes] = await Promise.all([
    getAllAnnouncements(), getEvents(), getAllPdfResources(), getSeasonalBanners(), getAllProgrammes(),
  ]);
  const allowed = can(user.role, "content.manage");

  return (
    <div className="space-y-4">
      <header className="card p-4">
        <p className="eyebrow">Content</p>
        <h1 className="text-2xl font-bold">Content, PDFs &amp; seasonal banners</h1>
        <p className="text-sm text-ink/65">
          {allowed ? "Changes are logged in the audit trail. Drafts and scheduled publishing are supported." : "Your role has read-only access to content."}
        </p>
      </header>

      <nav className="flex flex-wrap gap-1.5">
        {TABS.map((item) => (
          <Link key={item} href={`/admin/content?tab=${item}`} className={`rounded-md border px-3 py-1.5 text-xs font-semibold capitalize ${tab === item ? "border-deep bg-deep text-white" : "border-deep/20 bg-white text-deep hover:bg-light"}`}>
            {item}
          </Link>
        ))}
      </nav>

      {tab === "announcements" && (
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          {allowed && (
            <form action={createAnnouncementAction} className="card space-y-2 p-4">
              <h2 className="text-lg font-bold">New announcement</h2>
              <input name="titleEn" required placeholder="Title (English)" className="input !py-1.5 text-sm" />
              <input name="titleUr" placeholder="عنوان (اردو)" dir="rtl" className="input !py-1.5 text-sm" />
              <textarea name="bodyEn" rows={2} placeholder="Body (English, optional)" className="textarea !py-1.5 text-sm" />
              <textarea name="bodyUr" rows={2} dir="rtl" placeholder="متن (اردو، اختیاری)" className="textarea !py-1.5 text-sm" />
              <label className="flex items-center gap-2 text-xs"><input type="checkbox" name="pinned" className="h-4 w-4 accent-[#00633A]" /> Pin to the homepage ticker</label>
              <button type="submit" className="btn btn-primary w-full !py-1.5 !text-xs">Create announcement</button>
            </form>
          )}
          <div className="card p-4">
            <h2 className="text-lg font-bold">Announcements ({announcements.length})</h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              {announcements.map((item) => (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-deep/10 pb-1.5">
                  <div>
                    <p className="font-medium">{item.titleEn}</p>
                    <p className="text-xs text-ink/55" dir="rtl">{item.titleUr}</p>
                    <p className="text-[0.65rem] text-ink/45">{formatDate(item.date)} · {item.active ? "live" : "hidden"}{item.pinned ? " · pinned" : ""}</p>
                  </div>
                  {allowed && (
                    <form action={toggleAnnouncementAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="active" value={String(!item.active)} />
                      <button type="submit" className="btn btn-outline !px-2 !py-1 !text-[0.65rem]">{item.active ? "Hide" : "Show"}</button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === "events" && (
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          {allowed && (
            <form action={createEventAction} className="card space-y-2 p-4">
              <h2 className="text-lg font-bold">New event</h2>
              <input name="titleEn" required placeholder="Title (English)" className="input !py-1.5 text-sm" />
              <input name="titleUr" placeholder="عنوان (اردو)" dir="rtl" className="input !py-1.5 text-sm" />
              <input name="slug" placeholder="slug (optional)" className="input !py-1.5 text-sm" />
              <textarea name="descriptionEn" rows={2} placeholder="Description (English)" className="textarea !py-1.5 text-sm" />
              <textarea name="descriptionUr" rows={2} dir="rtl" placeholder="تفصیل (اردو)" className="textarea !py-1.5 text-sm" />
              <select name="type" className="select !py-1.5 text-sm">
                {["Ijtema", "Lecture", "Graduation", "Workshop", "Ramadan", "Qurbani"].map((type) => <option key={type}>{type}</option>)}
              </select>
              <input name="venueEn" placeholder="Venue (English)" className="input !py-1.5 text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <input name="startAt" type="datetime-local" className="input !py-1.5 text-xs" aria-label="Start" />
                <input name="endAt" type="datetime-local" className="input !py-1.5 text-xs" aria-label="End" />
              </div>
              <input name="coverImage" placeholder="Cover image URL" className="input !py-1.5 text-sm" />
              <input name="liveStreamUrl" placeholder="Live stream embed URL (optional)" className="input !py-1.5 text-sm" />
              <button type="submit" className="btn btn-primary w-full !py-1.5 !text-xs">Create event</button>
            </form>
          )}
          <div className="card p-4">
            <h2 className="text-lg font-bold">Events ({events.length})</h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              {events.map((event) => (
                <li key={event.id} className="border-b border-deep/10 pb-1.5">
                  <Link href={`/events/${event.slug}`} className="font-medium hover:text-fresh">{event.titleEn}</Link>
                  <p className="text-xs text-ink/55">{event.type} · {formatDateTime(event.startAt)} · {event.venueEn}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === "photos" && (
        <div className="card p-4">
          <h2 className="text-lg font-bold">Bulk photo upload</h2>
          <p className="text-xs text-ink/60">Paste up to 20 image URLs (one per line or space-separated). Images are compressed to WebP on upload; captions are stored in English and Urdu. Drag-and-drop uploads use the same endpoint.</p>
          {allowed ? (
            <form action={bulkPhotosAction} className="mt-2 grid gap-2">
              <textarea name="urls" rows={4} required placeholder="https://… (one per line)" className="textarea !py-1.5 text-xs" />
              <div className="grid gap-2 sm:grid-cols-2">
                <input name="captionEn" placeholder="Caption (English)" className="input !py-1.5 text-sm" />
                <input name="captionUr" placeholder="کیپشن (اردو)" dir="rtl" className="input !py-1.5 text-sm" />
                <input name="year" type="number" placeholder="Year" className="input !py-1.5 text-sm" />
                <select name="eventType" className="select !py-1.5 text-sm">
                  {["Ijtema", "Lecture", "Graduation", "Workshop", "Ramadan", "Qurbani"].map((type) => <option key={type}>{type}</option>)}
                </select>
                <select name="eventId" className="select !py-1.5 text-sm">
                  <option value="">No linked event</option>
                  {events.map((event) => <option key={event.id} value={event.id}>{event.titleEn}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary !py-1.5 !text-xs">Upload &amp; publish photos</button>
            </form>
          ) : <p className="mt-2 text-xs text-ink/55">Read-only role.</p>}
          <p className="mt-2 text-xs text-ink/55">Cover image flag, drag-and-drop re-ordering and per-photo approval are handled in the admin upload queue (placeholder).</p>
        </div>
      )}

      {tab === "library" && (
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          {allowed && (
            <form action={createPdfAction} className="card space-y-2 p-4">
              <h2 className="text-lg font-bold">Add PDF item</h2>
              <input name="titleEn" required placeholder="Title (English)" className="input !py-1.5 text-sm" />
              <input name="titleUr" placeholder="عنوان (اردو)" dir="rtl" className="input !py-1.5 text-sm" />
              <input name="slug" placeholder="slug (optional)" className="input !py-1.5 text-sm" />
              <select name="category" className="select !py-1.5 text-sm">
                {["Khutbat", "Durus-e-Quran", "Durus-e-Hadith", "Fiqh Masail", "Books", "Seerah", "Naat", "Bayans", "Prospectus"].map((category) => <option key={category}>{category}</option>)}
              </select>
              <input name="speaker" placeholder="Speaker" className="input !py-1.5 text-sm" />
              <textarea name="summaryEn" rows={2} placeholder="Two-line summary (English)" className="textarea !py-1.5 text-sm" />
              <textarea name="summaryUr" rows={2} dir="rtl" placeholder="خلاصہ (اردو)" className="textarea !py-1.5 text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <input name="pages" type="number" placeholder="Pages" className="input !py-1.5 text-sm" />
                <input name="fileSizeKb" type="number" placeholder="Size (KB)" className="input !py-1.5 text-sm" />
                <select name="language" className="select !py-1.5 text-sm"><option>Urdu</option><option>English</option></select>
                <select name="status" className="select !py-1.5 text-sm"><option value="draft">Draft</option><option value="published">Published now</option></select>
              </div>
              <input name="publishedAt" type="datetime-local" className="input !py-1.5 text-xs" aria-label="Scheduled publish" />
              <input name="fileUrl" placeholder="File URL / private storage path" className="input !py-1.5 text-sm" />
              <button type="submit" className="btn btn-primary w-full !py-1.5 !text-xs">Add item</button>
              <p className="text-[0.65rem] text-ink/50">Replacing the file keeps the same public link. Drafts are not listed publicly.</p>
            </form>
          )}
          <div className="card p-4">
            <h2 className="text-lg font-bold">Library items ({pdfs.length})</h2>
            <div className="mt-2 max-h-[32rem] space-y-1.5 overflow-y-auto text-sm">
              {pdfs.map((pdf) => (
                <div key={pdf.id} className="flex items-center justify-between gap-2 border-b border-deep/10 pb-1.5">
                  <div>
                    <Link href={`/library/${pdf.slug}`} className="font-medium hover:text-fresh">{pdf.titleEn}</Link>
                    <p className="text-[0.68rem] text-ink/55">{pdf.category} · {pdf.pages}p · {pdf.downloads} downloads · {formatDate(pdf.publishedAt)}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`badge !text-[0.6rem] ${pdf.status === "published" ? "" : "badge-grey"}`}>{pdf.status}</span>
                    {allowed && (
                      <form action={togglePdfStatusAction}>
                        <input type="hidden" name="id" value={pdf.id} />
                        <input type="hidden" name="status" value={pdf.status} />
                        <button type="submit" className="btn btn-outline !px-2 !py-0.5 !text-[0.6rem]">{pdf.status === "published" ? "Unpublish" : "Publish"}</button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "seasonal" && (
        <div className="card p-4">
          <h2 className="text-lg font-bold">Seasonal banners</h2>
          <p className="text-xs text-ink/60">The homepage stays neutral by default. Toggle a banner to show it; Muharram uses the solemn tone and no celebration banners.</p>
          <div className="mt-2 space-y-2">
            {seasonal.all.map((banner) => (
              <div key={banner.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-deep/10 p-2">
                <div>
                  <p className="text-sm font-semibold text-deep">{banner.seasonKey} · {banner.titleEn}</p>
                  <p className="text-xs text-ink/60">{banner.titleUr} · tone: {banner.tone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${banner.active ? "" : "badge-grey"}`}>{banner.active ? "visible" : "hidden"}</span>
                  {allowed && (
                    <form action={toggleSeasonalAction}>
                      <input type="hidden" name="id" value={banner.id} />
                      <input type="hidden" name="active" value={String(!banner.active)} />
                      <button type="submit" className="btn btn-outline !px-2 !py-1 !text-[0.65rem]">{banner.active ? "Hide" : "Show"}</button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink/55">Ramadan mode adds sehri/iftar timings, a Zakat calculator and pinned fatawa (scheduled from this panel in production).</p>
        </div>
      )}

      {tab === "programmes" && (
        <div className="card p-4">
          <h2 className="text-lg font-bold">Programmes ({programmes.length})</h2>
          <p className="text-xs text-ink/60">Fees and curriculum are editable per programme. Sample fees are shown here for verification.</p>
          <div className="mt-2 space-y-1.5 text-sm">
            {programmes.map((programme) => (
              <div key={programme.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-deep/10 pb-1.5">
                <div>
                  <Link href={`/academics/${programme.slug}`} className="font-medium hover:text-fresh">{programme.titleEn}</Link>
                  <p className="text-xs text-ink/55">{programme.level} · {programme.durationYears} years · {programme.mode} · {programme.department}</p>
                </div>
                <span className="text-xs font-semibold text-deep" dir="ltr">PKR {programme.feePerYear.toLocaleString("en-PK")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
