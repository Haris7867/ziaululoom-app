"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { HERO_SLIDES } from "@/lib/site";
import { Icon } from "@/components/Icon";

export function HeroSlider() {
  const { pick, t } = useI18n();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  const go = useCallback((next: number) => {
    setIndex((next + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), 6000);
    return () => window.clearInterval(id);
  }, [paused]);

  useEffect(() => {
    const node = regionRef.current;
    if (!node) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(index + 1);
      if (event.key === "ArrowLeft") go(index - 1);
    };
    node.addEventListener("keydown", onKey);
    return () => node.removeEventListener("keydown", onKey);
  }, [index, go]);

  return (
    <section
      ref={regionRef}
      aria-roledescription="carousel"
      aria-label={t("brand.name")}
      className="relative isolate overflow-hidden bg-deep"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(delta) > 45) go(index + (delta < 0 ? 1 : -1));
        touchStart.current = null;
      }}
      tabIndex={0}
    >
      <div className="relative h-[520px] sm:h-[560px] lg:h-[600px]">
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.image}
            className={`hero-slide absolute inset-0 ${i === index ? "is-active" : ""}`}
            aria-hidden={i !== index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${HERO_SLIDES.length}`}
          >
            <img src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover" loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : "auto"} />
            <div className="absolute inset-0 bg-gradient-to-r from-deep/95 via-deep/75 to-deep/25" />
            <div className="container-x relative flex h-full flex-col justify-center pb-16 pt-10 text-white">
              <p className="eyebrow !text-gold">{pick(slide.eyebrowEn, slide.eyebrowUr)}</p>
              <h1 className="mt-2 max-w-2xl text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
                {pick(slide.titleEn, slide.titleUr)}
              </h1>
              <p className="arabic mt-4 font-display text-xl text-light/95" dir="rtl" lang="ar">{slide.verseAr}</p>
              <p className="mt-1.5 max-w-xl text-sm text-white/85 sm:text-base">{pick(slide.verseEn, slide.verseUr)}</p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link href="/academics" className="btn btn-green">{t("home.explore")} <Icon name="arrow" size={16} /></Link>
                <Link href="/donate" className="btn btn-gold">{t("nav.donate")} <Icon name="heart" size={16} /></Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <div className="container-x flex items-center justify-between gap-3 pb-4">
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((slide, i) => (
              <button
                key={slide.image}
                type="button"
                onClick={() => go(i)}
                aria-label={`Slide ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${i === index ? "w-7 bg-gold" : "w-2.5 bg-white/50 hover:bg-white"}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPaused((p) => !p)} className="rounded-full border border-white/40 p-2 text-white hover:bg-white/10" aria-label={paused ? t("home.play") : t("home.pause")}>
              <Icon name={paused ? "play" : "pause"} size={14} />
            </button>
            <button type="button" onClick={() => go(index - 1)} className="rounded-full border border-white/40 p-2 text-white hover:bg-white/10" aria-label="Previous slide">
              <Icon name="arrowLeft" size={16} />
            </button>
            <button type="button" onClick={() => go(index + 1)} className="rounded-full border border-white/40 p-2 text-white hover:bg-white/10" aria-label="Next slide">
              <Icon name="arrow" size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
