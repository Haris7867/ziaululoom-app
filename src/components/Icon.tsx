import type { SVGProps } from "react";

export type IconName =
  | "book" | "quran" | "scroll" | "scale" | "mosque" | "recite" | "globe" | "coins"
  | "cap" | "heart" | "pdf" | "question" | "lock" | "cow" | "users" | "calendar"
  | "whatsapp" | "phone" | "mail" | "pin" | "clock" | "arrow" | "arrowLeft" | "search"
  | "menu" | "close" | "check" | "download" | "share" | "print" | "star" | "chevron"
  | "facebook" | "youtube" | "instagram" | "x" | "play" | "pause" | "sun" | "moon"
  | "shield" | "file" | "money" | "external" | "edit" | "trash" | "plus" | "logout" | "copy";

const paths: Record<IconName, string> = {
  book: "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5ZM4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5A2.5 2.5 0 0 1 4 20.5Z",
  quran: "M12 3v18M5 6h14M5 6a3 3 0 0 0 0 6h14a3 3 0 0 0 0-6M7 14h10M7 18h10",
  scroll: "M6 3h12v18H6zM9 7h6M9 11h6M9 15h4",
  scale: "M12 3v18M6 21h12M4 8h16M4 8l3 6a3 3 0 0 0 6 0L10 8M14 8l3 6a3 3 0 0 0 6 0l-3-6",
  mosque: "M12 3c2 3 4 4 4 7H8c0-3 2-4 4-7ZM4 21V11h4v10M16 21V11h4v10M9 21v-5a3 3 0 0 1 6 0v5M3 21h18",
  recite: "M3 18c3-8 5-11 9-11s6 3 9 11M7 12h10M12 4v2",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  coins: "M8 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM14 5a4 4 0 0 1 0 8M14 13a4 4 0 0 1 0 6M6 21h12",
  cap: "M2 8l10-4 10 4-10 4L2 8Zm4 3v5c0 2 3 3 6 3s6-1 6-3v-5",
  heart: "M12 20s-7-4.5-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.5 12 20 12 20Z",
  pdf: "M6 3h8l4 4v14H6zM14 3v5h5M9 13h6M9 17h4",
  question: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM9.5 9a2.5 2.5 0 1 1 3.6 2.3c-.7.4-1.1 1-1.1 1.9M12 17h.01",
  lock: "M6 11h12v10H6zM9 11V7a3 3 0 0 1 6 0v4M12 15v3",
  cow: "M5 8c0-2 1.5-3 3-3h8c1.5 0 3 1 3 3v4c0 4-3 8-7 8s-7-4-7-8V8Zm3-3-1-3M16 5l1-3M8 11h.01M16 11h.01M10 16h4",
  users: "M8 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2 21c0-3.5 2.7-6 6-6s6 2.5 6 6M16 4a3.5 3.5 0 0 1 0 7M17 15c3 0 5 2.5 5 6",
  calendar: "M4 6h16v15H4zM8 3v5M16 3v5M4 11h16M8 15h3M8 18h6",
  whatsapp: "M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Zm-2.7 6.2c.2-.5.4-.5.7-.5h.6c.2 0 .4 0 .6.5l.6 1.4c.1.3 0 .5-.2.7l-.4.5c-.1.2-.2.3 0 .6.4.6 1.6 1.8 2.4 2.1.2.1.4 0 .5-.1l.6-.6c.2-.2.3-.2.6-.1l1.4.7c.2.1.3.2.3.4 0 .8-.6 1.6-1.3 1.7-.6.1-1.4.1-2.3-.2-1.5-.5-3.1-1.7-4.1-3.2-.6-.9-.7-1.7-.7-2.2 0-.3.1-.6.1-.7Z",
  phone: "M6 3h3l2 5-2 1.5c1 2 2.5 3.5 4.5 4.5L15 12l5 2v3c0 1.5-1.5 3-3 3C10 20 4 14 4 7c0-1.5 1-4 2-4Z",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  pin: "M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3.5 2",
  arrow: "M4 12h15M13 6l6 6-6 6",
  arrowLeft: "M20 12H5M11 18l-6-6 6-6",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  check: "M4 12.5 9 18 20 6",
  download: "M12 3v12M7 11l5 5 5-5M4 21h16",
  share: "M8.7 13.3 15.3 17M15.3 7 8.7 10.7M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  print: "M7 8V3h10v5M7 17H5V9h14v8h-2M7 14h10v7H7z",
  star: "M12 3l2.9 5.9 6.1.9-4.5 4.4 1.1 6.3L12 17.6 6.4 20.5l1.1-6.3L3 9.8l6.1-.9L12 3Z",
  chevron: "M6 9l6 6 6-6",
  facebook: "M14 9V6.5c0-.8.7-1.5 1.5-1.5H17V2h-2.5A4.5 4.5 0 0 0 10 6.5V9H8v3h2v10h4V12h3l.5-3H14Z",
  youtube: "M3 8.5A3.5 3.5 0 0 1 6.5 5h11A3.5 3.5 0 0 1 21 8.5v7A3.5 3.5 0 0 1 17.5 19h-11A3.5 3.5 0 0 1 3 15.5v-7Zm7 1.5v4l4-2-4-2Z",
  instagram: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM17.5 6.5h.01",
  x: "M4 3l16 18M20 3 4 21",
  play: "M7 4l12 8-12 8V4Z",
  pause: "M7 4h4v16H7zM13 4h4v16h-4z",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19",
  moon: "M20 14A8 8 0 1 1 10 4a7 7 0 0 0 10 10Z",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Zm-3 9 2.5 2.5L15 10",
  file: "M6 3h8l4 4v14H6zM14 3v5h5",
  money: "M3 7h18v10H3zM12 12a2 2 0 1 0 0 0Z",
  external: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
  edit: "M4 20h4L20 8l-4-4L4 16v4ZM14 6l4 4",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6",
  plus: "M12 5v14M5 12h14",
  copy: "M8 8h9v12H8zM8 8V5h9v3M5 11H3v10h10v-2",
  logout: "M10 4H4v16h6M14 8l4 4-4 4M8 12h10",
};

export function Icon({
  name,
  size = 20,
  filled = false,
  ...props
}: { name: IconName; size?: number; filled?: boolean } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={paths[name] ?? paths.book} />
    </svg>
  );
}

const iconNames = Object.keys(paths) as IconName[];
export function iconExists(name: string): name is IconName {
  return iconNames.includes(name as IconName);
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <img src="/images/logo.png" alt="" width={64} height={60} className="h-14 w-auto shrink-0 object-contain" />
      <span className="font-display text-[1.2rem] font-bold leading-tight text-deep">Jamia Ghousia Zia-Ul-Uloom</span>
    </span>
  );
}
