import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getFatawa, getFatwa } from "@/lib/data";
import { Bi, DateText, T, Pkr } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { ShareButton, Callout } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const fatwa = await getFatwa(slug);
  if (!fatwa) return { title: "Fatwa not found" };
  return {
    title: `${fatwa.fatwaNumber} — ${fatwa.category}`,
    description: fatwa.answerEn.slice(0, 158),
    alternates: { canonical: `/darul-ifta/${fatwa.slug}` },
    openGraph: { title: `${fatwa.fatwaNumber} — ${fatwa.category}`, description: fatwa.answerEn.slice(0, 158), images: ["/images/quran.jpg"] },
  };
}

export default async function FatwaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [fatwa, all] = await Promise.all([getFatwa(slug), getFatawa()]);
  if (!fatwa) notFound();
  const related = all.filter((item) => item.slug !== fatwa.slug && item.category === fatwa.category).slice(0, 3);
  const references = Array.isArray(fatwa.references) ? (fatwa.references as string[]) : [];
  const shareText = `${fatwa.fatwaNumber} — ${fatwa.questionEn}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "QAPage",
          mainEntity: {
            "@type": "Question",
            name: fatwa.questionEn,
            text: fatwa.questionEn,
            answerCount: 1,
            acceptedAnswer: {
              "@type": "Answer",
              text: fatwa.answerEn,
              author: { "@type": "Organization", name: "Darul Ifta, Jamia Ghousia Zia-Ul-Uloom" },
              dateCreated: new Date(fatwa.publishedAt).toISOString(),
            },
          },
        }}
      />
      <section className="section">
        <div className="container-x grid gap-7 lg:grid-cols-[1.7fr_1fr]">
          <article>
            <Link href="/darul-ifta" className="link-underline text-sm">← <T k="fatwa.backToIfta" /></Link>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="badge">{fatwa.category}</span>
              <span className="badge badge-dark">{fatwa.fatwaNumber}</span>
              <span className="badge badge-gold"><Icon name="shield" size={12} /> <T k="fatwa.approvedBy" /></span>
            </div>
            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
              <Bi en={fatwa.questionEn} ur={fatwa.questionUr} />
            </h1>
            <p className="mt-1 text-xs text-ink/55">
              <T k="common.date" />: <DateText value={fatwa.publishedAt} /> · <T k="fatwa.approvedOn" />: <DateText value={fatwa.approvedAt ?? fatwa.publishedAt} /> · {fatwa.approvedBy}
            </p>

            <div className="mt-5 space-y-4">
              <div className="card p-5">
                <h2 className="flex items-center gap-2 text-lg"><span className="inline-flex h-7 w-7 items-center justify-center rounded bg-light text-deep"><Icon name="question" size={15} /></span> <T k="fatwa.question" /></h2>
                <p className="mt-2 text-ink/85"><Bi en={fatwa.questionEn} ur={fatwa.questionUr} /></p>
                <p className="mt-2 text-[0.7rem] text-ink/50">
                  Personal details have been removed. The question is published in the asker&apos;s chosen language.
                </p>
              </div>
              <div className="card p-5">
                <h2 className="flex items-center gap-2 text-lg"><span className="inline-flex h-7 w-7 items-center justify-center rounded bg-light text-deep"><Icon name="check" size={15} /></span> <T k="fatwa.answer" /></h2>
                <div className="mt-2 space-y-3 text-ink/85">
                  <Bi en={fatwa.answerEn} ur={fatwa.answerUr} as="div" />
                </div>
                {references.length > 0 && (
                  <div className="mt-4 rounded-md bg-light/70 p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-deep"><T k="fatwa.references" /></p>
                    <ul className="mt-1 space-y-1 text-sm text-ink/80">
                      {references.map((reference) => <li key={reference}>• {reference}</li>)}
                    </ul>
                  </div>
                )}
              </div>
              <Callout icon="shield" title="Darul Ifta">
                <Bi
                  en="This answer reflects the Darul Ifta's understanding according to the Hanafi school. For personal circumstances, consult the Darul Ifta directly."
                  ur="یہ جواب دارالافتاء کی فقہ حنفی کے مطابق سمجھ ہے۔ ذاتی حالات کے لیے براہِ راست دارالافتاء سے رجوع کریں۔"
                />
              </Callout>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 no-print">
              <ShareButton message={`${shareText} — /darul-ifta/${fatwa.slug}`} />
              <a href={`https://wa.me/?text=${encodeURIComponent(`${shareText} /darul-ifta/${fatwa.slug}`)}`} className="btn btn-outline !py-1.5 !text-xs"><Icon name="share" size={14} /> <T k="common.shareFatwa" /></a>
              <Link href="/darul-ifta/ask" className="btn btn-primary !py-1.5 !text-xs"><Icon name="question" size={14} /> <T k="fatwa.submit" /></Link>
            </div>
          </article>

          <aside className="space-y-4">
            <div className="card p-5">
              <h2 className="text-lg"><T k="fatwa.approvedBy" /></h2>
              <dl className="mt-2 space-y-1.5 text-sm">
                <div className="flex justify-between gap-2"><dt className="text-ink/60"><T k="fatwa.number" /></dt><dd className="font-semibold" dir="ltr">{fatwa.fatwaNumber}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-ink/60"><T k="fatwa.category" /></dt><dd className="font-semibold">{fatwa.category}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-ink/60">Mufti</dt><dd className="font-semibold">{fatwa.muftiName ?? "Darul Ifta Board"}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-ink/60"><T k="fatwa.approvedOn" /></dt><dd className="font-semibold"><DateText value={fatwa.approvedAt ?? fatwa.publishedAt} /></dd></div>
              </dl>
              <p className="mt-2 text-[0.7rem] text-ink/50">{fatwa.approvedBy}</p>
            </div>
            {related.length > 0 && (
              <div className="card p-5">
                <h2 className="text-lg"><T k="common.related" /></h2>
                <ul className="mt-2 space-y-2 text-sm">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/darul-ifta/${item.slug}`} className="link-underline"><Bi en={item.questionEn} ur={item.questionUr} /></Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="card p-5">
              <h2 className="text-lg">Zakat & Sadaqah</h2>
              <p className="mt-1 text-sm text-ink/70">Use the Zakat calculator or ask a follow-up question.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link href="/donate?purpose=zakat" className="btn btn-outline !py-1.5 !text-xs"><Pkr amount={0} /> Zakat</Link>
                <Link href="/darul-ifta/ask" className="btn btn-green !py-1.5 !text-xs">Ask</Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}


