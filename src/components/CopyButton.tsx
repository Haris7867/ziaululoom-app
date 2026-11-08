"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import { useI18n } from "@/i18n/provider";

export function CopyButton({ value, label }: { value: string; label?: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }
  return (
    <button type="button" onClick={copy} className="btn btn-outline !py-1 !text-[0.68rem]">
      <Icon name={copied ? "check" : "copy"} size={12} /> {copied ? t("common.copied") : label ?? t("common.copy")}
    </button>
  );
}
