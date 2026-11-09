import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { T } from "@/components/Bi";
import { RECEIPT_DUA } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Thank you for your donation", robots: { index: false } };

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ receipt?: string }> }) {
  const { receipt } = await searchParams;
  return (
    <section className="section">
      <div className="container-x max-w-2xl text-center">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-light text-deep"><Icon name="heart" size={30} /></span>
        <h1 className="mt-3 text-3xl font-bold"><T k="donate.thankTitle" /></h1>
        <p className="mt-2 text-ink/80"><T k="donate.thankText" /></p>
        {receipt && (
          <p className="mt-3 inline-block rounded-md bg-light px-3 py-1.5 font-mono text-sm font-bold text-deep" dir="ltr">
            {receipt}
          </p>
        )}
        <div className="mx-auto mt-5 max-w-md rounded-lg border border-gold/40 bg-[#fdf8e8] p-5">
          <p className="text-xl text-deep" dir="rtl" lang="ar">{RECEIPT_DUA.ar}</p>
          <p className="mt-1 text-sm font-semibold text-deep">{RECEIPT_DUA.en}</p>
          <p className="text-sm text-ink/70" dir="rtl">{RECEIPT_DUA.ur}</p>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent("Support scholarships at Jamia Ghousia Zia-Ul-Uloom: /donate")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-green"
          >
            <Icon name="whatsapp" size={16} /> <T k="donate.share" />
          </a>
          <Link href="/" className="btn btn-outline"><T k="nav.home" /></Link>
          <Link href="/qurbani" className="btn btn-outline"><T k="qurbani.title" /></Link>
        </div>
      </div>
    </section>
  );
}
