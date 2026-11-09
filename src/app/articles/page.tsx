import type { Metadata } from "next";
import { getArticles } from "@/lib/data";
import { ArticleCard } from "@/components/cards";
import { PageHero, SectionHeading } from "@/components/ui";
import { Bi, DateText, T } from "@/components/Bi";
import { IMAGES } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Articles & News",
  description: "Articles from Jamia Ghousia Zia-Ul-Uloom on Quranic Arabic, Zakat-funded scholarships, Qurbani and campus life.",
  alternates: { canonical: "/articles" },
};

export default async function ArticlesPage() {
  const articles = await getArticles();
  return (
    <>
      <PageHero image={IMAGES.library} eyebrowEn="News" eyebrowUr="خبریں" titleEn="Articles & News" titleUr="مضامین و خبریں" subtitleEn="Research notes, welfare updates and campus stories — in English and Urdu." subtitleUr="تحقیقی نوٹ، فلاحی اپڈیٹ اور کیمپس کی کہانیاں — انگریزی و اردو میں۔" />
      <section className="section">
        <div className="container-x">
          <div className="grid gap-4 md:grid-cols-3">
            {articles.map((article) => <ArticleCard key={article.id} {...article} />)}
          </div>
          <div className="mt-8 space-y-6">
            {articles.map((article) => (
              <article key={article.id} id={article.slug} className="card scroll-mt-24 p-5">
                <span className="badge">{article.category}</span>
                <h2 className="mt-2 text-2xl"><Bi en={article.titleEn} ur={article.titleUr} /></h2>
                <p className="text-xs text-ink/55"><DateText value={article.publishedAt} /></p>
                <div className="mt-2 space-y-2 text-ink/80">
                  {(article.bodyEn.includes("\n") ? article.bodyEn.split("\n") : [article.bodyEn]).map((paragraph, index) => (
                    <p key={index}><Bi en={paragraph} ur={article.bodyUr.split("\n")[index] ?? article.bodyUr} /></p>
                  ))}
                </div>
                <p className="mt-3 text-xs text-ink/50"><T k="brand.placeholder" /></p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
