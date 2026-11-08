export function DecorBackground() {
  return (
    <div className="decor-bg" aria-hidden="true">
      <div className="decor-blob b1" />
      <div className="decor-blob b2" />
      <div className="decor-blob b3" />
      <svg className="decor-svg" viewBox="0 0 1440 2400" preserveAspectRatio="none">
        <path
          className="decor-wave"
          d="M-60 220 C 180 120, 320 340, 560 240 S 940 100, 1180 220 S 1480 360, 1520 280"
        />
        <path
          className="decor-wave"
          d="M-60 760 C 220 660, 360 900, 620 780 S 1020 640, 1260 780 S 1500 880, 1540 820"
          style={{ animationDelay: "-8s" }}
        />
        <path
          className="decor-wave"
          d="M-60 1460 C 200 1350, 380 1560, 640 1440 S 1000 1320, 1260 1440 S 1500 1560, 1540 1500"
          style={{ animationDelay: "-14s" }}
        />
        <path
          className="decor-zigzag"
          d="M0 420 L60 390 L120 420 L180 390 L240 420 L300 390 L360 420 L420 390 L480 420 L540 390 L600 420 L660 390 L720 420 L780 390 L840 420 L900 390 L960 420 L1020 390 L1080 420 L1140 390 L1200 420 L1260 390 L1320 420 L1380 390 L1440 420"
        />
        <path
          className="decor-zigzag"
          d="M0 1820 L60 1790 L120 1820 L180 1790 L240 1820 L300 1790 L360 1820 L420 1790 L480 1820 L540 1790 L600 1820 L660 1790 L720 1820 L780 1790 L840 1820 L900 1790 L960 1820 L1020 1790 L1080 1820 L1140 1790 L1200 1820 L1260 1790 L1320 1820 L1380 1790 L1440 1820"
          style={{ animationDelay: "-9s" }}
        />
        <line className="decor-line" x1="120" y1="0" x2="120" y2="2400" />
        <line className="decor-line" x1="1320" y1="0" x2="1320" y2="2400" style={{ animationDelay: "-12s" }} />
        <line className="decor-line" x1="720" y1="0" x2="720" y2="2400" style={{ animationDelay: "-22s" }} />
        <circle cx="180" cy="1080" r="5" fill="#3FA66B" opacity="0.22" />
        <circle cx="1260" cy="1260" r="4" fill="#00633A" opacity="0.18" />
        <circle cx="380" cy="1980" r="6" fill="#3FA66B" opacity="0.16" />
      </svg>
    </div>
  );
}

export function AnimatedDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`divider-anim ${className}`} aria-hidden="true">
      <span className="dash" />
      <span className="gem">◆ ◆ ◆</span>
      <span className="dash" />
    </div>
  );
}
