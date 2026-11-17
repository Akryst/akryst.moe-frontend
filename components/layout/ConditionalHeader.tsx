"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";

export function ConditionalHeader() {
  return usePathname() === "/" ? null : <Header />;
}
