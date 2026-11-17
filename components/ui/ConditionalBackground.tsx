"use client";

import { usePathname } from "next/navigation";
import { BlogBackground } from "@/components/blog/BlogBackground";
import { useBackgroundSettings } from "./BackgroundSettings";

export function ConditionalBackground() {
  const pathname = usePathname();
  const { underwater } = useBackgroundSettings();
  if (pathname.startsWith("/blog")) return <BlogBackground />;
  if (pathname.startsWith("/hos")) return null;
  return <div aria-hidden="true" className={underwater ? "demo-background demo-background--ocean" : "demo-background demo-background--night"} />;
}
