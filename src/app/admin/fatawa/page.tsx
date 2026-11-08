import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminPage } from "@/lib/admin-guard";
import { can } from "@/lib/auth";
import { getFatawa, getQuestions } from "@/lib/data";
import { answerQuestionAction, assignQuestionAction, toggleFatwaPublishedAction } from "../actions";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Darul Ifta admin", robots: { index: false } };

export default async function AdminFatawaPage() {
  const user = await requireAdminPage();
  const [questions, fatawa] = await Promise.all([getQuestions(), getFatawa()]);
  const allowed = can(user.role, "fatawa.manage");
  const months = new Map<string, number>();
  for (const fatwa of fatawa) {
    const key = new Date(fatwa.publishedAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
    months.set(key, (months.get(key) ?? 0) + 1);
  }

  return (
    <div className="space-y-4">
      <header className="card p-4">
        <p className="eyebrow">Darul Ifta</p>
        <h1 className="text-2xl font-bold">Question queue &amp; approvals</h1>
        <p className="text-sm text-ink/65">
          Answers cannot be published until a Mufti or the Darul Ifta board records approval. The approver and timestamp are stored with every fatwa.
          {!allowed && " Your role can view this queue but cannot approve answers."}
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-4 text-xs">
          {[
            ["Received", questions.filter((q) => q.status === "received").length],
            ["Under review", questions.filter((q) => q.status === "under_review").length],
            ["Urgent", questions.filter((q) => q.priority === "urgent").length],
            ["Published", fatawa.length],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded border border-deep/10 bg-light/60 p-2">
              <p className="font-semibold uppercase tracking-wide text-ink/55">{label}</p>
              <p className="font-display text-lg font-bold text-deep">{value}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="space-y-3">
        {questions.map((question) => (
          <article key={question.id} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-mono text-[0.7rem] text-ink/50">{question.trackingNumber} · {formatDateTime(question.createdAt)}</p>
                <h2 className="text-sm font-semibold text-ink">{question.question}</h2>
                <p className="text-xs text-ink/60">
                  {question.category} · {question.city} · {question.language.toUpperCase()} · {question.anonymous ? "anonymous" : question.name ?? "no name"} · {question.contact}
                </p>
                <p className="text-xs text-ink/50">Assigned: {question.assignedTo ?? "unassigned"} · duplicate check: no match found (placeholder)</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`badge ${question.priority === "urgent" ? "badge-gold" : ""}`}>{question.priority}</span>
                <span className="badge badge-grey">{question.status}</span>
              </div>
            </div>

            {allowed && (
              <>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-semibold text-deep">Answer &amp; approve</summary>
                  <form action={answerQuestionAction} className="mt-2 space-y-2">
                    <input type="hidden" name="id" value={question.id} />
                    <div className="grid gap-2 sm:grid-cols-2">
                      <label className="text-xs font-semibold text-ink/70">Answer (English)
                        <textarea name="answerEn" rows={4} className="textarea mt-1 !text-xs" defaultValue={question.answerEn ?? ""} />
                      </label>
                      <label className="text-xs font-semibold text-ink/70">Answer (Urdu)
                        <textarea name="answerUr" rows={4} dir="rtl" className="textarea mt-1 !text-xs" defaultValue={question.answerUr ?? ""} />
                      </label>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button type="submit" name="publish" value="0" className="btn btn-outline !py-1.5 !text-xs">Save draft</button>
                      <button type="submit" name="publish" value="1" className="btn btn-primary !py-1.5 !text-xs">Approve &amp; publish</button>
                      <span className="text-[0.65rem] text-ink/50">Approved by {user.name}; a fatwa number is issued automatically.</span>
                    </div>
                  </form>
                </details>
                <form action={assignQuestionAction} className="mt-2 flex flex-wrap items-end gap-2">
                  <input type="hidden" name="id" value={question.id} />
                  <select name="assignedTo" defaultValue={question.assignedTo ?? "Mufti Abdul Rahman"} className="select !w-56 !py-1 !text-xs">
                    <option>Mufti Abdul Rahman</option>
                    <option>Mufti Muhammad Owais</option>
                    <option>Darul Ifta Board</option>
                  </select>
                  <button type="submit" className="btn btn-outline !py-1 !text-xs">Assign</button>
                </form>
              </>
            )}
          </article>
        ))}
      </section>

      <section className="card p-4">
        <h2 className="text-lg font-bold">Published fatawa</h2>
        <div className="mt-2 space-y-1.5 text-sm">
          {fatawa.map((fatwa) => (
            <div key={fatwa.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-deep/10 pb-1.5">
              <div>
                <p className="font-mono text-[0.68rem] text-ink/50">{fatwa.fatwaNumber} · {fatwa.category}</p>
                <Link href={`/darul-ifta/${fatwa.slug}`} className="line-clamp-1 text-ink hover:text-fresh">{fatwa.questionEn}</Link>
                <p className="text-[0.65rem] text-ink/45">Approved by {fatwa.approvedBy} · {fatwa.approvedAt ? formatDateTime(fatwa.approvedAt) : "not recorded"}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge">{fatwa.status}</span>
                {allowed && (
                  <form action={toggleFatwaPublishedAction}>
                    <input type="hidden" name="id" value={fatwa.id} />
                    <input type="hidden" name="status" value={fatwa.status} />
                    <button type="submit" className="btn btn-outline !px-2 !py-1 !text-[0.65rem]">{fatwa.status === "published" ? "Unpublish" : "Publish"}</button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4">
        <h2 className="text-lg font-bold">Monthly report</h2>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {Array.from(months.entries()).map(([month, count]) => (
            <span key={month} className="rounded border border-deep/15 bg-light/60 px-2 py-1">{month}: {count} fatwa</span>
          ))}
        </div>
      </section>
    </div>
  );
}
