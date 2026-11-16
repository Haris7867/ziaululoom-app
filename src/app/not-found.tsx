"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { useI18n } from "@/i18n/provider";

type Result = { titleEn: string; titleUr: string; href: string; type: string };

const LINKS = [
  { href: "/academics", key: "nav.academics" },
  { href: "/admissions", key: "nav.admissions" },
  { href: "/library", key: "nav.library" },
  { href: "/darul-ifta", key: "nav.fatwa" },
  { href: "/qurbani", key: "nav.qurbani" },
  { href: "/donate", key: "nav.donate" },
  { href: "/events", key: "nav.events" },
  { href: "/contact", key: "nav.contact" },
];

export default function NotFound() {
  const { t, pick } = useI18n();
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Result[] | null>(null);

  async function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (term.trim().length < 2) return;
    const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
    const json = (await response.json()) as { results: Result[] };
    setResults(json.results ?? []);
  }

  return (
    <section className="section">
      <div className="container-x max-w-3xl text-center">
        <p className="font-display text-7xl font-bold text-deep">404</p>
        <h1 className="mt-1 text-3xl font-bold">{t("notfound.title")}</h1>
        <p className="mt-2 text-ink/75">{t("notfound.text")}</p>

        <form onSubmit={search} className="mx-auto mt-5 flex max-w-lg gap-2" role="search">
          <label htmlFor="notfound-search" className="sr-only">{t("common.search")}</label>
          <input id="notfound-search" value={term} onChange={(e) => setTerm(e.target.value)} className="input" placeholder={t("search.placeholder")} />
          <button type="submit" className="btn btn-primary shrink-0"><Icon name="search" size={16} /></button>
        </form>

        {results && (
          <div className="mt-4 text-start">
            {results.length === 0 ? (
              <p className="rounded-md bg-light p-3 text-sm text-deep">{t("common.notFound")}</p>
            ) : (
              <ul className="space-y-2">
                {results.map((result) => (
                  <li key={result.href}>
                    <Link href={result.href} className="flex items-center justify-between gap-2 rounded-md border border-deep/15 bg-white px-3 py-2 text-sm hover:bg-light">
                      <span className="font-medium text-deep">{pick(result.titleEn, result.titleUr)}</span>
                      <span className="badge">{result.type}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="btn btn-outline !py-1.5 !text-xs">{t(link.key)}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}
